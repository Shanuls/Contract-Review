import React from 'react';

export default function ErrorState({ onRetry }) {
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
      {/* Alert Warning Icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: '#ef4444'
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Primary Error Headline */}
      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '15px',
          fontWeight: 600,
          color: '#0f172a'
        }}
      >
        We couldn't load the queue.
      </h3>

      {/* Safety Reassurance Copy */}
      <p
        style={{
          margin: '0 0 20px 0',
          fontSize: '13px',
          color: '#64748b',
          maxWidth: '280px',
          lineHeight: 1.5
        }}
      >
        Your decisions are saved. Please check your connection and try again.
      </p>

      {/* Actionable Recovery Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try again
        </button>
      )}
    </div>
  );
}