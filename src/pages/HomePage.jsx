import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Clock, 
  ShieldAlert, 
  Award,
  ChevronRight 
} from 'lucide-react';

export default function HomePage({ contracts = [] }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Pure True Black & Neutral Charcoal Tokens
  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',          // Pitch black (#000000) illama soft slate navy
    cardBg: isDark ? '#172234' : '#ffffff',      // Soft dark card
    border: isDark ? '#233044' : '#e2e8f0',      // Subtle clean border
    borderLight: isDark ? '#1a2436' : '#f1f5f9',
    textMain: isDark ? '#94a3b8' : '#0f172a',    // <-- Pure white (#f4f4f5) illama glare adikadha soft slate text
    textMuted: isDark ? '#64748b' : '#64748b',   // Secondary text
    subtleBg: isDark ? '#131d2e' : '#f8fafc',
    innerHover: isDark ? '#1e2d42' : '#f1f5f9'
  };

  // Metrics Calculation
  const totalAgreements = contracts.length || 30;
  const pendingActions = contracts.filter((c) => c.status === 'New' || c.status === 'Open').length || 25;
  const blockedCount = contracts.filter((c) => c.status === 'Blocked').length || 3;
  const highTierCount = contracts.filter((c) => (c.value || 0) >= 7500000).length || 2;

  const urgentContracts = contracts
    .filter((c) => c.priority === 'HIGH' && c.status !== 'Approved' && c.status !== 'Rejected')
    .slice(0, 4);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        overflowY: 'auto',
        padding: '24px 32px',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Header Row (Theme buttons removed, only Title + Daily Target) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: theme.textMain,
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            Executive Dashboard
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: theme.textMuted }}>
            Welcome back, Priya Raman.
          </p>
        </div>

        {/* Daily Review Target Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '8px 14px'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase' }}>
              Daily Review Target
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textMain }}>
              14 / 25 completed
            </div>
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800
            }}
          >
            56%
          </div>
        </div>
      </div>

      {/* 2. AI Contract Copilot Banner */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0d0d0d 0%, #171717 100%)'
            : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: `1px solid ${isDark ? '#262626' : '#bfdbfe'}`,
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: theme.textMain, textTransform: 'uppercase' }}>
              AI CONTRACT COPILOT
            </div>
            <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '2px' }}>
              AI engine is ready to parse clauses, check SLA deadlines, and detect supplier rate anomalies.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/queue')}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '7px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Scan Queue Now</span>
          <span>⚡</span>
        </button>
      </div>

      {/* 3. Metrics Summary Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        {/* Total Pipeline */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Total Pipeline</span>
            <Briefcase size={16} style={{ color: theme.textMuted }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textMain, marginTop: '8px' }}>
            {totalAgreements}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>Committed Value</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: theme.textMain }}>₹10.29 Cr</span>
          </div>
        </div>

        {/* Pending Action */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Pending Action</span>
            <Clock size={16} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textMain, marginTop: '8px' }}>
            {pendingActions}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>Action Required</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6' }}>Needs decision</span>
          </div>
        </div>

        {/* Blocked Review */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>Blocked Review</span>
            <ShieldAlert size={16} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444', marginTop: '8px' }}>
            {blockedCount}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>Compliance hold</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444' }}>Escalated</span>
          </div>
        </div>

        {/* High Value Tier */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: theme.textMuted }}>High Value (&gt; ₹75L)</span>
            <Award size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: theme.textMain, marginTop: '8px' }}>
            {highTierCount}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>Sign-off status</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b' }}>2-Step Lock</span>
          </div>
        </div>
      </div>

      {/* 4. Category Spend Bar */}
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: theme.textMain, margin: 0 }}>
            Spend Allocation by Procurement Category
          </h3>
          <button
            type="button"
            onClick={() => navigate('/reports')}
            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <span>View Full Report</span>
            <ArrowRight size={12} />
          </button>
        </div>
        <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 12px 0' }}>
          Top portfolio spend across active vendor agreements
        </p>

        {/* Multi-segment Progress Bar */}
        <div style={{ height: '8px', borderRadius: '4px', overflow: 'hidden', display: 'flex', backgroundColor: isDark ? '#1f1f1f' : '#e2e8f0', marginBottom: '12px' }}>
          <div style={{ width: '50%', backgroundColor: '#2563eb' }} title="IT: 50%" />
          <div style={{ width: '15%', backgroundColor: '#8b5cf6' }} title="Electrical & Plant: 15%" />
          <div style={{ width: '10%', backgroundColor: '#10b981' }} title="Professional: 10%" />
          <div style={{ width: '8%', backgroundColor: '#f59e0b' }} title="Fuel: 8%" />
          <div style={{ width: '17%', backgroundColor: '#64748b' }} title="Other: 17%" />
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11px', color: theme.textMuted }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
            Information Technology: <strong style={{ color: theme.textMain }}>₹912.1L (50%)</strong>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
            Electrical & Plant: <strong style={{ color: theme.textMain }}>₹96.0L (15%)</strong>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Professional Services: <strong style={{ color: theme.textMain }}>₹80.0L (10%)</strong>
          </span>
        </div>
      </div>

      {/* 5. Bottom Split: Urgent Queue & Review Action Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Urgent Attention Required List */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: theme.textMain, margin: 0 }}>
              Urgent Attention Required
            </h3>
            <button
              type="button"
              onClick={() => navigate('/queue')}
              style={{
                background: 'none',
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                padding: '3px 8px',
                fontSize: '11px',
                color: theme.textMuted,
                cursor: 'pointer'
              }}
            >
              All Priority
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(urgentContracts.length > 0 ? urgentContracts : [
              { id: 'C-1002', title: 'High-Density Logistics Pallets & Automated Racks', supplier: 'Godrej Material Handling Ltd', value: 3800000 },
              { id: 'C-1042', title: 'Enterprise ERP SaaS License & Support Extension', supplier: 'Apex Cloud Solutions Pvt Ltd', value: 6200000 },
              { id: 'C-1003', title: 'Industrial Safety PPE & Fire Protection Gear', supplier: 'Suraksha Safety Gear Ltd', value: 1250000 },
              { id: 'C-1019', title: 'Factory Substation Electrical Transformer Overhaul', supplier: 'Schneider Electric India', value: 4200000 }
            ]).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/queue')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '7px',
                  border: `1px solid ${theme.borderLight}`,
                  backgroundColor: theme.subtleBg,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.innerHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.subtleBg; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6' }}>{item.id}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: theme.textMain }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px' }}>
                    {item.supplier}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: theme.textMain }}>
                    ₹{(item.value / 100000).toFixed(1)}L
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#ef4444' }}>
                    ↑ HIGH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Hub */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '10px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#3b82f6',
                  backgroundColor: isDark ? '#172554' : '#eff6ff',
                  border: `1px solid ${isDark ? '#1e3a8a' : '#bfdbfe'}`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                Action Hub
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={13} /> {blockedCount} Blocked Items
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme.textMain, margin: '8px 0 4px 0' }}>
              Contract Review Queue
            </h3>
            <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0, lineHeight: 1.4 }}>
              Directly approve vendors, verify quantity thresholds, and maintain compliance standards across all procurement categories.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => navigate('/queue')}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)'
              }}
            >
              <span>Open Review Queue ({pendingActions})</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}