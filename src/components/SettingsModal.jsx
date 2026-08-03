import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ apiKey, onSaveApiKey, onClose }) {
  const [inputKey, setInputKey] = useState(apiKey || '');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
        <div className="modal-header">
          <div className="header-left">
            <Key size={20} className="modal-icon-emerald" />
            <h3 className="modal-title">Live AI API Configuration</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="security-notice">
            <ShieldCheck size={18} className="notice-icon" />
            <p>Your API key is stored <strong>locally in your browser</strong> (localStorage). It is never sent to any middleman server.</p>
          </div>

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label className="input-label">Google Gemini API Key (Optional)</label>
            <input
              type="password"
              className="tuner-input"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
          </div>

          <p className="key-help">
            Get a free API Key from{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
            >
              Google AI Studio <ExternalLink size={12} />
            </a>
          </p>

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            {apiKey && (
              <button 
                type="button" 
                className="btn btn-ghost btn-sm text-rose"
                onClick={() => {
                  onSaveApiKey('');
                  setInputKey('');
                }}
              >
                Clear Key
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-emerald">
              <Check size={16} />
              <span>Save & Activate</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-icon-emerald {
          color: var(--accent-emerald);
        }

        .security-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .notice-icon {
          color: #34D399;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .key-help {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .link {
          color: var(--accent-primary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .link:hover {
          text-decoration: underline;
        }

        .text-rose {
          color: var(--accent-rose);
        }
      `}</style>
    </div>
  );
}
