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
    <div className="workbench-container">
      {/* Left Pane: Raw Input */}
      <div className="pane raw-pane glass-card">
        <div className="pane-header">
          <div className="header-left">
            <Code size={18} className="text-indigo" />
            <h3 className="pane-title">1. Raw Input Prompt</h3>
          </div>
          {rawInput && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => onRawInputChange('')}
              title="Clear input"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="pane-body">
          <textarea
            className="raw-textarea"
            rows={10}
            value={rawInput}
            onChange={(e) => onRawInputChange(e.target.value)}
            placeholder={`Type your raw prompt idea here...\n\ne.g., "${selectedDomain.examples[0]}"`}
          />

          {/* Preset Example Starters */}
          <div className="examples-bar">
            <span className="examples-label">Try Example:</span>
            <div className="examples-list">
              {selectedDomain.examples.map((ex, idx) => (
                <button
                  key={idx}
                  className="example-pill"
                  onClick={() => onRawInputChange(ex)}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pane-footer">
          <div className="counter-group">
            <span className="count-tag">{rawInput.length} chars</span>
            <span className="count-tag">~{Math.ceil(rawInput.length / 4)} tokens</span>
          </div>

          <button
            className="btn btn-primary btn-enhance"
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

      {/* Right Pane: Enhanced Output */}
      <div className="pane output-pane glass-card">
        <div className="pane-header">
          <div className="header-left">
            <Zap size={18} className="text-emerald" />
            <h3 className="pane-title">2. Enhanced Engineered Prompt</h3>
          </div>

          {enhancedResult?.enhancedText && (
            <div className="view-toggle">
              <button
                className={`toggle-tab ${viewMode === 'formatted' ? 'active' : ''}`}
                onClick={() => setViewMode('formatted')}
              >
                <Eye size={13} />
                <span>Prompt View</span>
              </button>
              <button
                className={`toggle-tab ${viewMode === 'diff' ? 'active' : ''}`}
                onClick={() => setViewMode('diff')}
              >
                <Layers size={13} />
                <span>Diff Breakdown</span>
              </button>
            </div>
          )}
        </div>

        <div className="pane-body">
          {!enhancedResult?.enhancedText ? (
            <div className="output-placeholder">
              <Sparkles size={36} className="placeholder-icon" />
              <h4 className="placeholder-title">Ready to Engineer Your Prompt</h4>
              <p className="placeholder-desc">Type your idea on the left and click <strong>Enhance Prompt Now</strong> to generate a structured, persona-primed prompt.</p>
            </div>
          ) : (
            <div className="output-content animate-fade-in">
              {viewMode === 'formatted' ? (
                <div className="formatted-view">
                  <pre className="enhanced-code">{enhancedResult.enhancedText}</pre>
                </div>
              ) : (
                <div className="diff-view">
                  <div className="diff-intro">
                    <p>Below are the specific prompt engineering layers added by Prompt Like A Pro:</p>
                  </div>
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
          <div className="pane-footer output-footer">
            <div className="counter-group">
              <span className="badge badge-emerald">~{enhancedResult.tokenCount} Tokens</span>
              {enhancedResult.variables?.length > 0 && (
                <span className="badge badge-cyan">{enhancedResult.variables.length} Variables</span>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onSaveToHistory(enhancedResult)}
                title="Save to History"
              >
                <Star size={15} />
                <span>Save</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleExportMarkdown}
                title="Export as Markdown file"
              >
                <Download size={15} />
                <span>Export .md</span>
              </button>

              {enhancedResult.variables?.length > 0 ? (
                <button
                  className="btn btn-emerald btn-sm"
                  onClick={onOpenVariableModal}
                >
                  <Sliders size={15} />
                  <span>Fill Variables</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleCopyClick}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .workbench-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .pane {
          display: flex;
          flex-direction: column;
          min-height: 520px;
        }

        .pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pane-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pane-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          overflow-y: auto;
        }

        .raw-textarea {
          width: 100%;
          flex: 1;
          min-height: 280px;
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 1rem;
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 0.9rem;
          line-height: 1.5;
          outline: none;
          resize: vertical;
          transition: border-color var(--transition-fast);
        }

        .raw-textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }

        .examples-bar {
          margin-top: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .examples-label {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .examples-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .example-pill {
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

        .example-pill:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #818CF8;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .pane-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: rgba(11, 16, 26, 0.4);
        }

        .counter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .count-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .output-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }

        .placeholder-icon {
          color: var(--accent-primary);
          opacity: 0.4;
          margin-bottom: 0.85rem;
        }

        .placeholder-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.35rem;
        }

        .placeholder-desc {
          font-size: 0.825rem;
          max-width: 320px;
          line-height: 1.5;
        }

        .view-toggle {
          display: flex;
          background: var(--bg-input);
          padding: 2px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .toggle-tab {
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

        .toggle-tab.active {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .enhanced-code {
          background: var(--bg-input);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.825rem;
          line-height: 1.6;
          color: #E2E8F0;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 400px;
          overflow-y: auto;
        }

        .diff-view {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .diff-intro {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .diff-text {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: #CBD5E1;
          white-space: pre-wrap;
          word-break: break-word;
          margin-top: 0.2rem;
        }

        .action-buttons {
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

        @media (max-width: 960px) {
          .workbench-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
