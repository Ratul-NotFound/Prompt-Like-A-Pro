import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';

export default function SettingsModal({ apiKey, onSaveApiKey, selectedModel, onSaveModel, onClose }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [model, setModel] = useState(selectedModel || 'gemini-1.5-pro');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onSaveModel(model);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
        <div className="modal-header">
          <div className="header-left">
            <Key size={18} className="modal-icon-emerald" />
            <h3 className="modal-title">API Settings & Model Control</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="security-notice">
            <ShieldCheck size={18} className="notice-icon" />
            <p>Your API key is stored <strong>locally in your browser</strong> (localStorage). It is never sent to any intermediary server.</p>
          </div>

          {/* Model Selector (New addition for lifetime free premium models) */}
          <div className="input-group" style={{ marginTop: '0.5rem' }}>
            <label className="input-label">Select Model Engine</label>
            <div className="select-wrapper">
              <select
                className="tuner-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended - Deep Intent Analysis & Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Lightweight, Faster Responses)</option>
              </select>
            </div>
            <p className="model-desc">
              <strong>Gemini 1.5 Pro</strong> features advanced cognitive reasoning and excels at understanding complex, nuanced instructions to craft elite prompts. Both models are available under Google AI Studio's free tier.
            </p>
          </div>

          <div className="input-group" style={{ marginTop: '0.5rem' }}>
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

          <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
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
              <span>Save & Apply</span>
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

        .select-wrapper {
          position: relative;
          width: 100%;
        }

        .tuner-input select {
          appearance: none;
        }

        .model-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 0.25rem;
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
          gap: 0.25rem;
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
