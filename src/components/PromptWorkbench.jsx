import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  RotateCcw, 
  Eye, 
  Layers, 
  Check, 
  Code, 
  Zap,
  Star,
  Sliders
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
      {/* Middle Section: Raw Prompt Input Box */}
      <div className="workbench-card raw-card glass-card">
        <div className="card-header-bar">
          <div className="header-left">
            <Code size={18} className="text-indigo" />
            <h3 className="card-title">Prompt Input Field</h3>
          </div>
          {rawInput && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => onRawInputChange('')}
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="card-body-area">
          <textarea
            className="main-textarea"
            rows={5}
            value={rawInput}
            onChange={(e) => onRawInputChange(e.target.value)}
            placeholder={`Type your raw prompt idea here...\n\ne.g., "${selectedDomain.examples[0]}"`}
          />

          {/* Example Pills */}
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

          <button
            className="btn btn-primary btn-enhance-main"
            onClick={onEnhance}
            disabled={!rawInput.trim() || isEnhancing}
          >
            {isEnhancing ? (
              <>
                <div className="spinner" />
                <span>Enhancing with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>{hasApiKey ? 'Enhance with Gemini AI' : 'Enhance Prompt Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Section: Enhanced Output View */}
      <div className="workbench-card output-card glass-card">
        <div className="card-header-bar">
          <div className="header-left">
            <Zap size={18} className="text-emerald" />
            <h3 className="card-title">Enhanced Prompt Output</h3>
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
              <Sparkles size={36} className="empty-sparkle" />
              <h4 className="empty-heading">Ready to Engineer Your Prompt</h4>
              <p className="empty-sub">Type your idea above, select a category subcategory, and click <strong>Enhance Prompt Now</strong>.</p>
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
          gap: 1.5rem;
        }

        .workbench-card {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-body-area {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .main-textarea {
          width: 100%;
          min-height: 140px;
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 1rem;
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 0.925rem;
          line-height: 1.5;
          outline: none;
          resize: vertical;
          transition: border-color var(--transition-fast);
        }

        .main-textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }

        .example-starters-bar {
          margin-top: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .starters-label {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .starters-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .starter-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .starter-pill:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #818CF8;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .card-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: rgba(11, 16, 26, 0.4);
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-sparkle {
          color: var(--accent-primary);
          opacity: 0.4;
          margin-bottom: 0.75rem;
        }

        .empty-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .empty-sub {
          font-size: 0.825rem;
          max-width: 340px;
          line-height: 1.45;
        }

        .code-display {
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #E2E8F0;
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
          color: #CBD5E1;
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
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.725rem;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .tab-btn.active {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .text-indigo { color: #818CF8; }
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
      `}</style>
    </div>
  );
}
