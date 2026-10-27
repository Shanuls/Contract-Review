import React from 'react';

export default function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        height: '100%',
        color: '#64748b',
        boxSizing: 'border-box'
      }}
    >
      {/* Icon: Modern subtle inbox / check badge */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: '#3b82f6'
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      {/* Main Copy */}
      <h3
        style={{
          margin: '0 0 6px 0',
          fontSize: '15px',
          fontWeight: 600,
          color: '#0f172a'
        }}
      >
        {title || 'All caught up.'}
      </h3>

      <p
        style={{
          margin: '0 0 20px 0',
          fontSize: '12.5px',
          color: '#64748b',
          maxWidth: '260px',
          lineHeight: 1.5
        }}
      >
        {description || 'No contracts are waiting for review.'}
      </p>

      {/* Action Button to Recover / Reset */}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}