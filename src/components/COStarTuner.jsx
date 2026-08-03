import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Sparkles, Brain, Check } from 'lucide-react';

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
          <div className="tuner-icon">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="tuner-title">Framework & CO-STAR Fine-Tuning</h3>
            <p className="tuner-sub">Customize role persona, background context, tone, and output constraints.</p>
          </div>
        </div>

        <div className="header-right">
          <span className="badge badge-indigo">CO-STAR Active</span>
          <button className="btn btn-ghost btn-sm toggle-btn">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="tuner-body animate-fade-in">
          <div className="tuner-grid">
            {/* Persona / Role Input */}
            <div className="input-group">
              <label className="input-label">Role & Persona Priming</label>
              <input
                type="text"
                className="tuner-input"
                value={role}
                onChange={(e) => onChangeSettings({ ...settings, role: e.target.value })}
                placeholder="e.g. Principal Software Engineer & Security Specialist"
              />
            </div>

            {/* Tone Input */}
            <div className="input-group">
              <label className="input-label">Tone & Style Directive</label>
              <input
                type="text"
                className="tuner-input"
                value={tone}
                onChange={(e) => onChangeSettings({ ...settings, tone: e.target.value })}
                placeholder="e.g. Concise, Production-Grade, Technical"
              />
            </div>

            {/* Target Audience */}
            <div className="input-group">
              <label className="input-label">Target Audience</label>
              <input
                type="text"
                className="tuner-input"
                value={audience}
                onChange={(e) => onChangeSettings({ ...settings, audience: e.target.value })}
                placeholder="e.g. Senior Developers / Technical Team Leads"
              />
            </div>

            {/* Output Format */}
            <div className="input-group">
              <label className="input-label">Output Format Specification</label>
              <input
                type="text"
                className="tuner-input"
                value={format}
                onChange={(e) => onChangeSettings({ ...settings, format: e.target.value })}
                placeholder="e.g. Markdown code block with inline comments"
              />
            </div>
          </div>

          {/* Context Input */}
          <div className="input-group full-width" style={{ marginTop: '0.85rem' }}>
            <label className="input-label">Background Context (Optional)</label>
            <textarea
              className="tuner-textarea"
              rows={2}
              value={context}
              onChange={(e) => onChangeSettings({ ...settings, context: e.target.value })}
              placeholder="Add project background, tech stack constraints, or relevant prior state..."
            />
          </div>

          {/* Chain-of-Thought Toggle */}
          <div className="cot-toggle-bar">
            <div className="cot-info">
              <Brain size={18} className="cot-icon" />
              <div>
                <span className="cot-title">Chain-of-Thought (CoT) Prompting</span>
                <p className="cot-desc">Instructs the AI to reason step-by-step before producing final code/answers for higher accuracy.</p>
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
          overflow: hidden;
        }

        .tuner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
          user-select: none;
        }

        .tuner-header:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tuner-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.15);
          color: #818CF8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tuner-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tuner-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tuner-body {
          padding: 0 1.25rem 1.25rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: rgba(11, 16, 26, 0.4);
        }

        .tuner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          margin-top: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .tuner-input, .tuner-textarea {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.55rem 0.75rem;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-family: var(--font-ui);
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .tuner-input:focus, .tuner-textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
        }

        .cot-toggle-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding: 0.85rem 1rem;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: var(--radius-md);
        }

        .cot-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cot-icon {
          color: #C084FC;
        }

        .cot-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);

        }

        .cot-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
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
          border: 1px solid var(--border-medium);
          transition: .3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: var(--text-secondary);
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        input:checked + .slider:before {
          transform: translateX(20px);
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
