import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
  const { themeMode, setThemeMode, activeTheme } = useTheme();
  const isDark = activeTheme === 'dark';

  const options = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Laptop }
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
        border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
        borderRadius: '8px',
        padding: '3px',
        gap: '3px',
        userSelect: 'none'
      }}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = themeMode === opt.key;

        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => setThemeMode(opt.key)}
            title={`Switch to ${opt.label} mode`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              fontSize: '11px',
              fontWeight: isSelected ? 700 : 500,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isSelected
                ? '#2563eb'
                : 'transparent',
              color: isSelected
                ? '#ffffff'
                : (isDark ? '#94a3b8' : '#475569'),
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}
          >
            <Icon size={12} color={isSelected ? '#ffffff' : 'currentColor'} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}