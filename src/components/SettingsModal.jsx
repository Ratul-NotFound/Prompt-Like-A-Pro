import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ apiKey, onSaveApiKey, selectedModel, onSaveModel, onClose }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [model, setModel] = useState(selectedModel || 'gemini-2.5-pro');

  const isEnvKeyDefined = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  const handleSave = (e) => {
    e.preventDefault();
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

          {/* Model Selector */}
          <div className="input-group" style={{ marginTop: '0.5rem' }}>
            <label className="input-label">Select Model Engine</label>
            <div className="select-wrapper">
              <select
                className="tuner-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended - Deep Intent Analysis & Reasoning)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast, Multimodal)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Balanced Speed & Precision)</option>
              </select>
            </div>
            <p className="model-desc">
              <strong>Gemini 2.5 Pro</strong> features advanced cognitive reasoning and excels at understanding complex, nuanced instructions to craft elite prompts. Both models are available under Google AI Studio's free tier.
            </p>
          </div>

          {/* Multi-Provider Engine Status */}
          <div className="input-group" style={{ marginTop: '0.5rem' }}>
            <label className="input-label">Multi-Provider AI Rotation Engine</label>
            <div className="env-detected-block">
              <div className="status-indicator" style={{ background: 'rgba(16, 185, 129, 0.08)', marginLeft: 0, padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                <span className="status-dot active" />
                <span className="status-text" style={{ color: '#10B981', fontWeight: 600 }}>Active (Server & Local .env Keys)</span>
              </div>
              <p className="env-help">
                Zero setup required! The app automatically rotates across free tier tokens from <strong>Google Gemini</strong>, <strong>Groq Cloud</strong>, <strong>OpenRouter</strong>, and <strong>Hugging Face</strong>.
              </p>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
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

        .model-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 0.25rem;
        }

        .env-detected-block {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .env-help {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.4;
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
