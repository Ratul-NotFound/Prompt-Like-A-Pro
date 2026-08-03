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
          <Sliders size={15} className="tuner-icon" />
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
            {/* Role */}
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

            {/* Tone */}
            <div className="input-group">
              <label className="input-label">Tone & Style</label>
              <input
                type="text"
                className="tuner-input"
                value={tone}
                onChange={(e) => onChangeSettings({ ...settings, tone: e.target.value })}
                placeholder="e.g. Concise, Technical"
              />
            </div>

            {/* Audience */}
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

            {/* Format */}
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

          {/* Context */}
          <div className="input-group full-width" style={{ marginTop: '0.85rem' }}>
            <label className="input-label">Context (Optional)</label>
            <textarea
              className="tuner-textarea"
              rows={2}
              value={context}
              onChange={(e) => onChangeSettings({ ...settings, context: e.target.value })}
              placeholder="Specify database schemas, libraries, constraints, or prior state..."
            />
          </div>

          {/* Chain-of-Thought */}
          <div className="cot-toggle-bar">
            <div className="cot-info">
              <Brain size={15} className="cot-icon" />
              <div>
                <span className="cot-title">Chain-of-Thought Reasoning</span>
                <p className="cot-desc">Instructs model to reason step-by-step before producing code or final answers.</p>
              </div>
            </div>

            <label className="switch-container">
              <span className="switch-status">{useCoT ? 'Enabled' : 'Disabled'}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={useCoT}
                  onChange={(e) => onChangeSettings({ ...settings, useCoT: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </label>
          </div>
        </div>
      )}

      <style>{`
        .costar-tuner-container {
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .tuner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          cursor: pointer;
          user-select: none;
        }

        .tuner-header:hover {
          background: var(--bg-surface-hover);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
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
          gap: 0.65rem;
        }

        .tuner-body {
          padding: 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
        }

        .tuner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        @media (max-width: 640px) {
          .tuner-grid {
            grid-template-columns: 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .input-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tuner-input, .tuner-textarea {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          color: var(--text-primary);
          font-size: 0.825rem;
          font-family: var(--font-ui);
          outline: none;
          transition: border-color var(--transition-normal);
        }

        .tuner-input:focus, .tuner-textarea:focus {
          border-color: var(--border-medium);
        }

        .cot-toggle-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.85rem;
          padding: 0.65rem 0.85rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .cot-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cot-icon {
          color: var(--text-secondary);
        }

        .cot-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cot-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .switch-container {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .switch-status {
          font-size: 0.725rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 32px;
          height: 18px;
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
          background-color: var(--bg-input);
          border: 1px solid var(--border-subtle);
          transition: .2s;
          border-radius: 18px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 12px;
          width: 12px;
          left: 2px;
          bottom: 2px;
          background-color: var(--text-secondary);
          transition: .2s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #FFFFFF;
          border-color: #FFFFFF;
        }

        input:checked + .slider:before {
          transform: translateX(14px);
          background-color: #000;
        }
      `}</style>
    </div>
  );
}
