import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FileCheck2, BarChart3, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ onLogout, user }) {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';
  const [activeTooltip, setActiveTooltip] = useState(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Review Queue', path: '/queue', icon: FileText },
    { name: 'Reports', path: '/reports', icon: BarChart3 }
  ];

  const handleToggleTooltip = (name) => {
    setActiveTooltip((prev) => (prev === name ? null : name));
  };

  return (
    <aside
      style={{
        width: '62px',
        backgroundColor: isDark ? '#0b0f19' : '#0f172a',
        color: '#94a3b8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: `1px solid ${isDark ? '#1f1f1f' : '#1e293b'}`,
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* 1. CR Logo + Periya Font ProcureFlow Text with Proper Spacing */}
      <div
        style={{
          padding: '11px 6px 10px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          width: '100%',
          borderBottom: `1px solid ${isDark ? '#1a1a1a' : '#1e293b'}`
        }}
        title="ProcureFlow - Contract Portal"
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.35)'
          }}
        >
          <FileCheck2 size={23} strokeWidth={1.8} aria-label="Contract Review" />
        </div>
        {/* <div
          style={{
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.2px',
            textAlign: 'center',
            lineHeight: 1.2,
            whiteSpace: 'nowrap'
          }}
        > */}
          {/* ProcureFlow */}
        {/* </div> */}
      </div>

      {/* 2. Nav Icons with Spacing and Tooltips */}
      <nav
        style={{
          padding: '10px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          flex: 1,
          width: '100%'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isTooltipVisible = activeTooltip === item.name;

          return (
            <div
              key={item.path}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
              onMouseEnter={() => setActiveTooltip(item.name)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <NavLink
                to={item.path}
                onClick={() => handleToggleTooltip(item.name)}
                style={({ isActive }) => ({
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9px',
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#a1a1aa',
                  backgroundColor: isActive ? '#2563eb' : 'transparent',
                  transition: 'background-color 0.2s, color 0.2s'
                })}
              >
                <Icon size={20} strokeWidth={2} />
              </NavLink>

              {/* Tooltip on Hover/Click */}
              {isTooltipVisible && (
                <div
                  style={{
                    position: 'absolute',
                    left: '54px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #334155',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                    pointerEvents: 'none'
                  }}
                >
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 3. Footer: Priya Raman Avatar */}
      <div
        style={{
          padding: '12px 0',
          borderTop: `1px solid ${isDark ? '#1a1a1a' : '#1e293b'}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative'
        }}
        onMouseEnter={() => setActiveTooltip('user')}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#18181b' : '#334155',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {(user?.name || 'Reviewer').trim().split(/\s+/).slice(0,2).map(part => part[0]?.toUpperCase()).join('')}
        </div>

        {/* User Info Tooltip */}
        {activeTooltip === 'user' && (
          <div
            style={{
              position: 'absolute',
              left: '54px',
              bottom: '14px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              padding: '7px 12px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              zIndex: 100,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>
              {user?.name || 'Reviewer'}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              {user?.role || 'Reviewer'}
            </div>
          </div>
        )}
      </div>
    <button type="button" className="queue-sidebar-logout" onClick={onLogout} aria-label="Log out of demo account" title="Log out"><LogOut size={18} strokeWidth={2} /></button>
    </aside>
  );
}