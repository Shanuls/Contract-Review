import React, { useState } from 'react';
import { Check, X, ShieldAlert, Play, CheckCircle2, ShieldOff, ChevronDown, FileText, History, ExternalLink } from 'lucide-react';
import { EditDeliverablesModal } from './Modals';
import { useTheme } from '../context/ThemeContext';

// Browsers commonly block top-level navigation to data: URLs. Convert uploaded
// browser-only documents to temporary blob URLs when the user explicitly opens one.
function openContractDocument(event, url) {
  if (!url?.startsWith('data:')) return;
  event.preventDefault();
  try {
    const comma = url.indexOf(',');
    if (comma < 0) throw new Error('Invalid document data');
    const header = url.slice(5, comma);
    const mime = header.split(';')[0] || 'application/octet-stream';
    const encoded = url.slice(comma + 1);
    const binary = header.includes(';base64') ? atob(encoded) : decodeURIComponent(encoded);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: mime }));
    const opened = window.open(objectUrl, '_blank');
    if (opened) opened.opener = null;
    if (!opened) {
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'contract-document.' + (mime === 'application/pdf' ? 'pdf' : 'bin');
      link.click();
    }
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 120000);
  } catch (error) {
    console.error('Could not open uploaded document', error);
    window.alert('Unable to open this document. Please upload the file again.');
  }
}

