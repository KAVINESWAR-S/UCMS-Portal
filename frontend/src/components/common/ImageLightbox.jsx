import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

export const ImageLightbox = ({ isOpen, onClose, imageUrl, title = 'Photo Evidence Preview' }) => {
  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `grievance-evidence-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 120, backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1.25rem',
            background: 'rgba(30, 41, 59, 0.9)',
            borderBottom: '1px solid #334155',
            color: '#f8fafc',
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleDownload}
              title="Download Image"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#f8fafc',
                cursor: 'pointer',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
              }}
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={onClose}
              title="Close"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            maxHeight: 'calc(90vh - 60px)',
          }}
        >
          <img
            src={imageUrl}
            alt="Grievance evidence full view"
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(85vh - 60px)',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
