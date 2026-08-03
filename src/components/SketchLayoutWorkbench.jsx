import React, { useState, useEffect, useRef } from 'react';
import { DOMAINS } from '../data/domains';
import { evaluatePromptStrength } from '../utils/enhancerEngine';
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
  Code,
  BookOpen,
  PenTool,
  Cpu,
  Layout,
  Server,
  ShieldCheck,
  Bug,
  Brain,
  FileText,
  MessageSquare,
  ChevronDown,
  ArrowUp,
  Award
} from 'lucide-react';

const ICON_MAP = {
  Layout,
  Server,
  ShieldCheck,
  Bug,
  Brain,
  BookOpen,
  FileText,
  PenTool,
  MessageSquare,
  Sparkles,
  Cpu
};

const CATEGORY_CONFIG = [
  { id: 'Coding', label: 'Coding', icon: Code },
  { id: 'Study', label: 'Academics', icon: BookOpen },
  { id: 'Writing', label: 'Writing', icon: PenTool },
  { id: 'Visuals', label: 'Visuals', icon: Sparkles },
  { id: 'AI Systems', label: 'Systems', icon: Cpu }
];

export default function SketchLayoutWorkbench({
  rawInput,
  onRawInputChange,
  enhancedResult,
  selectedDomain,
  onSelectDomain,
  onEnhance,
  isEnhancing,
  hasApiKey,
  onCopy,
  onOpenVariableModal,
  onSaveToHistory
}) {
  const [viewMode, setViewMode] = useState('formatted');
  const [copied, setCopied] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [strength, setStrength] = useState({ score: 0, level: 'Empty', feedback: '', checks: [] });
  const containerRef = useRef(null);

  useEffect(() => {
    const analysis = evaluatePromptStrength(rawInput);
    setStrength(analysis);
  }, [rawInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const toggleCategoryDropdown = (catId) => {
    setOpenCategory(openCategory === catId ? null : catId);
  };

  return (
    <div className="chatbot-workbench-flow" ref={containerRef}>

      {/* =========================================================================
         SECTION 1: TOP BOX — CHAT-STYLE PROMPT INPUT (Sketch Top Box)
         ========================================================================= */}
      <section className="chat-input-container">
        {/* PROMPT STRENGTH METER (Placed ABOVE the input box as requested) */}
        {rawInput.trim() && (
          <div className="strength-meter-container animate-fade-in">
            <div className="strength-header">
              <div className="strength-title-group">
                <Award size={14} className="strength-icon" />
                <span className="strength-label-text">
                  Prompt Quality: <strong>{strength.level}</strong> ({strength.score}/100)
                </span>
              </div>
              <span className="strength-feedback">{strength.feedback}</span>
            </div>
            
            <div className="strength-progress-bg">
              <div 
                className="strength-progress-bar" 
                style={{ 
                  width: `${strength.score}%`,
                  backgroundColor: strength.score >= 75 ? '#FAFAFA' : strength.score >= 40 ? '#A1A1AA' : '#52525B'
                }} 
              />
            </div>

            {strength?.checks?.length > 0 && (
              <div className="checks-list">
                {strength.checks.map((chk, idx) => (
                  <span key={idx} className="check-badge">✓ {chk}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="chat-input-wrapper">
          <textarea
            className="chat-textarea"
            rows={3}
            value={rawInput}
            onChange={(e) => onRawInputChange(e.target.value)}
            placeholder={`How can I help you prompt today? Ask anything...\n\nActive Scenario: ${selectedDomain.name}`}
          />

          <div className="chat-input-actions">
            <div className="left-helpers">
              <span className="char-counter">{rawInput.length} chars</span>
              {rawInput && (
                <button className="reset-btn" onClick={() => onRawInputChange('')} title="Reset">
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            <button
              className="send-enhance-btn"
              onClick={onEnhance}
              disabled={!rawInput.trim() || isEnhancing}
              title="Enhance Prompt Now"
            >
              {isEnhancing ? (
                <div className="chat-spinner" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Suggestion Starters Grid */}
        <div className="suggestions-deck-container">
          <span className="suggestions-deck-label">Suggestion starters:</span>
          <div className="suggestions-deck-grid">
            {selectedDomain.examples.map((ex, idx) => (
              <button
                key={idx}
                className="suggestion-deck-card"
                onClick={() => onRawInputChange(ex)}
              >
                <span className="suggestion-card-text">"{ex}"</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
         SECTION 2: MIDDLE — CATEGORIES & SUBCATEGORIES (Sketch Middle Row)
         ========================================================================= */}
      <section className="chat-categories-section">
        <div className="categories-header-row">
          <span className="categories-header-label">Scenario Blueprint:</span>
          <span className="categories-header-desc">Click a category card to open subcategories dropdown menu.</span>
        </div>

        <div className="categories-grid">
          {CATEGORY_CONFIG.map((cat) => {
            const CatIcon = cat.icon;
            const categoryDomains = DOMAINS.filter(d => d.category === cat.id);
            const isOpen = openCategory === cat.id;
            const hasSelectedChild = categoryDomains.some(d => d.id === selectedDomain.id);

            return (
              <div key={cat.id} className="category-suggestion-wrapper">
                <button
                  type="button"
                  className={`category-suggestion-btn ${hasSelectedChild ? 'active-parent' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryDropdown(cat.id);
                  }}
                >
                  <div className="btn-left-content">
                    <CatIcon size={14} className="cat-icon" />
                    <span className="cat-label">{cat.label}</span>
                  </div>
                  <ChevronDown size={13} className={`chevron-arrow ${isOpen ? 'rotated' : ''}`} />
                </button>

                {/* Subcategories Dropdown */}
                {isOpen && (
                  <div className="subcategory-popover-menu animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="popover-title">Scenario Blueprints:</div>
                    <div className="popover-list">
                      {categoryDomains.map((subDomain) => {
                        const SubIcon = ICON_MAP[subDomain.icon] || Sparkles;
                        const isSelected = selectedDomain.id === subDomain.id;

                        return (
                          <button
                            key={subDomain.id}
                            type="button"
                            className={`popover-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              onSelectDomain(subDomain);
                              setOpenCategory(null);
                            }}
                          >
                            <SubIcon size={14} className="sub-icon" />
                            <div className="sub-details">
                              <span className="sub-title">{subDomain.name}</span>
                              <span className="sub-desc">{subDomain.description}</span>
                            </div>
                            {isSelected && <Check size={14} className="check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
         SECTION 3: BOTTOM BOX — CHAT RESPONSE OUTPUT (Sketch Bottom Box)
         ========================================================================= */}
      {enhancedResult?.enhancedText && (
        <section className="chat-response-section glass-card animate-fade-in">
          <div className="response-header">
            <div className="header-left">
              <Zap size={16} className="zap-icon" />
              <span className="response-title">Engineered Output ({selectedDomain.name})</span>
            </div>

            <div className="view-mode-tabs">
              <button
                className={`tab-btn ${viewMode === 'formatted' ? 'active' : ''}`}
                onClick={() => setViewMode('formatted')}
              >
                <Eye size={13} />
                <span>Engineered Prompt</span>
              </button>
              <button
                className={`tab-btn ${viewMode === 'diff' ? 'active' : ''}`}
                onClick={() => setViewMode('diff')}
              >
                <Layers size={13} />
                <span>Diff Layers</span>
              </button>
            </div>
          </div>

          <div className="response-body">
            {viewMode === 'formatted' ? (
              <pre className="chatbot-code-display">{enhancedResult.enhancedText}</pre>
            ) : (
              <div className="diff-bubbles-list">
                {enhancedResult.additions?.map((item, idx) => (
                  <div key={idx} className="diff-added">
                    <span className="diff-tag">+{item.tag}</span>
                    <pre className="diff-text">{item.text}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="response-footer">
            <div className="footer-left-stats">
              <span className="badge badge-emerald">~{enhancedResult.tokenCount} Tokens</span>
              {enhancedResult.variables?.length > 0 && (
                <span className="badge badge-cyan">{enhancedResult.variables.length} Variables</span>
              )}
            </div>

            <div className="footer-right-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => onSaveToHistory(enhancedResult)}>
                <Star size={14} />
                <span>Save</span>
              </button>

              <button className="btn btn-secondary btn-sm" onClick={handleExportMarkdown}>
                <Download size={14} />
                <span>Export .md</span>
              </button>

              {enhancedResult.variables?.length > 0 ? (
                <button className="btn btn-emerald btn-sm" onClick={onOpenVariableModal}>
                  <Sliders size={14} />
                  <span>Fill Variables</span>
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={handleCopyClick}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .chatbot-workbench-flow {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Top Input Section */
        .chat-input-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chat-input-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 0.85rem 1rem 0.65rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: border-color var(--transition-fast);
        }

        .chat-input-wrapper:focus-within {
          border-color: #555;
        }

        .chat-textarea {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 0.925rem;
          line-height: 1.55;
          outline: none;
          resize: none;
        }

        .chat-input-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 0.5rem;
        }

        .left-helpers {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .char-counter {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .reset-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .reset-btn:hover {
          color: var(--text-primary);
        }

        .send-enhance-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-primary);
          border: none;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .send-enhance-btn:hover {
          background: var(--accent-primary-hover);
        }

        .send-enhance-btn:disabled {
          background: #2F2F2F;
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .chat-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #000;
          animation: spin 0.8s linear infinite;
        }

        /* Strength Meter CSS */
        .strength-meter-container {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .strength-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .strength-title-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .strength-icon {
          color: var(--text-secondary);
        }

        .strength-label-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .strength-feedback {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .strength-progress-bg {
          width: 100%;
          height: 2px;
          background: var(--bg-subtle);
          overflow: hidden;
        }

        .strength-progress-bar {
          height: 100%;
          transition: width 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s;
        }

        .checks-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .check-badge {
          font-size: 0.65rem;
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }

        /* Suggestion Starters Grid (ChatGPT-Style Suggestions) */
        .suggestions-deck-container {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.25rem;
        }

        .suggestions-deck-label {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .suggestions-deck-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 0.5rem;
        }

        .suggestion-deck-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          text-align: left;
          cursor: pointer;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }

        .suggestion-deck-card:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-medium);
        }

        .suggestion-card-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Categories Blueprint Section */
        .chat-categories-section {
          z-index: 50;
        }

        .categories-header-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .categories-header-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .categories-header-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.5rem;
        }

        .category-suggestion-wrapper {
          position: relative;
        }

        .category-suggestion-btn {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .category-suggestion-btn:hover {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .category-suggestion-btn.active-parent {
          border-color: var(--border-medium);
          color: var(--text-primary);
        }

        .btn-left-content {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .cat-icon {
          color: var(--text-muted);
        }

        .chevron-arrow {
          transition: transform var(--transition-fast);
        }

        .chevron-arrow.rotated {
          transform: rotate(180deg);
        }

        /* Subcategories Popover */
        .subcategory-popover-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 250px;
          z-index: 999;
          background: #202020;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.4rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .popover-title {
          font-size: 0.675rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          padding: 0.2rem 0.4rem;
        }

        .popover-list {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .popover-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background var(--transition-fast);
        }

        .popover-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .popover-item.selected {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }

        .sub-icon {
          margin-top: 2px;
          color: var(--text-muted);
        }

        .sub-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sub-title {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .sub-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Bottom Response Section */
        .chat-response-section {
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
        }

        .response-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .response-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .view-mode-tabs {
          display: flex;
          background: var(--bg-dark);
          padding: 2px;
          border-radius: var(--radius-sm);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.3;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          font-size: 0.725rem;
          font-weight: 500;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .tab-btn.active {
          background: var(--bg-surface);
          color: var(--text-primary);
        }

        .response-body {
          padding: 1.25rem;
        }

        .chatbot-code-display {
          background: var(--bg-dark);
          padding: 1rem;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 350px;
          overflow-y: auto;
          border: 1px solid var(--border-subtle);
        }

        .diff-bubbles-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 350px;
          overflow-y: auto;
        }

        .diff-text {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .response-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-dark);
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .footer-left-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-right-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .zap-icon {
          color: #FFD700;
          margin-right: 0.25rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: 1fr;
          }
          .subcategory-popover-menu {
            position: relative;
            top: 0;
            margin-top: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}
