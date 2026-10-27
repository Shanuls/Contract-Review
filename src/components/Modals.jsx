import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import './Modals.css';

// Trap keyboard focus in active dialogs and restore it on close.
function useModalKeyboard(onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = [...document.querySelectorAll('.modal-overlay .modal-dialog')].at(-1);
    if (!dialog) return;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('tabindex', '-1');
    const focusable = () => [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')];
    // Do not focus the close button first; prioritize the first editable control.
    const firstField = dialog.querySelector('input:not([disabled]),textarea:not([disabled]),select:not([disabled])');
    (firstField || dialog).focus();
    const keydown = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeRef.current?.(); }
      if (e.key === 'Tab') {
        const els = focusable();
        if (!els.length) { e.preventDefault(); return; }
        if (e.shiftKey && document.activeElement === els[0]) { e.preventDefault(); els.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === els.at(-1)) { e.preventDefault(); els[0].focus(); }
      }
    };
    document.addEventListener('keydown', keydown, true);
    return () => { document.removeEventListener('keydown', keydown, true); previous?.focus?.(); };
  }, []);
}


export function HighValueModal({ contract, onConfirm, onCancel }) {
  useModalKeyboard(onCancel);
  if (!contract) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-title-row">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706' }}>
            <AlertTriangle size={18} /> High-Value Approval Confirmation
          </h3>
        </div>
        <p className="modal-body-text">
          Contract <strong>{contract.title}</strong> ({contract.id}) exceeds <strong>₹50,00,000 (₹50 Lakh)</strong> threshold.
          <br /><br />
          Value: <strong>₹{contract.value.toLocaleString('en-IN')}</strong>
        </p>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReasonModal({ type, note, setNote, noteError, onConfirm, onCancel }) {
  useModalKeyboard(onCancel);
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-title-row">
          <h3 className="modal-title">{type} Contract</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        <p className="modal-body-text">
          A note of at least <strong>10 characters</strong> is strictly required for the procurement audit log.
        </p>
        <textarea
          autoFocus
          rows={4}
          value={note}
          maxLength={500}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder={`Enter detailed reason for ${type.toLowerCase()}ing...`}
          className="modal-textarea"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
          <span style={{ color: note.trim().length >= 10 ? '#059669' : '#94a3b8' }}>
            {note.trim().length} / 10 characters minimum
          </span>
          {noteError && <span style={{ color: '#dc2626', fontWeight: 600 }}>{noteError}</span>}
        </div>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: type === 'Reject' ? '#dc2626' : '#d97706',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            Save & {type}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShortcutsModal({ onClose }) {
  useModalKeyboard(onClose);
  const shortcuts = [
    { key: "J / ↓", desc: "Select next contract" },
    { key: "K / ↑", desc: "Select previous contract" },
    { key: "A", desc: "Approve current contract" },
    { key: "R", desc: "Reject current contract" },
    { key: "B", desc: "Block current contract" },
    { key: "Ctrl + K", desc: "Focus search box" },
    { key: "Esc", desc: "Dismiss modal" },
    { key: "Shift + ?", desc: "Help shortcuts" }
  ];
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-title-row">
          <h3 className="modal-title">Reviewer Shortcuts</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span className="queue-shortcut-description">{s.desc}</span>
              <kbd style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddContractModal({ onAddContract, onClose }) {
  useModalKeyboard(onClose);
  const CATEGORIES = [
    'Supply Chain & Warehousing',
    'Information Technology',
    'Electrical & Plant Infrastructure',
    'Safety & Facilities',
    'Machinery & Power',
    'Corporate & Legal',
    'Professional Services',
    'Logistics'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    supplier: '',
    documentName: '',
    documentType: 'Contract',
    documentUrl: '',
    category: 'Supply Chain & Warehousing',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    sla: 'Delivery within 14 business days of PO issue',
    paymentTerms: 'Net 30 days after dock inspection',
    terminationClause: '30 days mutual written notice',
    compliance: 'ISO:9001 / Statutory Standards',
    // Status :"Open"
  });

  const [lineItems, setLineItems] = useState([
    { id: 'li-1', desc: '', unitRate: '', qty: 1 }
  ]);
  const [formError, setFormError] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Strict text sanitizer: removes all digits 0-9
  const sanitizeTextOnly = (val, max = 120) => (val || '').replace(/[0-9]/g, '').slice(0, max);

  const blockNumberKeys = (e) => {
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: `li-${Date.now()}`, desc: '', unitRate: '', qty: 1 }
    ]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((it) => it.id !== id));
  };

  const updateLineItem = (id, field, value) => {
    if (field === 'desc') {
      value = sanitizeTextOnly(value, 40);
    }
    if (field === 'qty') {
      const cleanQty = String(value).replace(/\D/g, '');
      value = cleanQty.slice(0, 5);
    }
    if (field === 'unitRate') {
      const cleanRate = String(value).replace(/\D/g, '');
      value = cleanRate.slice(0, 9);
    }

    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const totalCalculatedValue = lineItems.reduce((acc, it) => {
    const rate = Number(it.unitRate) || 0;
    const qty = Number(it.qty) || 0;
    return acc + rate * qty;
  }, 0);

  // Single cleanly defined handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanTitle = formData.title.trim();
    if (cleanTitle.length < 5 || /\d/.test(cleanTitle)) {
      setFormError('Contract Title must be letters only without numbers (min 5 letters).');
      return;
    }

    const cleanSupplier = formData.supplier.trim();
    if (cleanSupplier.length < 3 || /\d/.test(cleanSupplier)) {
      setFormError('Supplier Name must be letters only without numbers (min 3 letters).');
      return;
    }

    if (formData.dueDate < todayStr) {
      setFormError('Due Date cannot be in the past. Select today or a future date.');
      return;
    }

    for (let i = 0; i < lineItems.length; i++) {
      const it = lineItems[i];
      const cleanDesc = it.desc.trim();
      if (cleanDesc.length < 3 || /\d/.test(cleanDesc)) {
        setFormError(`Line Item ${i + 1} Description must contain only text without numbers.`);
        return;
      }
      if (!it.unitRate || Number(it.unitRate) <= 0) {
        setFormError(`Line Item ${i + 1}: Unit Rate must be greater than 0.`);
        return;
      }
      if (!it.qty || Number(it.qty) <= 0) {
        setFormError(`Line Item ${i + 1}: Quantity must be at least 1.`);
        return;
      }
    }

    onAddContract({
      title: cleanTitle,
      supplier: cleanSupplier,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      sla: formData.sla.trim(),
      paymentTerms: formData.paymentTerms.trim(),
      terminationClause: formData.terminationClause.trim(),
      compliance: formData.compliance.trim(),
      // Status :"Open",
      lineItems: lineItems.map((it) => ({
        id: it.id,
        desc: it.desc.trim(),
        unitRate: Number(it.unitRate),
        qty: Number(it.qty)
      })),
      documents: uploadedDocuments.filter(doc => doc.url).map(doc => ({...doc, name: (doc.documentName || '').trim() || doc.name, type: doc.documentType || doc.type})),
      value: totalCalculatedValue
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-wide" style={{ maxWidth: '680px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-title-row">
          <h3 className="modal-title">+ Add Inbound Supplier Contract</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {formError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px', color: '#dc2626', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
          {/* General Details */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            General Contract Details
          </div>
          <div>
            <label className="modal-label">Contract Title * (Letters Only)</label>
            <input
              type="text"
              required
              className="modal-input"
              placeholder="e.g. Enterprise Cloud Logistics Retainer"
              value={formData.title}
              onKeyDown={blockNumberKeys}
              onChange={(e) => setFormData({ ...formData, title: sanitizeTextOnly(e.target.value, 40) })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="modal-label">Supplier Name * (Letters Only)</label>
              <input
                type="text"
                required
                className="modal-input"
                placeholder="e.g. Godrej Material Handling"
                value={formData.supplier}
                onKeyDown={blockNumberKeys}
                onChange={(e) => setFormData({ ...formData, supplier: sanitizeTextOnly(e.target.value, 35) })}
              />
            </div>
            <div>
              <label className="modal-label">Category *</label>
              <select
                className="modal-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="modal-label">Priority</label>
              <select
                className="modal-input"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div>
              <label className="modal-label">Due Date *</label>
              <input
                type="date"
                required
                min={todayStr}
                className="modal-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Key Terms */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '6px' }}>
            Key Contractual Terms
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="modal-label">Service Level Agreement (SLA)</label>
              <input
                type="text"
                className="modal-input"
                value={formData.sla}
                onChange={(e) => setFormData({ ...formData, sla: e.target.value.slice(0, 200) })}
              />
            </div>
            <div>
              <label className="modal-label">Payment Terms</label>
              <input
                type="text"
                className="modal-input"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value.slice(0, 160) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="modal-label">Termination Clause</label>
              <input
                type="text"
                className="modal-input"
                value={formData.terminationClause}
                onChange={(e) => setFormData({ ...formData, terminationClause: e.target.value.slice(0, 160) })}
              />
            </div>
            <div>
              <label className="modal-label">Regulatory & Standards Compliance</label>
              <input
                type="text"
                className="modal-input"
                value={formData.compliance}
                onChange={(e) => setFormData({ ...formData, compliance: e.target.value.slice(0, 160) })}
              />
            </div>
          </div>

          {/* Line Items & Deliverables */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Line Items & Deliverables
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb' }}>
              Total: ₹{totalCalculatedValue.toLocaleString('en-IN')} ({(totalCalculatedValue / 100000).toFixed(1)} Lakh)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lineItems.map((item, index) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 32px', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  placeholder={`Item ${index + 1} Description (Text only)`}
                  className="modal-input"
                  value={item.desc}
                  onKeyDown={blockNumberKeys}
                  onChange={(e) => updateLineItem(item.id, 'desc', e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={9}
                  min="1"
                  required
                  placeholder="Unit Rate (₹)"
                  className="modal-input"
                  value={item.unitRate}
                  onChange={(e) => updateLineItem(item.id, 'unitRate', e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  min="1"
                  max="99999"
                  required
                  placeholder="Qty"
                  className="modal-input"
                  value={item.qty}
                  onChange={(e) => updateLineItem(item.id, 'qty', e.target.value)}
                />
                {lineItems.length > 1 ? (
                  <button type="button" onClick={() => removeLineItem(item.id)} style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                ) : <div />}
              </div>
            ))}

            <button
              type="button"
              onClick={addLineItem}
              style={{
                alignSelf: 'flex-start',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px dashed #bfdbfe',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              + Add Line Item
            </button>
          </div>

          <div className="queue-upload-fields" style={{border:'1px solid var(--border-color)',borderRadius:8,padding:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginBottom:8}}>
              <strong style={{fontSize:13}}>Contract Documents ({uploadedDocuments.filter(d=>d.url).length})</strong>
              <button type="button" className="queue-add-document-button" onClick={()=>document.getElementById('contract-document-upload')?.click()} style={{border:'1px solid #bfdbfe',background:'var(--bg-card)',color:'#2563eb',borderRadius:6,padding:'6px 10px',cursor:'pointer',fontSize:12,fontWeight:600}}>+ Add Document</button>
            </div>
            <input id="contract-document-upload" type="file" multiple accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-label="Choose contract documents" style={{position:'absolute',width:1,height:1,opacity:0,overflow:'hidden'}} onChange={async e => {
              const files = Array.from(e.target.files || []);
              if (files.some(file => file.size > 750000)) { setFormError('Each uploaded document must be 750 KB or smaller for this browser-only demo.'); e.target.value=''; return; }
              try {
                const loaded = await Promise.all(files.map(file => new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload=()=>resolve({id:`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,name:file.name,documentName:file.name,documentType:file.name.toLowerCase().endsWith('.pdf')?'Contract':'Other',type:file.name.toLowerCase().endsWith('.pdf')?'PDF':'Document',url:reader.result,status:'Uploaded'});reader.onerror=reject;reader.readAsDataURL(file); })));
                setUploadedDocuments(prev=>[...prev,...loaded]);setFormError('');
              } catch {setFormError('Unable to read the selected document. Please try again.');}
              e.target.value='';
            }}/>
            {uploadedDocuments.length === 0 && <div style={{fontSize:12,color:'var(--text-muted)'}}>Use Add Document to attach a PDF, DOC or DOCX file.</div>}
            {uploadedDocuments.map((doc,index)=><div key={doc.id} style={{padding:'8px 0',borderTop:index?'1px solid var(--border-color)':'none'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginBottom:7}}>
                <span style={{fontSize:12,overflowWrap:'anywhere'}} title={doc.name}>{doc.name}</span>
                <button type="button" onClick={()=>setUploadedDocuments(prev=>prev.filter(d=>d.id!==doc.id))} style={{border:'1px solid var(--border-color)',borderRadius:5,background:'transparent',color:'var(--text-main)',cursor:'pointer',padding:'4px 8px',fontSize:11}}>Remove</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(110px,0.55fr)',gap:8}}>
                <label style={{fontSize:11,color:'var(--text-muted)'}}>Document Name
                  <input className="modal-input" aria-label={`Document ${index+1} name`} value={doc.documentName ?? doc.name} maxLength={120} onChange={e=>setUploadedDocuments(prev=>prev.map(d=>d.id===doc.id?{...d,documentName:e.target.value}:d))} style={{width:'100%',boxSizing:'border-box',marginTop:4}}/>
                </label>
                <label style={{fontSize:11,color:'var(--text-muted)'}}>Document Type
                  <select className="modal-input" aria-label={`Document ${index+1} type`} value={doc.documentType || 'Contract'} onChange={e=>setUploadedDocuments(prev=>prev.map(d=>d.id===doc.id?{...d,documentType:e.target.value}:d))} style={{width:'100%',boxSizing:'border-box',marginTop:4}}>
                    <option>Contract</option><option>SOW</option><option>Invoice</option><option>Compliance</option><option>Other</option>
                  </select>
                </label>
              </div>
            </div>)}
          </div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="submit"
              style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700, borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer' }}
            >
              Add to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditDeliverablesModal({ contract, onSave, onClose }) {
  useModalKeyboard(onClose);
  const LIMIT = 7500000;
  const originalValue = Number(contract?.value || 0);
  const originalLocked = originalValue >= LIMIT;
  const [items, setItems] = useState(
    contract?.lineItems ? contract.lineItems.map((item) => ({ ...item })) : []
  );

  const handleQtyChange = (id, valStr) => {
    if (originalLocked) return;
    if (valStr === '') {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: '' } : item))
      );
      return;
    }

    // Numbers only, strictly max 5 digits (1 to 99999)
    let numericStr = String(valStr).replace(/\D/g, '');
    if (numericStr.length > 5) numericStr = numericStr.slice(0, 5);

    const cleanNum = parseInt(numericStr, 10);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: isNaN(cleanNum) ? '' : cleanNum } : item))
    );
  };

  const handleCompleteSave = () => {
    if (originalLocked || currentTotal >= LIMIT) return;
    const cleanedItems = items.map((it) => ({
      ...it,
      qty: Number(it.qty) || 1
    }));
    onSave(contract.id, cleanedItems);
    onClose();
  };

  const currentTotal = items.reduce(
    (acc, it) => acc + (Number(it.unitRate || 0) * (Number(it.qty) || 0)),
    0
  );

  const exceedsLimit = currentTotal >= LIMIT;
  const saveBlocked = originalLocked || exceedsLimit;
  const warningText = originalLocked
    ? "This contract is already valued at ₹75,00,000 or more. Reviewers cannot edit its deliverables."
    : exceedsLimit
      ? "New contract value is ₹75,00,000 or more. Reduce quantities below ₹75,00,000 to enable Save."
      : "";

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-wide" style={{ maxWidth: '580px' }}>
        <div className="modal-title-row">
          <h3 className="modal-title">Edit Line Items & Deliverables</h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
        <p className="modal-body-text" style={{ margin: '0 0 14px 0' }}>
          Adjust quantities below (Max 5 digits). Audit trail will be updated automatically on save.
        </p>
        <div className="deliverables-items">
          {items.map((item) => (
            <div key={item.id} className="deliverables-item queue-deliverables-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{item.desc}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Unit Rate: ₹{Number(item.unitRate).toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Qty:</span>
                <input
                  disabled={originalLocked}
                  aria-label={`Quantity for ${item.desc}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  min="1"
                  max="99999"
                  value={item.qty}
                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    width: '75px',
                    padding: '5px 8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    border: '1px solid #cbd5e1',
                    borderRadius: '5px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ minWidth: '95px', textAlign: 'right', fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>
                ₹{(Number(item.unitRate || 0) * (Number(item.qty) || 0)).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
        {saveBlocked && (
          <div id="deliverables-limit-warning" className="deliverables-limit-warning" role="alert" aria-live="polite">
            <AlertTriangle size={17} aria-hidden="true" />
            <span>{warningText}</span>
          </div>
        )}
        <div
          className="modal-actions"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '14px'
          }}
        >
          <div className={`deliverables-new-value${saveBlocked ? " deliverables-new-value--blocked" : ""}`}>
            New Value: ₹{currentTotal.toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCompleteSave}
              disabled={saveBlocked}
              aria-describedby={saveBlocked ? "deliverables-limit-warning" : undefined}
              style={{
                height: '36px',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              Save & Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}