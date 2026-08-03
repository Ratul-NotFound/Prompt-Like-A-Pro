import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon-emerald" />,
    error: <AlertCircle size={18} className="toast-icon-rose" />,
    info: <Info size={18} className="toast-icon-indigo" />
  };

  return (
    <div className={`toast-notification glass-card toast-${type} animate-slide-right`}>
      <div className="toast-content">
        {icons[type]}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={14} />
      </button>

      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1.15rem;
          border-radius: var(--radius-md);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          min-width: 280px;
        }

        .toast-success {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(15, 22, 35, 0.95);
        }

        .toast-error {
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(15, 22, 35, 0.95);
        }

        .toast-info {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(15, 22, 35, 0.95);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .toast-icon-emerald { color: #34D399; }
        .toast-icon-rose { color: #FB7185; }
        .toast-icon-indigo { color: #818CF8; }

        .toast-message {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
          border-radius: 4px;
        }

        .toast-close:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
