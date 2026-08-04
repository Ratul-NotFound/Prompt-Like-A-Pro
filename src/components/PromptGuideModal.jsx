import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  Brain, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Code, 
  PenTool, 
  Search, 
  Zap,
  Sliders,
  HelpCircle,
  Award
} from 'lucide-react';

export default function PromptGuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('frameworks');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = [
    { id: 'frameworks', label: '🧠 Core Frameworks', icon: Brain },
    { id: 'tactics', label: '⚡ Advanced Tactics', icon: Zap },
    { id: 'domains', label: '🛠️ Domain Cheat Sheets', icon: Code },
    { id: 'matrix', label: '📊 Do\'s vs. Don\'ts', icon: Award }
  ];

  const FRAMEWORK_GUIDES = [
    {
      title: '1. Role & Persona Priming',
      tag: 'Identity',
      icon: <Brain size={18} color="#818CF8" />,
      desc: 'Assigning a specific persona (e.g., "Act as a Lead Security Auditor...") forces the LLM to access its most specialized expert training distribution.',
      weak: 'Fix this authentication code bug.',
      strong: 'Act as a Senior Node.js Security Architect & OWASP Specialist. Analyze this authentication endpoint, identify potential timing attacks, and provide a patch.',
      tip: 'Pro Tip: Specify experience tier (e.g. "Staff Engineer") for higher rigor.'
    },
    {
      title: '2. The CO-STAR Framework',
      tag: 'Structure',
      icon: <Sparkles size={18} color="#C084FC" />,
      desc: 'CO-STAR ensures 6 key dimensions: Context, Objective, Style, Tone, Audience, and Response Format. Missing dimensions cause generic AI fluff.',
      weak: 'Write a promotional email for my SaaS product.',
      strong: 'Context: Launching a dev-tool SaaS. Objective: Convert free trials to paid. Tone: Persuasive & technical. Audience: Senior CTOs. Format: Markdown email with bullet points.',
      tip: 'Pro Tip: Use the CO-STAR Tuner bar in our workbench to adjust these automatically!'
    },
    {
      title: '3. Negative Constraints (Guardrails)',
      tag: 'Quality Control',
      icon: <ShieldAlert size={18} color="#FB7185" />,
      desc: 'LLMs naturally default to polite filler and unwritten placeholders. Explicit negative constraints eliminate conversational fluff.',
      weak: 'Build a React dashboard component.',
      strong: 'Build a React dashboard card. Constraints: Do not use inline styles or generic colors. Do not leave placeholder comments like // TODO. Output runnable code.',
      tip: 'Pro Tip: Always state what NOT to do alongside what to do.'
    },
    {
      title: '4. Chain-of-Thought (CoT) Reasoning',
      tag: 'Logic & Math',
      icon: <FileText size={18} color="#34D399" />,
      desc: 'Instructing the model to think step-by-step before answering reduces hallucinations in logic, math, and code compilation.',
      weak: 'Calculate database connection pool size for 10k QPS.',
      strong: 'Before outputting the final config, break down the step-by-step math for memory allocation per connection thread under a "### 💡 Reasoning" header.',
      tip: 'Pro Tip: Toggle the CoT Reasoning switch in the Workbench parameters!'
    }
  ];

  const ADVANCED_TACTICS = [
    {
      title: 'Variable Injection ({{variable}})',
      desc: 'Use double curly braces `{{variable_name}}` to create dynamic template placeholders that can be replaced interactively.',
      code: 'Act as a Senior {{language}} Engineer. Refactor this {{framework}} function to handle {{error_type}} errors cleanly.'
    },
    {
      title: 'Few-Shot Exemplars',
      desc: 'Provide 1 or 2 concrete input-output examples inside your prompt to lock the LLM into an exact response pattern.',
      code: 'Example 1:\nInput: "bug in auth"\nOutput: "DEBUG: Authentication Vulnerability Audit"\n\nNow process: "{{user_input}}"'
    },
    {
      title: 'Format Enforcers & Schemas',
      desc: 'Specify JSON, Markdown Table, or TypeScript Interface requirements to enforce deterministic API-ready outputs.',
      code: 'Return your final answer strictly as valid JSON matching this schema:\n{\n  "severity": "HIGH",\n  "fix": "string"\n}'
    }
  ];

  const DOMAIN_CHEATSHEET = [
    {
      domain: 'Software & Code Engineering',
      icon: <Code size={16} color="#388BFD" />,
      bullets: [
        'Specify programming language version (e.g. React 18, Python 3.11).',
        'Request explicit unit tests or error-handling blocks.',
        'Prohibit placeholder functions (`// TODO implement later`).'
      ]
    },
    {
      domain: 'Academics & Feynman Method',
      icon: <BookOpen size={16} color="#34D399" />,
      bullets: [
        'Ask for plain-language breakdowns with real-world analogies.',
        'Request active-recall quiz questions to test your own understanding.',
        'Ask for the top 3 common misconceptions students make.'
      ]
    },
    {
      domain: 'SEO & Content Copywriting',
      icon: <PenTool size={16} color="#F59E0B" />,
      bullets: [
        'Provide target primary and secondary keywords.',
        'Ban cliché AI openers ("In today\'s fast-paced digital world...").',
        'Request H2/H3 header hierarchy and a compelling call-to-action.'
      ]
    },
    {
      domain: 'AI Image Generators (Midjourney / Flux)',
      icon: <Sparkles size={16} color="#EC4899" />,
      bullets: [
        'Detail subject + lighting (volumetric, studio) + camera lens (85mm f/1.4).',
        'Append model flags at the end (`--ar 16:9 --v 6.0 --style raw`).',
        'Avoid contradictory terms (e.g. "blurry sharp focus").'
      ]
    }
  ];

  const MATRIX = [
    { doText: 'Assign a domain-specific expert persona', dontText: 'Ask vague, open questions without a role' },
    { doText: 'Specify exact output format (JSON, Table, Markdown)', dontText: 'Leave output format up to model defaults' },
    { doText: 'Add negative guardrails against fluff & placeholders', dontText: 'Allow conversational filler & "// TODO" code' },
    { doText: 'Use step-by-step Chain-of-Thought for math & logic', dontText: 'Expect complex multi-step reasoning in one shot' },
    { doText: 'Inject dynamic {{variables}} for reusable templates', dontText: 'Hardcode static values into reusable prompts' }
  ];

  const handleCopyExample = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const filteredFrameworks = FRAMEWORK_GUIDES.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in guide-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <BookOpen size={20} className="modal-icon-indigo" />
            <h3 className="modal-title">Prompt Engineering Playbook</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector & Search */}
        <div className="guide-toolbar">
          <div className="guide-tabs-bar">
            {TABS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`guide-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'frameworks' && (
            <div className="guide-search-wrapper">
              <Search size={13} className="search-icon" />
              <input
                type="text"
                className="guide-search-input"
                placeholder="Filter frameworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="modal-body guide-body">
          {/* TAB 1: CORE FRAMEWORKS */}
          {activeTab === 'frameworks' && (
            <div className="guide-cards">
              {filteredFrameworks.map((item, idx) => (
                <div key={idx} className="guide-card">
                  <div className="card-header">
                    <div className="title-left">
                      {item.icon}
                      <h4 className="guide-card-title">{item.title}</h4>
                    </div>
                    <span className="card-tag">{item.tag}</span>
                  </div>

                  <p className="guide-card-desc">{item.desc}</p>

                  <div className="comparison-box">
                    <div className="comp-item comp-weak">
                      <span className="comp-label weak-label">❌ Weak Prompt</span>
                      <p className="comp-text">{item.weak}</p>
                    </div>

                    <div className="comp-item comp-strong">
                      <div className="comp-header">
                        <span className="comp-label strong-label">✅ Engineered Prompt</span>
                        <button
                          className="btn-copy-mini"
                          onClick={() => handleCopyExample(item.strong, idx)}
                          title="Copy example"
                        >
                          {copiedIdx === idx ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="comp-text strong-text">{item.strong}</p>
                    </div>
                  </div>

                  <div className="pro-tip-bar">
                    <Sparkles size={12} className="tip-sparkle" />
                    <span>{item.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ADVANCED TACTICS */}
          {activeTab === 'tactics' && (
            <div className="guide-cards">
              {ADVANCED_TACTICS.map((item, idx) => (
                <div key={idx} className="guide-card">
                  <h4 className="guide-card-title" style={{ marginBottom: '0.4rem' }}>{item.title}</h4>
                  <p className="guide-card-desc">{item.desc}</p>
                  <div className="code-example-block">
                    <pre className="guide-code">{item.code}</pre>
                    <button
                      className="btn-copy-mini copy-floating"
                      onClick={() => handleCopyExample(item.code, `tactic_${idx}`)}
                    >
                      {copiedIdx === `tactic_${idx}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DOMAIN CHEAT SHEETS */}
          {activeTab === 'domains' && (
            <div className="guide-cards">
              {DOMAIN_CHEATSHEET.map((item, idx) => (
                <div key={idx} className="guide-card">
                  <div className="card-header">
                    {item.icon}
                    <h4 className="guide-card-title">{item.domain}</h4>
                  </div>
                  <ul className="cheat-list">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="cheat-item">
                        <CheckCircle2 size={13} className="cheat-icon" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: DO'S VS DON'TS MATRIX */}
          {activeTab === 'matrix' && (
            <div className="matrix-table-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th className="th-do">✅ What To Do (Best Practice)</th>
                    <th className="th-dont">❌ What To Avoid (Common Pitfall)</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row, idx) => (
                    <tr key={idx}>
                      <td className="td-do">
                        <CheckCircle2 size={14} className="do-icon" />
                        <span>{row.doText}</span>
                      </td>
                      <td className="td-dont">
                        <X size={14} className="dont-icon" />
                        <span>{row.dontText}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-actions guide-footer">
          <button className="btn btn-emerald" onClick={onClose} style={{ width: '100%' }}>
            <CheckCircle2 size={16} />
            <span>Apply Knowledge & Back to Workbench</span>
          </button>
        </div>
      </div>

      <style>{`
        .guide-modal {
          max-width: 720px;
          width: 95vw;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
        }

        .guide-toolbar {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .guide-tabs-bar {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.2rem;
        }

        .guide-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.775rem;
          font-weight: 600;
          border: 1px solid var(--border-subtle);
          background: var(--bg-input);
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 180ms ease;
        }

        .guide-tab-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .guide-tab-btn.active {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.35);
          color: #818CF8;
        }

        .guide-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.65rem;
          color: var(--text-muted);
        }

        .guide-search-input {
          width: 100%;
          padding: 0.4rem 0.65rem 0.4rem 2rem;
          font-size: 0.775rem;
          border-radius: var(--radius-sm);
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          outline: none;
        }

        .guide-body {
          overflow-y: auto;
          flex: 1;
          padding: 1.25rem;
        }

        .guide-cards {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .guide-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .guide-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-tag {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .guide-card-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* Comparison Box */
        .comparison-box {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-top: 0.2rem;
        }

        .comp-item {
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .comp-weak {
          background: rgba(248, 81, 73, 0.05);
          border-color: rgba(248, 81, 73, 0.2);
        }

        .comp-strong {
          background: rgba(16, 185, 129, 0.06);
          border-color: rgba(16, 185, 129, 0.25);
        }

        .comp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .comp-label {
          font-size: 0.675rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .weak-label { color: #F85149; }
        .strong-label { color: #10B981; }

        .comp-text {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .strong-text {
          color: var(--text-primary);
          font-weight: 500;
        }

        .btn-copy-mini {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.7rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-copy-mini:hover {
          color: var(--text-primary);
        }

        .pro-tip-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.725rem;
          color: var(--text-muted);
          font-style: italic;
          padding-top: 0.2rem;
        }

        .tip-sparkle { color: #F59E0B; }

        /* Code example block */
        .code-example-block {
          position: relative;
        }

        .guide-code {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.9rem;
          font-family: var(--font-mono);
          font-size: 0.775rem;
          color: #A7F3D0;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.5;
        }

        .copy-floating {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--bg-subtle);
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
        }

        /* Cheat list */
        .cheat-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          list-style: none;
        }

        .cheat-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.785rem;
          color: var(--text-secondary);
        }

        .cheat-icon {
          color: #10B981;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* Do's vs Don'ts Matrix Table */
        .matrix-table-container {
          overflow-x: auto;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.785rem;
          text-align: left;
        }

        .matrix-table th {
          padding: 0.75rem 0.9rem;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .th-do { color: #10B981; }
        .th-dont { color: #F85149; }

        .matrix-table td {
          padding: 0.75rem 0.9rem;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: top;
        }

        .td-do {
          color: var(--text-primary);
          background: rgba(16, 185, 129, 0.02);
        }

        .td-dont {
          color: var(--text-secondary);
          background: rgba(248, 81, 73, 0.02);
        }

        .do-icon { color: #10B981; margin-right: 0.35rem; display: inline-block; vertical-align: middle; }
        .dont-icon { color: #F85149; margin-right: 0.35rem; display: inline-block; vertical-align: middle; }

        .guide-footer {
          padding: 0.85rem 1.25rem;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 640px) {
          .guide-tabs-bar {
            flex-wrap: wrap;
          }
          .comp-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
