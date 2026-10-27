import React, { useState, useMemo, useEffect } from 'react';
import DetailPanel from './DetailPanel';
import { useTheme } from '../context/ThemeContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TableView({
  contracts = [],
  selectedContract,
  onSearchInputRef,
  onSelectContract,
  activeTab,
  setActiveTab,
  tabCounts = {},
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
  onRetry,
  currentUserRole = 'Reviewer'
}) {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  const theme = {
    bg: 'var(--bg-main)',
    subtleBg: 'var(--bg-subtle)',
    cardBg: 'var(--bg-card)',
    border: 'var(--border-color)',
    borderLight: 'var(--border-light)',
    textMain: 'var(--text-main)',
    textMuted: 'var(--text-muted)',
    hoverRow: 'var(--bg-hover)',
    selectedRow: 'var(--bg-selected)',
    drawerBg: 'var(--bg-main)',
    tabContainerBg: 'var(--tab-bg)',
    tabActiveBg: 'var(--tab-active)',
    btnBg: 'var(--button-bg)',
    inputBg: 'var(--input-bg)'
  };

  const statusBadgeStyles = {
    'New': { bg: 'var(--badge-open-bg)', color: 'var(--badge-open-text)', border: 'var(--badge-open-border)' },
    'Open': { bg: 'var(--badge-open-bg)', color: 'var(--badge-open-text)', border: 'var(--badge-open-border)' },
    'In Review': { bg: 'var(--badge-review-bg)', color: 'var(--badge-review-text)', border: 'var(--badge-review-border)' },
    'Rework': { bg: 'var(--badge-review-bg)', color: 'var(--badge-review-text)', border: 'var(--badge-review-border)' },
    'Approved': { bg: 'var(--badge-approved-bg)', color: 'var(--badge-approved-text)', border: 'var(--badge-approved-border)' },
    'Blocked': { bg: 'var(--badge-blocked-bg)', color: 'var(--badge-blocked-text)', border: 'var(--badge-blocked-border)' },
    'Rejected': { bg: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected-text)', border: 'var(--badge-rejected-border)' }
  };

  const priorityStyles = {
    HIGH: { bg: 'var(--badge-high-bg)', color: 'var(--badge-high-text)', border: 'var(--badge-high-border)' },
    MEDIUM: { bg: 'var(--badge-medium-bg)', color: 'var(--badge-medium-text)', border: 'var(--badge-medium-border)' },
    LOW: { bg: 'var(--badge-low-bg)', color: 'var(--badge-low-text)', border: 'var(--badge-low-border)' }
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const tabs = ['All', 'Open', 'Rework', 'Approved', 'Blocked', 'Rejected'];

  const [tableSearch, setTableSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Per page-la default-a 15 kudutha empty bottom space complete-a cover aagidum
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  useEffect(() => {
    if (!selectedContract) return;
    const index = tableFilteredData.findIndex(c => c.id === selectedContract.id);
    if (index >= 0) { setCurrentPage(Math.floor(index / pageSize) + 1); }
  }, [selectedContract?.id]);

  const categoriesList = useMemo(() => {
    const set = new Set();
    contracts.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [contracts]);

  const tableFilteredData = useMemo(() => {
    return contracts.filter((c) => {
      const matchSearch =
        !tableSearch.trim() ||
        c.id?.toLowerCase().includes(tableSearch.toLowerCase()) ||
        c.title?.toLowerCase().includes(tableSearch.toLowerCase()) ||
        c.supplier?.toLowerCase().includes(tableSearch.toLowerCase());

      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;

      return matchSearch && matchPriority && matchCategory;
    });
  }, [contracts, tableSearch, priorityFilter, categoryFilter]);

  const totalEntries = tableFilteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedContracts = tableFilteredData.slice(startIndex, endIndex);

  const handleRowClick = (contract) => {
    onSelectContract(contract);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    const onKeyboardSelection = (e) => {
      if (e.detail?.id && e.detail.id === selectedContract?.id) setIsDrawerOpen(true);
    };
    window.addEventListener('queue-keyboard-select', onKeyboardSelection);
    return () => window.removeEventListener('queue-keyboard-select', onKeyboardSelection);
  }, [selectedContract?.id]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        backgroundColor: theme.bg,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minWidth: 0
      }}
    >
      {/* 1. Main Table Ledger Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header Tabs */}
        <div style={{ padding: '16px 10px 10px', borderBottom: `1px solid ${theme.borderLight}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            {/* <div> */}
            {/* <h2 style={{ fontSize: '18px', fontWeight: 800, color: theme.textMain, margin: 0 }}>
                Contract Ledger
              </h2> */}
            {/* <p style={{ color: theme.textMuted, fontSize: '12px', margin: '4px 0 0 0' }}>
                Total {contracts.length} agreements.
              </p> */}
            {/* </div> */}
            {setActiveTab && (
              <div style={{ display: 'flex', gap: '4px', backgroundColor: theme.tabContainerBg, padding: '3px', borderRadius: '8px', flexWrap: 'wrap', border: `1px solid ${theme.border}` }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  const count = tab === 'All'
                    ? (tabCounts.All || contracts.length)
                    : (tabCounts[tab] !== undefined ? tabCounts[tab] : 0);
                  return (

                    <>
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '5px 5px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isActive ? theme.tabActiveBg : 'transparent',
                          color: isActive ? theme.textMain : theme.textMuted,
                          boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tab}
                      </button>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          marginLeft: '1px',
                          backgroundColor: isActive ? (isDark ? '#172554' : '#eff6ff') : (isDark ? '#334155' : '#e2e8f0'),
                          color: isActive ? '#3b82f6' : theme.textMuted,
                          padding: '5px 5px',
                          borderRadius: '4px'
                        }}
                      >
                        {count}
                      </span>

                    </>
                  );
                })}
              </div>
            )}
          </div>

          {/* Table Filters Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              paddingTop: '6px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.textMuted
                  }}
                />
                <input
                  type="text"
                  data-queue-table-search="true"
                  placeholder="Search by ID, title, supplier..."
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.inputBg,
                    color: theme.textMain,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Priority Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '5px 8px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.cardBg,
                    color: theme.textMain,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="All">All</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '5px 8px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.cardBg,
                    color: theme.textMain,
                    outline: 'none',
                    cursor: 'pointer',
                    maxWidth: '180px'
                  }}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Per Page Entries Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>Show:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.cardBg,
                  color: theme.textMain,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={10}>10 entries</option>
                <option value={15}>15 entries</option>
                <option value={20}>20 entries</option>
                <option value={30}>30 entries</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content (Expanded Row Heights to fill space cleanly) */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', minWidth: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: theme.subtleBg, zIndex: 2, borderBottom: `1px solid ${theme.border}` }}>
              <tr style={{ color: theme.textMuted, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>ID</th>
                <th style={{ padding: '14px', fontWeight: 700, minWidth: '180px' }}>Title</th>
                <th style={{ padding: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ padding: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>Supplier</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>Value</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>Priority</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '14px', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} style={{ borderBottom: `1px solid ${theme.borderLight}` }}>
                    <td colSpan={8} style={{ padding: '18px 14px' }}>
                      <div style={{ height: '18px', backgroundColor: isDark ? '#141414' : '#f1f5f9', borderRadius: '4px', width: '100%' }} />
                    </td>
                  </tr>
                ))
              ) : hasError ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>
                      We couldn't load the queue.
                    </div>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        style={{
                          marginTop: '8px',
                          padding: '6px 14px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ) : paginatedContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', color: theme.textMuted }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: theme.textMain, marginBottom: '4px' }}>
                      No matching contracts found.
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      check the filters or search 
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedContracts.map((c) => {
                  const isSelected = selectedContract?.id === c.id;
                  const statusStyle = statusBadgeStyles[c.status] || {
                    bg: isDark ? '#141414' : '#f1f5f9',
                    color: isDark ? '#cbd5e1' : '#475569',
                    border: isDark ? '#262626' : '#e2e8f0'
                  };
                  const prioStyle = priorityStyles[c.priority] || {
                    color: theme.textMuted,
                    bg: isDark ? '#141414' : '#f1f5f9',
                    border: isDark ? '#262626' : '#e2e8f0'
                  };

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleRowClick(c)}
                      style={{
                        borderBottom: `1px solid ${theme.borderLight}`,
                        backgroundColor: isSelected ? theme.selectedRow : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = theme.hoverRow;
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Increased td padding from 10px to 14px 14px to eliminate wide empty void */}
                      <td style={{ padding: '14px 14px', fontWeight: 800, color: '#3b82f6', whiteSpace: 'nowrap' }}>
                        {c.id}
                      </td>
                      <td
                        style={{
                          padding: '14px 14px',
                          fontWeight: 600,
                          color: theme.textMain,
                          wordBreak: 'break-word',
                          maxWidth: '220px',
                          lineHeight: '1.4'
                        }}
                      >
                        {c.title}
                      </td>
                      <td style={{ padding: '14px 14px', color: theme.textMuted, whiteSpace: 'nowrap' }}>
                        {c.category || 'Procurement'}
                      </td>
                      <td style={{ padding: '14px 14px', color: isDark ? '#cbd5e1' : '#334155', whiteSpace: 'nowrap' }}>
                        {c.supplier}
                      </td>
                      <td style={{ padding: '14px 14px', fontWeight: 700, color: theme.textMain, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {(c.value / 100000).toFixed(2)} Lakh
                      </td>
                      <td style={{ padding: '14px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '5px',
                            backgroundColor: prioStyle.bg,
                            color: prioStyle.color,
                            border: `1px solid ${prioStyle.border}`
                          }}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '5px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px', color: theme.textMuted, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {(() => {
                          if (!c.dueDate || ['Approved','Rejected'].includes(c.status)) return '—';
                          const due = new Date(`${c.dueDate}T00:00:00`);
                          const today = new Date();today.setHours(0,0,0,0);
                          if (Number.isNaN(due.getTime()) || due >= today) return '—';
                          return `Overdue ${Math.ceil((today-due)/86400000)}d`;
                        })()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination & Entries Footer Controls */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: `1px solid ${theme.borderLight}`,
            backgroundColor: theme.subtleBg,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            flexShrink: 0
          }}
        >
          {/* Entries Indicator */}
          <div style={{ fontSize: '12px', color: theme.textMuted }}>
            Showing{' '}
            <strong style={{ color: theme.textMain }}>
              {totalEntries === 0 ? 0 : startIndex + 1}
            </strong>{' '}
            to{' '}
            <strong style={{ color: theme.textMain }}>
              {endIndex}
            </strong>{' '}
            of <strong style={{ color: theme.textMain }}>{totalEntries}</strong> entries
          </div>

          {/* Page Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.btnBg,
                color: safePage <= 1 ? (isDark ? '#475569' : '#cbd5e1') : theme.textMain,
                cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMain, padding: '0 8px' }}>
              Page {safePage} of {totalPages}
            </div>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.btnBg,
                color: safePage >= totalPages ? (isDark ? '#475569' : '#cbd5e1') : theme.textMain,
                cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Slide Drawer DetailPanel */}
      {isDrawerOpen && selectedContract && (
        <div
          style={{
            width: '540px',
            borderLeft: `1px solid ${theme.border}`,
            backgroundColor: theme.drawerBg,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isDark ? '-4px 0 25px rgba(0,0,0,0.6)' : '-4px 0 20px rgba(0,0,0,0.08)',
            zIndex: 10,
            height: '100%',
            position: 'sticky',
            top: 0,
            flexShrink: 0,
            minWidth: 0,
            overflowX: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px', borderBottom: `1px solid ${theme.borderLight}`, backgroundColor: theme.subtleBg, flexShrink: 0 }}>
            <button
              type="button"
              onClick={closeDrawer}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: theme.btnBg,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: theme.textMuted,
                cursor: 'pointer'
              }}
            >
              ❌
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
            <DetailPanel
              contract={selectedContract}
              startedReviewIds={startedReviewIds}
              setStartedReviewIds={setStartedReviewIds}
              onStartReview={onStartReview}
              onTriggerApprove={onTriggerApprove}
              onOpenReasonModal={onOpenReasonModal}
              onResumeReview={onResumeReview}
              onRework={onRework}
              onUpdateLineItemQty={onUpdateLineItemQty}
              onSaveAllDeliverables={onSaveAllDeliverables}
              isLoading={isLoading}
              hasError={hasError}
              currentUserRole={currentUserRole}
            />
          </div>
        </div>
      )}
    </div>
  );
}