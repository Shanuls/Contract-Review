import React from 'react';

export default function ContractSkeleton() {
  return (
    <div
      style={{
        padding: '14px 18px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* 1. ID & Price Placeholder */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '65px', height: '14px' }} />
        <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }} />
      </div>

      {/* 2. Supplier Placeholder */}
      <div className="skeleton-shimmer" style={{ width: '130px', height: '12px' }} />

      {/* 3. Title Placeholder */}
      <div className="skeleton-shimmer" style={{ width: '220px', height: '14px' }} />

      {/* 4. Badges Placeholder */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <div className="skeleton-shimmer" style={{ width: '52px', height: '18px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '60px', height: '18px', borderRadius: '4px' }} />
      </div>
    </div>
  );
}