import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Plus, 
  HelpCircle, 
  Columns, 
  LayoutGrid
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TopNavbar({ 
  setShowAddModal, 
  setShowShortcutsModal,
  viewMode = 'split',
  setViewMode,
  grayscale,
  setGrayscale
}) {
  const location = useLocation();
  const { themeMode, cycleTheme, activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  // Soft Slate Theme colors for Topbar
  const topTheme = {
    bg: isDark ? '#0f172a' : '#ffffff',
    border: isDark ? '#1e293b' : '#e2e8f0',
    textMain: isDark ? '#f8fafc' : '#0f172a',
    btnBg: isDark ? '#1e293b' : '#ffffff',
    btnBorder: isDark ? '#334155' : '#e2e8f0',
    toggleWrapBg: isDark ? '#0b0f19' : '#f1f5f9',
    iconColor: isDark ? '#94a3b8' : '#64748b'
  };

  // Tooltip hover states
  const [activeTooltip, setActiveTooltip] = useState(null);
  const isQueuePage = location.pathname.startsWith('/queue');

  // 1-Click 3-Way Cycle Icon Helper
  const renderThemeIcon = () => {
    if (themeMode === 'light') {
      return <Sun size={16} style={{ color: '#eab308' }} />;
    }
    if (themeMode === 'dark') {
      return <Moon size={16} style={{ color: '#38bdf8' }} />;
    }
    return <Laptop size={16} style={{ color: isDark ? '#94a3b8' : '#64748b' }} />;
  };

  const themeLabel = {
    system: 'System Mode',
    light: 'Light Mode',
    dark: 'Dark Mode'
  }[themeMode] || 'System Mode';

  // Smooth Tooltip Component Helper
  const renderSmoothTooltip = (label, sublabel = null) => (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        right: '0',
        backgroundColor: isDark ? '#1e293b' : '#18181b',
        color: '#f4f4f5',
        border: `1px solid ${isDark ? '#334155' : '#27272a'}`,
        padding: '5px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        zIndex: 100,
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        animation: 'smoothTooltipIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <span>{label}</span>
      {sublabel && <span style={{ color: '#a1a1aa', fontSize: '10px' }}>{sublabel}</span>}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes smoothTooltipIn {
          0% {
            opacity: 0;
            transform: translateY(-4px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <header
        style={{
          height: '56px',
          // backgroundColor: topTheme.bg,
          borderBottom: `1px solid ${topTheme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'background-color 0.15s ease, border-color 0.15s ease'
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: topTheme.textMain,
              margin: 0,
              letterSpacing: '-0.01em'
            }}
          >
            {isQueuePage ? 'Contract Review Queue' : 'ProcureFlow Portal'}
            
          </h1>
        </div>

        {/* Right Action Controls */}
        {isQueuePage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Split / Table View Toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: topTheme.toggleWrapBg,
                borderRadius: '8px',
                padding: '3px',
                border: `1px solid ${topTheme.border}`
              }}
            >
              {/* Split View Button */}
              <div 
                style={{ position: 'relative', display: 'inline-flex' }}
                onMouseEnter={() => setActiveTooltip('split')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  onClick={() => setViewMode && setViewMode('split')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: viewMode === 'split' ? '1px solid #bfdbfe' : 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'split' ? '#2563eb' : 'transparent',
                    color: viewMode === 'split' ? '#ffffff' : topTheme.iconColor,
                    boxShadow: viewMode === 'split' ? '0 1px 3px rgba(37,99,235,0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Columns size={16} />
                </button>
                {activeTooltip === 'split' && renderSmoothTooltip('Split View')}
              </div>

              {/* Table View Button */}
              <div 
                style={{ position: 'relative', display: 'inline-flex' }}
                onMouseEnter={() => setActiveTooltip('table')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  onClick={() => setViewMode && setViewMode('table')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: viewMode === 'table' ? '1px solid #bfdbfe' : 'none',
                    cursor: 'pointer',
                    backgroundColor: viewMode === 'table' ? '#2563eb' : 'transparent',
                    color: viewMode === 'table' ? '#ffffff' : topTheme.iconColor,
                    boxShadow: viewMode === 'table' ? '0 1px 3px rgba(37,99,235,0.3)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <LayoutGrid size={16} />
                </button>
                {activeTooltip === 'table' && renderSmoothTooltip('Table View')}
              </div>
            </div>

            {/* + Add Contract Button */}
            <button
              type="button"
              onClick={() => setShowAddModal && setShowAddModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 14px',
                borderRadius: '7px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
            >
              <Plus size={16} />
              <span>Add Contract</span>
            </button>

            {/* Keyboard Shortcuts Button */}
            <div 
              style={{ position: 'relative', display: 'inline-flex' }}
              onMouseEnter={() => setActiveTooltip('shortcuts')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                type="button"
                onClick={() => setShowShortcutsModal && setShowShortcutsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '7px',
                  border: `1px solid ${topTheme.btnBorder}`,
                  backgroundColor: topTheme.btnBg,
                  color: topTheme.iconColor,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <HelpCircle size={16} />
              </button>
              {activeTooltip === 'shortcuts' && renderSmoothTooltip('Keyboard Shortcuts')}
            </div>

            {/* 3-Way Cycle Theme Icon Button */}
            <div 
              style={{ position: 'relative', display: 'inline-flex' }}
              onMouseEnter={() => setActiveTooltip('theme')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                type="button"
                onClick={cycleTheme}
                aria-label={`Theme: ${themeLabel}. Click to switch theme.`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '7px',
                  border: `1px solid ${topTheme.btnBorder}`,
                  backgroundColor: topTheme.btnBg,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {renderThemeIcon()}
              </button>
              {activeTooltip === 'theme' && renderSmoothTooltip(themeLabel)}
            </div>
          </div>
        )}
      </header>
    </>
  );
}