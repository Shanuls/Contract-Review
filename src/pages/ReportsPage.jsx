import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Download,
  ExternalLink, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Reporting periods use the earliest valid audit event as the contract creation date.
const auditDate = (stamp) => {
  if (!stamp) return null;
  const parsed = new Date(String(stamp).replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const creationDate = (contract) => (contract.audit || [])
  .map((event) => auditDate(event.timestamp))
  .filter(Boolean)
  .sort((a, b) => a - b)[0] || null;
const money = (value) => Number(value) || 0;
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export default function ReportsPage({ contracts = [] }) {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  // Theme Tokens for Crisp Light & Slate Dark
const theme = {
    bg: 'var(--bg-app)',
    cardBg: 'var(--bg-card)',
    border: 'var(--border-color)',
    borderLight: 'var(--border-light)',
    textMain: 'var(--text-main)',
    textMuted: 'var(--text-muted)',
    subtleBg: 'var(--bg-subtle)',
    innerHover: 'var(--bg-hover)'
  };

  const [selectedPeriod, setSelectedPeriod] = useState('Quarter to Date');
  const [vendorFilter, setVendorFilter] = useState('All');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSort, setSupplierSort] = useState('value-desc');
  const [supplierPageSize, setSupplierPageSize] = useState(5);
  const [supplierPage, setSupplierPage] = useState(1);

  const periodContracts = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    const currentQuarterStart = new Date(year, quarterStartMonth, 1);
    const previousQuarterStart = new Date(year, quarterStartMonth - 3, 1);
    const yearStart = new Date(year, 0, 1);
    return contracts.filter((contract) => {
      const created = creationDate(contract);
      if (!created || created > now) return false;
      if (selectedPeriod === 'Previous Quarter') return created >= previousQuarterStart && created < currentQuarterStart;
      if (selectedPeriod === 'Year to Date') return created >= yearStart;
      return created >= currentQuarterStart;
    });
  }, [contracts, selectedPeriod]);

  const totalSpend = useMemo(() => periodContracts.filter(c => c.status === 'Approved').reduce((sum, c) => sum + money(c.value), 0), [periodContracts]);
  const approvedCount = periodContracts.filter((c) => c.status === 'Approved').length;
  const blockedCount = periodContracts.filter((c) => c.status === 'Blocked').length;
  const rejectedCount = periodContracts.filter((c) => c.status === 'Rejected').length;
  const newOrPendingCount = periodContracts.filter((c) => ['New', 'Open', 'Rework'].includes(c.status)).length;
  const approvalRatio = periodContracts.length ? Math.round(approvedCount / periodContracts.length * 100) : 0;

  const categoryData = useMemo(() => {
    const map = {};
    periodContracts.forEach((c) => {
      const category = c.category || 'Other';
      map[category] = (map[category] || 0) + money(c.value);
    });
    const colors = ['#2563eb', '#8b5cf6', '#059669', '#d97706', '#0284c7', '#64748b'];
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, value], idx) => ({ name, valueLakh: value / 100000, color: colors[idx % colors.length] }));
  }, [periodContracts]);
  const maxCategoryVal = Math.max(0, ...categoryData.map((d) => d.valueLakh));

  const supplierData = useMemo(() => {
    const map = {};
    periodContracts.forEach((c) => {
      const name = c.supplier || 'Unknown Supplier';
      if (!map[name]) map[name] = { name, count: 0, totalVal: 0, categories: {}, contracts: [] };
      const supplier = map[name];
      supplier.count += 1;
      supplier.totalVal += money(c.value);
      supplier.contracts.push(c);
      const category = c.category || 'Other';
      supplier.categories[category] = (supplier.categories[category] || 0) + money(c.value);
    });
    let list = Object.values(map).map((supplier) => {
      const high = supplier.contracts.some(c => c.status === 'Blocked' || (String(c.priority || '').toLowerCase() === 'high' && !['Approved', 'Rejected'].includes(c.status)));
      const medium = supplier.contracts.some(c => ['New', 'Open', 'In Review', 'Rework', 'Pending'].includes(c.status));
      return {
        ...supplier,
        category: Object.entries(supplier.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other',
        risk: high ? 'High' : medium ? 'Medium' : 'Low',
        riskReason: high ? 'Blocked or unresolved high-priority contract' : medium ? 'Contracts awaiting review or rework' : 'No blocked or pending contracts'
      };
    }).sort((a, b) => b.totalVal - a.totalVal);
    if (vendorFilter === 'High Exposure') {
      list = list.filter(s => s.risk === 'High');
    } else if (vendorFilter !== 'All') {
      list = list.filter(s => Object.keys(s.categories).some(category => category.toLowerCase().includes(vendorFilter.toLowerCase())));
    }
    return list;
  }, [periodContracts, vendorFilter]);

  const supplierRiskSummary = useMemo(() => supplierData.reduce((counts, supplier) => {
    counts[supplier.risk] += 1;
    return counts;
  }, { High: 0, Medium: 0, Low: 0 }), [supplierData]);
  const visibleSuppliers = useMemo(() => {
    const query = supplierSearch.trim().toLowerCase();
    const filtered = supplierData.filter(s => s.name.toLowerCase().includes(query));
    return [...filtered].sort((a, b) => {
      if (supplierSort === 'value-asc') return a.totalVal - b.totalVal || a.name.localeCompare(b.name);
      if (supplierSort === 'name-asc') return a.name.localeCompare(b.name);
      if (supplierSort === 'risk') return ({ High: 0, Medium: 1, Low: 2 }[a.risk] - { High: 0, Medium: 1, Low: 2 }[b.risk]) || b.totalVal - a.totalVal;
      return b.totalVal - a.totalVal || a.name.localeCompare(b.name);
    });
  }, [supplierData, supplierSearch, supplierSort]);
  const supplierPages = Math.max(1, Math.ceil(visibleSuppliers.length / supplierPageSize));
  const currentSupplierPage = Math.min(supplierPage, supplierPages);
  const pagedSuppliers = visibleSuppliers.slice((currentSupplierPage - 1) * supplierPageSize, currentSupplierPage * supplierPageSize);
  const resetSupplierPage = () => setSupplierPage(1);

  const workflowData = useMemo(() => {
    const colors = { New: '#2563eb', Open: '#0284c7', 'In Review': '#6366f1', Rework: '#d97706', Approved: '#059669', Blocked: '#dc2626', Rejected: '#64748b', Pending: '#8b5cf6' };
    const counts = {};
    periodContracts.forEach(c => { const status = c.status || 'Unknown'; counts[status] = (counts[status] || 0) + 1; });
    const order = ['New', 'Open', 'In Review', 'Rework', 'Approved', 'Blocked', 'Rejected', 'Pending'];
    return Object.entries(counts).sort((a, b) => (order.indexOf(a[0]) < 0 ? 999 : order.indexOf(a[0])) - (order.indexOf(b[0]) < 0 ? 999 : order.indexOf(b[0]))).map(([name, count], i) => ({ name, count, color: colors[name] || ['#64748b', '#0d9488'][i % 2] }));
  }, [periodContracts]);
  const workflowGradient = workflowData.length ? `conic-gradient(${workflowData.reduce((state, item) => {
    const end = state.offset + item.count / (periodContracts.length || 1) * 100;
    state.parts.push(`${item.color} ${state.offset}% ${end}%`);
    state.offset = end;
    return state;
  }, { offset: 0, parts: [] }).parts.join(', ')})` : theme.subtleBg;

  const handleExportCSV = () => {
    const headers = ['ID', 'Supplier', 'Category', 'Title', 'Value(INR)', 'Status', 'Priority', 'DueDate', 'CreatedDate'];
    const rows = periodContracts.map((c) => [c.id, c.supplier, c.category, c.title, money(c.value), c.status, c.priority, c.dueDate, creationDate(c)?.toISOString() || ''].map(csvCell).join(','));
    const blob = new Blob(['\uFEFF', [headers.map(csvCell).join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProcureFlow_Analytics_${selectedPeriod.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.bg,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box',
        minWidth: 0
      }}
    >
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '19px', fontWeight: 800, color: theme.textMain, margin: 0 }}>
            Procurement & Spend Analytics
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: theme.textMuted }}>
            Audit turnaround times, vendor spend distributions, and review decisions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textMain,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option>Quarter to Date</option>
            <option>Previous Quarter</option>
            <option>Year to Date</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.textMain,
              cursor: 'pointer'
            }}
          >
            <Download size={13} color="#2563eb" /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Top Analytics Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}
      >
        <div style={{ backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted }}>Total Portfolio Spend</span>
            <div style={{ padding: '5px', backgroundColor: isDark ? '#111827' : '#eff6ff', borderRadius: '5px' }}>
              <CreditCard size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '19px', fontWeight: 800, color: theme.textMain, margin: '4px 0 1px' }}>
            ₹{(totalSpend / 10000000).toFixed(2)} Cr
          </div>
          <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
            {selectedPeriod}
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted }}>Average Cycle Time</span>
            <div style={{ padding: '5px', backgroundColor: isDark ? '#111827' : '#f5f3ff', borderRadius: '5px' }}>
              <Clock size={14} color="#7c3aed" />
            </div>
          </div>
          <div style={{ fontSize: '19px', fontWeight: 800, color: '#2563eb', margin: '4px 0 1px' }}>
            {(() => { const durations = periodContracts.map(c => { const dates = (c.audit || []).map(a => auditDate(a.timestamp)).filter(Boolean); if (dates.length < 2) return null; return (Math.max(...dates) - Math.min(...dates)) / 86400000; }).filter(d => d !== null); return durations.length ? `${(durations.reduce((a,b) => a+b, 0) / durations.length).toFixed(1)} Days` : "N/A"; })()}
          </div>
          <div style={{ fontSize: '10px', color: theme.textMuted }}>
            First to latest audit event
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted }}>On-Time SLA Rate</span>
            <div style={{ padding: '5px', backgroundColor: isDark ? '#111827' : '#ecfdf5', borderRadius: '5px' }}>
              <CheckCircle2 size={14} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '19px', fontWeight: 800, color: '#059669', margin: '4px 0 1px' }}>
            {(() => { const completed = periodContracts.filter(c => ["Approved", "Rejected"].includes(c.status)); return completed.length ? `${(completed.filter(c => { const last = (c.audit || []).map(a => auditDate(a.timestamp)).filter(Boolean).sort((a,b) => b-a)[0]; return last && c.dueDate && last <= new Date(`${c.dueDate}T23:59:59`); }).length / completed.length * 100).toFixed(1)}%` : "N/A"; })()}
          </div>
          <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
            Completed before due date
          </div>
        </div>

        <div style={{ backgroundColor: theme.cardBg, borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted }}>Approval Ratio</span>
            <div style={{ padding: '5px', backgroundColor: isDark ? '#111827' : '#eff6ff', borderRadius: '5px' }}>
              <ShieldCheck size={14} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '19px', fontWeight: 800, color: theme.textMain, margin: '4px 0 1px' }}>
            {approvalRatio}%
          </div>
          <div style={{ fontSize: '10px', color: theme.textMuted }}>
            {approvedCount} approved out of {periodContracts.length}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 1fr)',
          gap: '10px',
          alignItems: 'stretch'
        }}
      >
        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: theme.textMain, margin: 0 }}>
              Top Spend by Category
            </h3>
            {hoveredBar && (
              <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700 }}>
                Category: {hoveredBar}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '12px' }}>
            {categoryData.map((cat) => {
              const barWidth = Math.min(100, (cat.valueLakh / (maxCategoryVal || 1)) * 100);
              const isHovered = hoveredBar === cat.name;

              return (
                <div
                  key={cat.name}
                  
                  onMouseEnter={() => setHoveredBar(cat.name)}
                  onMouseLeave={() => setHoveredBar(null)}
                  title={`${cat.name}: ₹${cat.valueLakh.toFixed(2)} Lakh`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'default'
                  }}
                >
                  <span
                    style={{
                      width: '160px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: isHovered ? '#2563eb' : theme.textMuted,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name}
                  </span>

                  <div style={{ flex: 1, backgroundColor: theme.subtleBg, borderRadius: '4px', height: '16px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        backgroundColor: cat.color,
                        borderRadius: '4px',
                        transition: 'all 0.15s ease',
                        opacity: isHovered ? 0.85 : 1
                      }}
                    />
                  </div>

                  <span style={{ width: '55px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: theme.textMain }}>
                    ₹{cat.valueLakh.toFixed(2)}L
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.border}`, paddingTop: '6px', marginTop: '10px', fontSize: '9px', color: theme.textMuted }}>
            <span>₹0L</span>
            <span>₹{(maxCategoryVal * 0.25).toFixed(1)}L</span>
            <span>₹{(maxCategoryVal * 0.5).toFixed(1)}L</span>
            <span>₹{(maxCategoryVal * 0.75).toFixed(1)}L</span>
            <span>₹{maxCategoryVal.toFixed(1)}L</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: theme.cardBg,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: theme.textMain, margin: 0 }}>
              Workflow Status Breakdown
            </h3>

          </div>

          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '10px 0',
              background: workflowGradient
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: theme.cardBg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 800, color: theme.textMain }}>
                {periodContracts.length}
              </span>
              <span style={{ fontSize: '9px', color: theme.textMuted }}>Contracts</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', width: '100%', fontSize: '10px' }}>
            {workflowData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 4px', borderRadius: '4px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '2px', backgroundColor: item.color }} />
                <span style={{ color: theme.textMuted }}>{item.name}:</span>
                <strong style={{ color: theme.textMain }}>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Strategic Suppliers Table */}
      <div
        style={{
          backgroundColor: theme.cardBg,
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: theme.textMain, margin: 0 }}>
            Top Strategic Suppliers by Committed Value
          </h3>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['All', 'High Exposure', 'Supply Chain', 'Information Technology'].map((filterName) => {
              const isActive = vendorFilter === (filterName === 'All' ? 'All' : filterName);
              return (
                <button
                  key={filterName}
                  type="button"
                  onClick={() => { setVendorFilter(filterName); resetSupplierPage(); }}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: '5px',
                    border: isActive ? '1px solid #2563eb' : `1px solid ${theme.border}`,
                    backgroundColor: isActive ? (isDark ? '#1e3a8a' : '#eff6ff') : theme.cardBg,
                    color: isActive ? '#2563eb' : theme.textMuted,
                    cursor: 'pointer'
                  }}
                >
                  {filterName === 'All' ? 'All Vendors' : filterName}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input aria-label="Search suppliers" placeholder="Search suppliers" value={supplierSearch} onChange={e => { setSupplierSearch(e.target.value); resetSupplierPage(); }} style={{ padding: '5px 8px', fontSize: '11px', color: theme.textMain, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '5px', outline: 'none' }} />
            <select aria-label="Sort suppliers" value={supplierSort} onChange={e => { setSupplierSort(e.target.value); resetSupplierPage(); }} style={{ padding: '5px 8px', fontSize: '11px', color: theme.textMain, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '5px' }}>
              <option value="value-desc">Value: High to Low</option><option value="value-asc">Value: Low to High</option><option value="name-asc">Supplier Name: A to Z</option><option value="risk">Risk: High to Low</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: theme.textMuted }} aria-label="Supplier risk summary">
            <span>High: <strong style={{ color: '#dc2626' }}>{supplierRiskSummary.High}</strong></span>
            <span>Medium: <strong style={{ color: '#d97706' }}>{supplierRiskSummary.Medium}</strong></span>
            <span>Low: <strong style={{ color: '#059669' }}>{supplierRiskSummary.Low}</strong></span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
            <thead>
              <tr style={{ color: theme.textMuted, borderBottom: `1px solid ${theme.border}`, fontSize: '10px' }}>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Supplier Name</th>
                <th style={{ padding: '6px 8px', fontWeight: 600 }}>Primary Category</th>
                <th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'center' }}>Contracts</th>
                <th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'right' }}>Total Value</th>
                <th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'center' }}>Risk Level</th>
                <th style={{ padding: '6px 8px', fontWeight: 600, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedSuppliers.map((s) => (
                <tr key={s.name} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '8px', fontWeight: 700, color: theme.textMain }}>{s.name}</td>
                  <td style={{ padding: '8px', color: theme.textMuted }}>{s.category}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: theme.textMain, fontWeight: 600 }}>
                    {s.count}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: theme.textMain }}>
                    ₹{(s.totalVal / 100000).toFixed(1)} Lakh
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: s.risk === 'High' ? '#dc2626' : s.risk === 'Medium' ? '#d97706' : '#059669', backgroundColor: s.risk === 'High' ? (isDark ? '#451a1a' : '#fef2f2') : s.risk === 'Medium' ? (isDark ? '#422006' : '#fffbeb') : (isDark ? '#064e3b' : '#ecfdf5'), padding: '1px 5px', borderRadius: '4px', border: `1px solid ${s.risk === 'High' ? '#7f1d1d' : s.risk === 'Medium' ? '#d97706' : '#047857'}` }}>
                      {s.risk} Risk
                    </span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedSupplier(s)}
                      style={{
                        padding: '3px 6px',
                        fontSize: '10px',
                        fontWeight: 600,
                        backgroundColor: isDark ? '#1e3a8a' : '#eff6ff',
                        color: '#2563eb',
                        border: `1px solid ${isDark ? '#2563eb' : '#bfdbfe'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      View Details <ExternalLink size={10} />
                    </button>
                  </td>
                </tr>
              ))}
              {pagedSuppliers.length === 0 && <tr><td colSpan={6} style={{ padding: '12px', textAlign: 'center', color: theme.textMuted }}>No suppliers found</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '10px', color: theme.textMuted }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Rows per page</span>
            <select aria-label="Suppliers per page" value={supplierPageSize} onChange={e => { setSupplierPageSize(Number(e.target.value)); resetSupplierPage(); }} style={{ padding: '3px 6px', fontSize: '10px', color: theme.textMain, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '5px' }}>
              {[5, 10, 15].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <span>{visibleSuppliers.length ? (currentSupplierPage - 1) * supplierPageSize + 1 : 0}–{Math.min(currentSupplierPage * supplierPageSize, visibleSuppliers.length)} of {visibleSuppliers.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" disabled={currentSupplierPage <= 1} onClick={() => setSupplierPage(p => Math.max(1, p - 1))} style={{ padding: '3px 8px', fontSize: '10px', color: theme.textMain, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '5px', cursor: currentSupplierPage <= 1 ? 'default' : 'pointer', opacity: currentSupplierPage <= 1 ? 0.5 : 1 }}>Previous</button>
            <span>Page {currentSupplierPage} of {supplierPages}</span>
            <button type="button" disabled={currentSupplierPage >= supplierPages} onClick={() => setSupplierPage(p => Math.min(supplierPages, p + 1))} style={{ padding: '3px 8px', fontSize: '10px', color: theme.textMain, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '5px', cursor: currentSupplierPage >= supplierPages ? 'default' : 'pointer', opacity: currentSupplierPage >= supplierPages ? 0.5 : 1 }}>Next</button>
          </div>
        </div>
      </div>
      {selectedSupplier && (
        <div onClick={() => setSelectedSupplier(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div role="dialog" aria-modal="true" aria-label="Supplier details" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '620px', maxHeight: '80vh', overflowY: 'auto', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '16px', color: theme.textMain }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '13px' }}>{selectedSupplier.name} — Supplier Details</h3>
              <button type="button" aria-label="Close supplier details" onClick={() => setSelectedSupplier(null)} style={{ background: 'transparent', border: 'none', color: theme.textMain, cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: '11px', color: theme.textMuted }}>{selectedSupplier.count} contracts · ₹{(selectedSupplier.totalVal / 100000).toFixed(2)} Lakh · {selectedSupplier.risk} Risk</p>
            <p style={{ fontSize: '11px', color: theme.textMuted }}>Risk basis: {selectedSupplier.riskReason}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
              {Object.entries(selectedSupplier.contracts.reduce((counts, c) => { const key = c.status || 'Unknown'; counts[key] = (counts[key] || 0) + 1; return counts; }, {})).map(([status, count]) => <span key={status} style={{ padding: '4px 6px', border: `1px solid ${theme.border}`, borderRadius: '4px' }}>{status}: {count}</span>)}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                <thead><tr><th style={{ padding: '8px', borderBottom: `1px solid ${theme.border}` }}>Contract</th><th>Status</th><th>Priority</th><th style={{ textAlign: 'right' }}>Value</th></tr></thead>
                <tbody>{selectedSupplier.contracts.map((c, i) => <tr key={c.id || i} style={{ borderBottom: `1px solid ${theme.border}` }}><td style={{ padding: '8px' }}>{c.title || c.id || 'Untitled'}</td><td>{c.status || 'Unknown'}</td><td>{c.priority || '—'}</td><td style={{ textAlign: 'right' }}>₹{money(c.value).toLocaleString('en-IN')}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}