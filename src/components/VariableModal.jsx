import React, { useState } from 'react';
import { X, Check, Sliders } from 'lucide-react';

export default function VariableModal({ variables, onApply, onClose }) {
  const [values, setValues] = useState(() => {
    const initial = {};
    variables.forEach(v => {
      initial[v] = '';
    });
    return initial;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(values);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
        <div className="modal-header">
          <div className="header-left">
            <Sliders size={20} className="modal-icon" />
            <h3 className="modal-title">Fill Prompt Variables</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p className="modal-desc">
            We detected <strong>{variables.length}</strong> variable placeholder{variables.length > 1 ? 's' : ''} in your prompt. Enter their values below to auto-replace them before copying.
          </p>

          <div className="variables-list">
            {variables.map(varName => (
              <div key={varName} className="input-group">
                <label className="input-label">
                  <span className="var-chip">{`{{${varName}}}`}</span>
                </label>
                <input
                  type="text"
                  className="tuner-input"
                  placeholder={`Enter value for ${varName}...`}
                  value={values[varName] || ''}
                  onChange={(e) => setValues({ ...values, [varName]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Replace & Copy Prompt</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(8, 11, 17, 0.8);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 520px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-icon {
          color: var(--accent-secondary);
        }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-body {
          padding: 1.25rem;
        }

        .modal-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .variables-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 320px;
          overflow-y: auto;
          margin-bottom: 1.5rem;
          padding-right: 0.25rem;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
        }
      `}</style>
    </div>
  );
}