export default function DetailPanel({
  contract,
  startedReviewIds = [],
  setStartedReviewIds,
  onStartReview,
  onTriggerApprove,
  onOpenReasonModal,
  onResumeReview,
  onRework,
  onUpdateLineItemQty,
  onSaveAllDeliverables,
  isLoading = false,
  hasError = false,
  currentUserRole = 'Reviewer'
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  const theme = {
    bg: 'var(--bg-main)',
    cardBg: 'var(--bg-card)',
    subtleBg: 'var(--bg-subtle)',
    border: 'var(--border-color)',
    borderLight: 'var(--border-light)',
    textMain: 'var(--text-main)',
    textMuted: 'var(--text-muted)',
    auditRowBg: 'var(--bg-subtle)'
  };

  const priorityColors = {
    HIGH: { bg: 'var(--badge-high-bg)', color: 'var(--badge-high-text)', border: 'var(--badge-high-border)' },
    MEDIUM: { bg: 'var(--badge-medium-bg)', color: 'var(--badge-medium-text)', border: 'var(--badge-medium-border)' },
    LOW: { bg: 'var(--badge-low-bg)', color: 'var(--badge-low-text)', border: 'var(--badge-low-border)' }
  };

  const statusColors = {
    'New': { bg: 'var(--badge-open-bg)', color: 'var(--badge-open-text)', border: 'var(--badge-open-border)' },
    'Open': { bg: 'var(--badge-open-bg)', color: 'var(--badge-open-text)', border: 'var(--badge-open-border)' },
    'In Review': { bg: 'var(--badge-review-bg)', color: 'var(--badge-review-text)', border: 'var(--badge-review-border)' },
    'Rework': { bg: 'var(--badge-review-bg)', color: 'var(--badge-review-text)', border: 'var(--badge-review-border)' },
    'Approved': { bg: 'var(--badge-approved-bg)', color: 'var(--badge-approved-text)', border: 'var(--badge-approved-border)' },
    'Blocked': { bg: 'var(--badge-blocked-bg)', color: 'var(--badge-blocked-text)', border: 'var(--badge-blocked-border)' },
    'Rejected': { bg: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected-text)', border: 'var(--badge-rejected-border)' }
  };

  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: theme.bg,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ height: '24px', width: '40%', backgroundColor: isDark ? '#1f1f1f' : '#e2e8f0', borderRadius: '4px' }} />
        <div style={{ height: '14px', width: '25%', backgroundColor: isDark ? '#141414' : '#f1f5f9', borderRadius: '4px' }} />
        <div style={{ height: '90px', width: '100%', backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}` }} />
        <div style={{ height: '140px', width: '100%', backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}` }} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.textMuted,
          fontSize: '13px',
          backgroundColor: theme.bg,
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
          Contract details unavailable
        </div>
        <div>We couldn't load the queue. Your decisions are saved. Try again.</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.textMuted,
          fontSize: '13px',
          backgroundColor: theme.bg,
          padding: '24px',
          textAlign: 'center'
        }}
      >
        All caught up. No contracts are waiting for review.
      </div>
    );
  }

  const isClosed = contract.status === 'Approved' || contract.status === 'Rejected';
  const isBlocked = contract.status === 'Blocked';
  const isReviewActive = startedReviewIds.includes(contract.id);
  const isHighTier = Number(contract.value) >= 7500000;
  const canEdit = !isHighTier || currentUserRole === 'Senior Reviewer';
  const isPermittedToApprove = !isHighTier || currentUserRole === 'Senior Reviewer';

  const handleStartReviewClick = () => {
    if (!canEdit) return;
    setStartedReviewIds((prev) => [...prev, contract.id]);
    onStartReview(contract.id);
  };

  const sStyle = statusColors[contract.status] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569', border: isDark ? '#334155' : '#e2e8f0' };
  const pStyle = priorityColors[contract.priority] || priorityColors.LOW;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateObj = new Date(contract.dueDate);
  dueDateObj.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDateObj - today) / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '10px 14px',
        boxSizing: 'border-box',
        minWidth: 0
      }}
    >
      {isHighTier && !isPermittedToApprove && (
        <div
          style={{
            backgroundColor: isDark ? '#422006' : '#fffbeb',
            border: `1px solid ${isDark ? '#78350f' : '#fde68a'}`,
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '11px',
            color: isDark ? '#fb923c' : '#b45309',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '7px'
          }}
        >
          <ShieldOff size={14} />
          <span><strong>Permission Notice:</strong> Only senior reviewers can approve contracts above ₹ 75 lakh.</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="queue-sticky-review-header"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          borderBottom: `1px solid ${theme.borderLight}`,
          paddingBottom: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: isDark ? '#172554' : '#eff6ff',
                color: '#3b82f6',
                fontSize: '12px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${isDark ? '#1e3a8a' : '#bfdbfe'}`,
                whiteSpace: 'nowrap'
              }}
            >
              {contract.id}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {!isClosed && !isBlocked && !isReviewActive && (
              <button
                type="button"
                onClick={handleStartReviewClick}
                disabled={!canEdit}
                title={!canEdit ? "Permission denied: senior reviewer required" : ""}
                style={{
                  backgroundColor: !canEdit ? '#94a3b8' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Play size={14} /> Start Review
              </button>
            )}
            {contract.status === 'Rejected' && onRework && (
              <button type="button" onClick={() => onRework(contract.id)} className="queue-rework-button" style={{background:'var(--badge-review-bg)',color:'var(--badge-review-text)',border:'1px solid var(--badge-review-border)',borderRadius:6,padding:'7px 14px',cursor:'pointer'}}>Rework &amp; Resubmit</button>
            )}
            {isBlocked && (
              <button
                type="button"
                onClick={() => {
                  setStartedReviewIds((prev) => [...prev, contract.id]);
                  onResumeReview(contract.id);
                }}
                style={{
                  backgroundColor: isDark ? '#172554' : '#eff6ff',
                  color: '#3b82f6',
                  border: `1px solid ${isDark ? '#1e3a8a' : '#bfdbfe'}`,
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Resume Review
              </button>
            )}
            {!isClosed && isReviewActive && !isBlocked && (
              <>
                <button
                  type="button"
                  onClick={() => onTriggerApprove(contract)}
                  disabled={!isPermittedToApprove}
                  title={!isPermittedToApprove ? "Only senior reviewers can approve contracts above ₹ 75 lakh." : ""}
                  style={{
                    backgroundColor: isPermittedToApprove ? '#2563eb' : (isDark ? '#334155' : '#94a3b8'),
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isPermittedToApprove ? 'pointer' : 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Check size={14} /> Approve (A)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenReasonModal('Reject')}
                  style={{
                    backgroundColor: theme.cardBg,
                    color: '#f87171',
                    border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <X size={14} /> Reject (R)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenReasonModal('Block')}
                  style={{
                    backgroundColor: theme.cardBg,
                    color: '#fb923c',
                    border: `1px solid ${isDark ? '#78350f' : '#fde68a'}`,
                    borderRadius: '6px',
                    padding: '7px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <ShieldAlert size={14} /> Block (B)
                </button>
              </>
            )}
            {isClosed && (
              <span
                style={{
                  backgroundColor: sStyle.bg,
                  color: sStyle.color,
                  border: `1px solid ${sStyle.border}`,
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                {contract.status}
              </span>
            )}
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: theme.textMain,
              margin: '2px 0 0',
              lineHeight: '1.35',
              wordBreak: 'break-word'
            }}
          >
            {contract.title}
          </h2>
        </div>

        <div style={{ fontSize: '12px', color: theme.textMuted }}>
          {contract.supplier} • {contract.category}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: theme.subtleBg,
              border: `1px solid ${theme.border}`,
              padding: '3px 8px',
              borderRadius: '6px'
            }}
          >
            <span style={{ fontWeight: 800, color: theme.textMain, fontSize: '12px' }}>
              ₹ {contract.value.toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 700 }}>
              ({(contract.value / 100000).toFixed(1)} Lakh)
            </span>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: pStyle.bg,
              color: pStyle.color,
              border: `1px solid ${pStyle.border}`,
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '11px'
            }}
          >
            {contract.priority}
          </span>
          {isOverdue && <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isOverdue ? (isDark ? '#5e3030' : '#fef2f2') : theme.subtleBg,
              color: isOverdue ? '#f87171' : theme.textMuted,
              border: isOverdue ? `1px solid ${isDark ? '#461e1e' : '#fecaca'}` : `1px solid ${theme.border}`,
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '11px'
            }}
          >
            {isOverdue 
              ? `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`
              : `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`}
          </span>}
        </div>
      </div>

      <section className="queue-documents queue-compact-section">
        <h3 className="queue-compact-heading"><FileText size={13} aria-hidden="true" style={{verticalAlign:"-2px",marginRight:5}} />Documents <span className="queue-document-count">{(contract.documents || []).length}</span></h3>
        {(contract.documents || []).length ? (contract.documents || []).map(doc => (
          <div className="queue-document-row" key={doc.id || doc.name}>
            <span className="queue-document-name" title={doc.name}><FileText size={12} aria-hidden="true" style={{flexShrink:0,marginRight:5,verticalAlign:"-2px"}} /><strong>{doc.name} {doc.status === 'Sample metadata' ? '(sample)' : ''}</strong><span className="queue-document-type">{doc.type}</span></span>
            {doc.url && <a href={doc.url} onClick={event => openContractDocument(event, doc.url)} target="_blank" rel="noopener noreferrer" className="queue-document-link" aria-label={`View ${doc.name}`}><ExternalLink size={12} aria-hidden="true" style={{verticalAlign:"-2px",marginRight:4}} />View</a>}
          </div>
        )) : <span style={{fontSize:12,color:'var(--text-muted)'}}>No documents available for this contract.</span>}
      </section>
      {/* 2. Key Contractual Terms */}
      <div style={{ marginTop: '8px', border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', backgroundColor: theme.cardBg, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: theme.textMain, margin: 0, letterSpacing: '0.02em' }}>
            KEY CONTRACTUAL TERMS
          </h3>
          <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> Verified by Procurement Ops
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Service Level Agreement (SLA)</div>
            <div style={{ fontSize: '12px', color: theme.textMain, fontWeight: 600, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{contract.sla}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Payment Terms</div>
            <div style={{ fontSize: '12px', color: theme.textMain, fontWeight: 600, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{contract.paymentTerms}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Termination Clause</div>
            <div style={{ fontSize: '12px', color: theme.textMain, fontWeight: 600, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{contract.terminationClause}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Regulatory & Standards Compliance</div>
            <div style={{ fontSize: '12px', color: theme.textMain, fontWeight: 600, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{contract.compliance}</div>
          </div>
        </div>
      </div>

      {/* 3. Line Items & Deliverables */}
      <div style={{ marginTop: '8px', border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', backgroundColor: theme.cardBg, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: theme.textMain, margin: 0 }}>LINE ITEMS & DELIVERABLES</h3>
          
          {!isClosed && isReviewActive && !isBlocked && (
            <button
              type="button"
              onClick={() => canEdit && setIsEditModalOpen(true)}
                disabled={!canEdit}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.subtleBg,
                color: '#3b82f6',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Edit Deliverables
            </button>
          )}
        </div>
        <div style={{ borderTop: `1px solid ${theme.borderLight}`, paddingTop: '5px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr 1fr 1fr', fontSize: '11px', fontWeight: 700, color: theme.textMuted, paddingBottom: '4px' }}>
            <span>ITEM DESCRIPTION</span>
            <span style={{ textAlign: 'right' }}>UNIT RATE</span>
            <span style={{ textAlign: 'center' }}>QUANTITY</span>
            <span style={{ textAlign: 'right' }}>LINE TOTAL</span>
          </div>
          {contract.lineItems?.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr 1fr 1fr', alignItems: 'center', padding: '5px 0', borderTop: `1px solid ${theme.borderLight}`, fontSize: '12px' }}>
              <span style={{ color: theme.textMain, fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'anywhere', paddingRight: '8px' }}>{item.desc}</span>
              <span style={{ textAlign: 'right', color: theme.textMuted }}>₹ {item.unitRate.toLocaleString('en-IN')}</span>
              <span style={{ textAlign: 'center', fontWeight: 700, color: theme.textMain }}>
                {item.qty}
              </span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: theme.textMain }}>
                ₹ {(item.unitRate * item.qty).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit events remain available individually in a compact, accessible accordion. */}
      <details key={`audit-${contract.id}`} className="queue-audit-details">
        <summary className="queue-audit-summary">
          <span><History size={13} aria-hidden="true" style={{verticalAlign:"-2px",marginRight:5}} />AUDIT TRAIL &amp; ACTIVITY LOG <span className="queue-audit-count">{contract.audit?.length || 0}</span></span>
          <span className="queue-audit-hint">Expand history</span>
        </summary>
        <div className="queue-audit-entries" role="list" aria-label="Contract activity history">
          {contract.audit?.length ? contract.audit.map((log, index) => (
            <details className="queue-audit-event" role="listitem" key={log.id || `${contract.id}-log-${index}`}>
              <summary className="queue-audit-event-summary">
                <span className="queue-audit-event-meta"><strong>{log.action || 'Contract updated'}</strong><span className="queue-audit-by">Updated by: {log.by || 'System'}</span></span>
                <time className="queue-audit-time">{log.timestamp || 'Time unavailable'}</time>
              </summary>
              <div className="queue-audit-event-body">
                {log.note && <div className="queue-audit-note">Note: {log.note}</div>}
                {log.before != null && <div className="queue-audit-note"><strong>Before:</strong> <pre>{typeof log.before === 'string' ? log.before : JSON.stringify(log.before, null, 2)}</pre></div>}
                {log.after != null && <div className="queue-audit-note"><strong>After:</strong> <pre>{typeof log.after === 'string' ? log.after : JSON.stringify(log.after, null, 2)}</pre></div>}
              </div>
            </details>
          )) : <p className="queue-audit-empty">No audit trail recorded for this contract.</p>}
        </div>
      </details>

      {/* 5. Edit Deliverables Modal */}
      {isEditModalOpen && canEdit && (
        <EditDeliverablesModal
          contract={contract}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onSaveAllDeliverables || onUpdateLineItemQty}
        />
      )}
    </div>
  );
}