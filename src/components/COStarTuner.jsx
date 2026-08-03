import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Brain } from 'lucide-react';

export default function COStarTuner({ settings, onChangeSettings, selectedDomain }) {
  const [isOpen, setIsOpen] = useState(false);

  const role = settings.role || selectedDomain.defaultRole;
  const tone = settings.tone || selectedDomain.frameworkDefaults.tone;
  const audience = settings.audience || selectedDomain.frameworkDefaults.audience;
  const format = settings.format || selectedDomain.frameworkDefaults.format;
  const context = settings.context || '';
  const useCoT = settings.useCoT !== false;

  return (
    <div className="costar-tuner-container glass-card">
      <div className="tuner-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-left">
          <Sliders size={16} className="tuner-icon" />
          <div>
            <h3 className="tuner-title">Framework & Persona Parameters</h3>
            <p className="tuner-sub">Fine-tune role, background context, tone, and reasoning constraints.</p>
          </div>
        </div>

        <div className="header-right">
          <span className="badge">CO-STAR Active</span>
          <button className="btn btn-ghost btn-sm">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="tuner-body animate-fade-in">
          <div className="tuner-grid">
            <div className="input-group">
              <label className="input-label">Role & Persona</label>
              <input
                type="text"
                className="tuner-input"
                value={role}
                onChange={(e) => onChangeSettings({ ...settings, role: e.target.value })}
                placeholder="e.g. Principal Software Engineer"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tone & Style</label>
              <input
                type="text"
                className="tuner-input"
                value={tone}
                onChange={(e) => onChangeSettings({ ...settings, tone: e.target.value })}
                placeholder="e.g. Concise, Production-Grade"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Target Audience</label>
              <input
                type="text"
                className="tuner-input"
                value={audience}
                onChange={(e) => onChangeSettings({ ...settings, audience: e.target.value })}
                placeholder="e.g. Senior Developers"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Output Format</label>
              <input
                type="text"
                className="tuner-input"
                value={format}
                onChange={(e) => onChangeSettings({ ...settings, format: e.target.value })}
                placeholder="e.g. Markdown code block"
              />
            </div>
          </div>

          <div className="input-group full-width" style={{ marginTop: '0.75rem' }}>
            <label className="input-label">Background Context</label>
            <textarea
              className="tuner-textarea"
              rows={2}
              value={context}
              onChange={(e) => onChangeSettings({ ...settings, context: e.target.value })}
              placeholder="Add project background, tech stack constraints, or relevant prior state..."
            />
          </div>

          <div className="cot-toggle-bar">
            <div className="cot-info">
              <Brain size={16} className="cot-icon" />
              <div>
                <span className="cot-title">Chain-of-Thought (CoT) Reasoning</span>
                <p className="cot-desc">Instructs model to reason step-by-step before producing code or final answers.</p>
              </div>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={useCoT}
                onChange={(e) => onChangeSettings({ ...settings, useCoT: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      )}

      <style>{`
        .costar-tuner-container {
          margin-bottom: 1.5rem;
        }

        .tuner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          cursor: pointer;
          user-select: none;
        }

        .tuner-header:hover {
          background: var(--bg-surface-hover);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .tuner-icon {
          color: var(--text-secondary);
        }

        .tuner-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tuner-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tuner-body {
          padding: 0.85rem 1rem 1rem 1rem;
          border-top: 1px solid var(--border-medium);
          background: var(--bg-input);
        }

        .tuner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .input-label {
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .tuner-input, .tuner-textarea {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 0.45rem 0.65rem;
          color: var(--text-primary);
          font-size: 0.825rem;
          font-family: var(--font-ui);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .tuner-input:focus, .tuner-textarea:focus {
          border-color: var(--border-active);
        }

        .cot-toggle-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.85rem;
          padding: 0.65rem 0.85rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
        }

        .cot-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .cot-icon {
          color: var(--accent-blue);
        }

        .cot-title {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cot-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        /* Minimal Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          transition: .2s;
          border-radius: 20px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: var(--text-secondary);
          transition: .2s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        input:checked + .slider:before {
          transform: translateX(18px);
          background-color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .tuner-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
