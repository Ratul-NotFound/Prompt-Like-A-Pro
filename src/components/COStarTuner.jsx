import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Brain, Target, Zap } from 'lucide-react';

// Persona presets matched to common use cases
const ROLE_PRESETS = [
  { label: 'Auto-detect', value: '' },
  { label: 'Senior Engineer', value: 'Senior Software Engineer with 10+ years in production systems' },
  { label: 'Data Scientist', value: 'Senior Data Scientist specializing in ML and statistical analysis' },
  { label: 'Product Manager', value: 'Senior Product Manager with deep user research and strategy expertise' },
  { label: 'UX Designer', value: 'Senior UX/UI Designer with a focus on conversion and accessibility' },
  { label: 'Content Strategist', value: 'Expert Content Strategist and professional copywriter' },
  { label: 'Security Auditor', value: 'Principal Cybersecurity Engineer and OWASP threat modeling specialist' },
  { label: 'Business Analyst', value: 'Senior Business Analyst with expertise in data-driven decision making' },
];

// Target AI tool presets — changes output structure
const TARGET_AI_OPTIONS = [
  { label: 'Any AI (Universal)', value: 'universal' },
  { label: 'ChatGPT / GPT-4o', value: 'chatgpt' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Midjourney', value: 'midjourney' },
  { label: 'AI Coding Agent', value: 'coding_agent' },
  { label: 'Perplexity', value: 'perplexity' },
];

const TARGET_AI_HINTS = {
  universal:    'Optimized for any AI tool — clean, structured, unambiguous',
  chatgpt:      'Optimized for GPT-4o — conversational flow, role-play format, step-by-step',
  claude:       'Optimized for Claude — XML-style sections, detailed context, nuanced tone',
  gemini:       'Optimized for Gemini — multimodal-friendly, code-aware, structured sections',
  midjourney:   'Optimized for Midjourney — visual descriptors, camera specs, platform flags',
  coding_agent: 'Optimized for coding agents (Cursor, Copilot) — precise specs, no ambiguity',
  perplexity:   'Optimized for Perplexity — research framing, citation-friendly structure',
};

export default function COStarTuner({ settings, onChangeSettings, selectedDomain }) {
  const [isOpen, setIsOpen] = useState(false);

  const role       = settings.role       || '';
  const tone       = settings.tone       || selectedDomain.frameworkDefaults?.tone       || '';
  const audience   = settings.audience   || selectedDomain.frameworkDefaults?.audience   || '';
  const format     = settings.format     || selectedDomain.frameworkDefaults?.format     || '';
  const context    = settings.context    || '';
  const targetAI   = settings.targetAI   || 'universal';
  const useCoT     = settings.useCoT !== false;

  const activeCount = [role, tone, audience, format, context, targetAI !== 'universal' ? targetAI : '']
    .filter(Boolean).length;

  return (
    <div className="costar-tuner-container glass-card">
      <div className="tuner-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-left">
          <Sliders size={15} className="tuner-icon" />
          <div>
            <h3 className="tuner-title">Prompt Parameters & Target AI</h3>
            <p className="tuner-sub">Fine-tune persona, target AI tool, tone, and reasoning mode.</p>
          </div>
        </div>

        <div className="header-right">
          {activeCount > 0 && (
            <span className="badge badge-indigo">{activeCount} active</span>
          )}
          <span className="badge">CO-STAR Active</span>
          <button className="btn btn-ghost btn-sm">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="tuner-body animate-fade-in">

          {/* Target AI Selector — most important for hackathon */}
          <div className="target-ai-section">
            <div className="section-label-row">
              <Target size={13} className="section-icon" />
              <span className="section-label">Target AI Tool</span>
              <span className="section-hint">The engineered prompt will be optimized for this AI</span>
            </div>
            <div className="target-ai-grid">
              {TARGET_AI_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`target-ai-btn ${targetAI === opt.value ? 'selected' : ''}`}
                  onClick={() => onChangeSettings({ ...settings, targetAI: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="target-ai-hint-text">{TARGET_AI_HINTS[targetAI]}</p>
          </div>

          <div className="tuner-divider" />

          <div className="tuner-grid">
            {/* Role with presets */}
            <div className="input-group">
              <div className="label-row">
                <label className="input-label">Role & Persona</label>
                <select
                  className="preset-select"
                  onChange={(e) => e.target.value && onChangeSettings({ ...settings, role: e.target.value })}
                  value=""
                >
                  <option value="">Presets ▾</option>
                  {ROLE_PRESETS.map(p => (
                    <option key={p.label} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
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
                placeholder="e.g. Concise, Technical, Authoritative"
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
                placeholder="e.g. Senior Developers, Non-technical Managers"
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
                placeholder="e.g. Structured Markdown, JSON, Step-by-step"
              />
            </div>
          </div>

          {/* Context */}
          <div className="input-group full-width" style={{ marginTop: '0.85rem' }}>
            <div className="label-row">
              <label className="input-label">Additional Context</label>
              <span className="label-hint">Tech stack, constraints, project state, prior attempts</span>
            </div>
            <textarea
              className="tuner-textarea"
              rows={2}
              value={context}
              onChange={(e) => onChangeSettings({ ...settings, context: e.target.value })}
              placeholder="e.g. React + TypeScript codebase, must not use external libraries, error occurs only in production..."
            />
          </div>

          {/* Chain-of-Thought */}
          <div className="cot-toggle-bar">
            <div className="cot-info">
              <Brain size={15} className="cot-icon" />
              <div>
                <span className="cot-title">Chain-of-Thought Reasoning</span>
                <p className="cot-desc">Forces the target AI to reason step-by-step before producing output — dramatically improves accuracy on complex tasks.</p>
              </div>
            </div>

            <label className="switch-container">
              <span className="switch-status">{useCoT ? 'ON' : 'OFF'}</span>
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
          border-radius: var(--radius-lg);
          transition: background var(--transition-normal);
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
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* ── Target AI Section ──────────────────────────────────────────── */
        .target-ai-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-label-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .section-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .section-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .section-hint {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .target-ai-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .target-ai-btn {
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .target-ai-btn:hover {
          border-color: var(--border-medium);
          color: var(--text-primary);
          background: var(--bg-surface-hover);
        }

        .target-ai-btn.selected {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.4);
          color: #818CF8;
        }

        .target-ai-hint-text {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0.15rem 0.1rem;
        }

        .tuner-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.1rem 0;
        }

        /* ── Param Grid ─────────────────────────────────────────────────── */
        .tuner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .label-hint {
          font-size: 0.6rem;
          color: var(--text-muted);
        }

        .preset-select {
          font-size: 0.65rem;
          font-weight: 600;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          color: var(--text-secondary);
          padding: 0.1rem 0.3rem;
          cursor: pointer;
          outline: none;
        }

        .preset-select:focus {
          border-color: var(--border-medium);
        }

        @media (max-width: 640px) {
          .tuner-header { padding: 0.65rem 0.85rem; }
          .tuner-sub { display: none; }
          .tuner-title { font-size: 0.8rem; }
          .tuner-grid { grid-template-columns: 1fr; gap: 0.65rem; }
          .cot-toggle-bar { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .switch-container { width: 100%; justify-content: space-between; }
          .target-ai-grid { gap: 0.3rem; }
          .target-ai-btn { font-size: 0.68rem; padding: 0.28rem 0.55rem; }
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

        .cot-icon { color: #A78BFA; }

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
          font-weight: 700;
          min-width: 2rem;
          text-align: right;
        }

        /* Toggle Switch */
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
          background-color: #6366F1;
          border-color: #6366F1;
        }

        input:checked + .slider:before {
          transform: translateX(14px);
          background-color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
