import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  RotateCcw, 
  Eye, 
  Layers, 
  Check, 
  Terminal, 
  Zap,
  Star,
  Sliders,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function PromptWorkbench({
  rawInput,
  onRawInputChange,
  enhancedResult,
  selectedDomain,
  onEnhance,
  isEnhancing,
  hasApiKey,
  onCopy,
  onOpenVariableModal,
  onSaveToHistory
}) {
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' | 'diff'
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut listener (Ctrl + Enter to trigger enhance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (rawInput.trim() && !isEnhancing) {
          onEnhance();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rawInput, isEnhancing, onEnhance]);

  const handleCopyClick = () => {
    if (enhancedResult?.variables?.length > 0) {
      onOpenVariableModal();
    } else {
      onCopy(enhancedResult.enhancedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    if (!enhancedResult?.enhancedText) return;
    const blob = new Blob([enhancedResult.enhancedText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${selectedDomain.id}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="vertical-workbench-flow">
      {/* 2. Middle Section: Prompt Input Console */}
      <div className="workbench-card raw-card glass-card">
        <div className="card-header-bar">
          <div className="header-left">
            <Terminal size={16} className="text-primary" />
            <h3 className="card-title">Prompt Input Console</h3>
            <span className="persona-hint">Priming: {selectedDomain.defaultRole}</span>
          </div>

          <div className="header-actions">
            {rawInput && (
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => onRawInputChange('')}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="card-body-area">
          <textarea
            className="main-textarea"
            rows={5}
            value={rawInput}
            onChange={(e) => onRawInputChange(e.target.value)}
            placeholder={`Type your raw prompt idea here...\n\ne.g., "${selectedDomain.examples[0]}"`}
          />

          {/* Preset Example Ideas */}
          <div className="example-starters-bar">
            <span className="starters-label">Try Example Idea:</span>
            <div className="starters-list">
              {selectedDomain.examples.map((ex, idx) => (
                <button
                  key={idx}
                  className="starter-pill"
                  onClick={() => onRawInputChange(ex)}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-footer-bar">
          <div className="meta-counts">
            <span className="count-badge">{rawInput.length} chars</span>
            <span className="count-badge">~{Math.ceil(rawInput.length / 4)} tokens</span>
          </div>

          <div className="action-button-wrapper">
            <button
              className="btn btn-primary btn-enhance-main"
              onClick={onEnhance}
              disabled={!rawInput.trim() || isEnhancing}
            >
              {isEnhancing ? (
                <>
                  <div className="spinner" />
                  <span>Engineering Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>{hasApiKey ? 'Enhance with Gemini AI' : 'Enhance Prompt Now'}</span>
                  <span className="kbd-shortcut">Ctrl ↵</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Enhanced Output View */}
      <div className="workbench-card output-card glass-card">
        <div className="card-header-bar">
          <div className="header-left">
            <Cpu size={16} className="text-emerald" />
            <h3 className="card-title">Engineered Output</h3>
          </div>

          {enhancedResult?.enhancedText && (
            <div className="view-mode-tabs">
              <button
                className={`tab-btn ${viewMode === 'formatted' ? 'active' : ''}`}
                onClick={() => setViewMode('formatted')}
              >
                <Eye size={13} />
                <span>Formatted View</span>
              </button>
              <button
                className={`tab-btn ${viewMode === 'diff' ? 'active' : ''}`}
                onClick={() => setViewMode('diff')}
              >
                <Layers size={13} />
                <span>Diff Breakdown</span>
              </button>
            </div>
          )}
        </div>

        <div className="card-body-area">
          {!enhancedResult?.enhancedText ? (
            <div className="empty-state">
              <Sparkles size={32} className="empty-sparkle" />
              <h4 className="empty-heading">Ready to Engineer Your Prompt</h4>
              <p className="empty-sub">Type your prompt idea above and click <strong>Enhance Prompt Now</strong> to apply persona priming, CO-STAR structure, and guardrails.</p>
            </div>
          ) : (
            <div className="output-wrapper animate-fade-in">
              {viewMode === 'formatted' ? (
                <pre className="code-display">{enhancedResult.enhancedText}</pre>
              ) : (
                <div className="diff-breakdown-list">
                  {enhancedResult.additions?.map((item, idx) => (
                    <div key={idx} className="diff-added">
                      <span className="diff-tag">+{item.tag}</span>
                      <pre className="diff-text">{item.text}</pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {enhancedResult?.enhancedText && (
          <div className="card-footer-bar">
            <div className="meta-counts">
              <span className="badge badge-emerald">~{enhancedResult.tokenCount} Tokens</span>
              {enhancedResult.variables?.length > 0 && (
                <span className="badge badge-cyan">{enhancedResult.variables.length} Variables</span>
              )}
            </div>

            <div className="action-buttons-group">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onSaveToHistory(enhancedResult)}
              >
                <Star size={14} />
                <span>Save</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleExportMarkdown}
              >
                <Download size={14} />
                <span>Export .md</span>
              </button>

              {enhancedResult.variables?.length > 0 ? (
                <button
                  className="btn btn-emerald btn-sm"
                  onClick={onOpenVariableModal}
                >
                  <Sliders size={14} />
                  <span>Fill Variables</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleCopyClick}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .vertical-workbench-flow {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .workbench-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .persona-hint {
          font-size: 0.725rem;
          color: var(--text-muted);
          background: var(--bg-subtle);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .card-body-area {
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
        }

        .main-textarea {
          width: 100%;
          min-height: 120px;
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.5;
          outline: none;
          resize: vertical;
          transition: border-color var(--transition-fast);
        }

        .main-textarea:focus {
          border-color: var(--accent-primary);
        }

        .example-starters-bar {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .starters-label {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .starters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .starter-pill {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .starter-pill:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .card-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-input);
        }

        .meta-counts {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .count-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .action-button-wrapper {
          display: flex;
          align-items: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-sparkle {
          color: var(--accent-primary);
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .empty-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .empty-sub {
          font-size: 0.8rem;
          max-width: 340px;
          line-height: 1.45;
        }

        .code-display {
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #E5E7EB;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 380px;
          overflow-y: auto;
        }

        .diff-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 380px;
          overflow-y: auto;
        }

        .diff-text {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: #D1D5DB;
          white-space: pre-wrap;
          word-break: break-word;
          margin-top: 0.2rem;
        }

        .view-mode-tabs {
          display: flex;
          background: var(--bg-input);
          padding: 2px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          font-size: 0.725rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .tab-btn.active {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .text-emerald { color: #34D399; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #FFF;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .persona-hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
