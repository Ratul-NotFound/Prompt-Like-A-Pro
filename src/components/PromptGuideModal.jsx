import React, { useState } from 'react';
import { 
  BookOpen, X, Sparkles, Brain, ShieldAlert, FileText,
  CheckCircle2, Copy, Check, Code, PenTool, Search, Zap,
  Award, Heart, Briefcase, Globe, Palette, Calendar,
  TrendingUp, MessageSquare, Bot, Video
} from 'lucide-react';

export default function PromptGuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('frameworks');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = [
    { id: 'frameworks', label: '🧠 Frameworks',      icon: Brain },
    { id: 'tactics',    label: '⚡ Advanced Tactics', icon: Zap },
    { id: 'domains',    label: '🛠️ Domain Cheat Sheets', icon: Code },
    { id: 'matrix',     label: '📊 Do\'s vs Don\'ts',  icon: Award }
  ];

  const FRAMEWORK_GUIDES = [
    {
      title: '1. Role & Persona Priming',
      tag: 'Identity',
      icon: <Brain size={18} color="#818CF8" />,
      desc: 'Assigning a specific expert persona forces the LLM into its most specialized training distribution. "Senior" and domain-specific titles unlock deeper, more rigorous outputs.',
      weak: 'Fix my authentication bug.',
      strong: 'Act as a Senior Node.js Security Architect & OWASP Specialist. Diagnose this auth endpoint for timing attacks and JWT misuse. Provide a production-safe patch with explanation.',
      tip: 'Pro Tip: Add experience tier (Staff, Principal, Lead) — the AI calibrates rigor accordingly.'
    },
    {
      title: '2. CO-STAR Framework',
      tag: 'Structure',
      icon: <Sparkles size={18} color="#C084FC" />,
      desc: 'CO-STAR covers all 6 dimensions: Context, Objective, Style, Tone, Audience, Response format. Missing even one causes vague, generic responses.',
      weak: 'Write a promotional email for my SaaS.',
      strong: 'Context: B2B dev-tool SaaS launch. Objective: Convert free-trial users to paid. Tone: Authoritative & technical. Audience: Senior Engineering Managers. Format: Subject + 3 bullet benefit lines + single CTA. No filler.',
      tip: 'Pro Tip: Use the CO-STAR Tuner bar in the workbench — it fills these automatically!'
    },
    {
      title: '3. Negative Constraints (Guardrails)',
      tag: 'Quality',
      icon: <ShieldAlert size={18} color="#FB7185" />,
      desc: 'LLMs default to polite filler and empty placeholders unless explicitly blocked. Negative constraints are your safety net against generic outputs.',
      weak: 'Write a blog post about AI tools.',
      strong: 'Write a 900-word article on AI tools for developers. Constraints: No "In today\'s world" openers. No clichés. No placeholder sections. No "in conclusion." Start with a bold claim. End with an action step.',
      tip: 'Pro Tip: Pair every "do this" with a "never do this" for best results.'
    },
    {
      title: '4. Chain-of-Thought (CoT) Reasoning',
      tag: 'Logic & Math',
      icon: <FileText size={18} color="#34D399" />,
      desc: 'Instructing the model to reason step-by-step before answering dramatically reduces hallucinations in multi-step logic, code, math, and architecture tasks.',
      weak: 'Calculate the right DB connection pool for 10k QPS.',
      strong: 'Before giving the final config, reason step-by-step through: connections per thread, memory per connection, max server RAM, and headroom. Show working under a "### Reasoning" section, then output the final config.',
      tip: 'Pro Tip: Toggle Chain-of-Thought in the workbench Parameters panel!'
    },
    {
      title: '5. Goal-First Intent Priming',
      tag: 'Intent',
      icon: <TrendingUp size={18} color="#F59E0B" />,
      desc: 'State the END GOAL before the task. When the AI understands why you need something, it makes smarter choices about how to deliver it.',
      weak: 'Summarize this article.',
      strong: 'My goal: Create a 3-minute presentation on this topic for non-technical executives who need to make a budget decision. Summarize this article focusing on business impact, cost implications, and risk — not technical details.',
      tip: 'Pro Tip: Start your prompt with "My goal is..." or "The end result I need is..." — it changes everything.'
    },
    {
      title: '6. Output Format Anchoring',
      tag: 'Format',
      icon: <Code size={18} color="#38BDF8" />,
      desc: 'Define exactly what the output should look like — structure, length, format, and depth. Unspecified format = whatever the model feels like returning.',
      weak: 'Give me a marketing plan.',
      strong: 'Output a structured 30-day marketing plan in this exact format: [Week N] → [Channel] → [Action] → [KPI Target]. Cover 4 channels. No prose paragraphs — table format only. Include budget allocation column.',
      tip: 'Pro Tip: Copy-paste a desired format or JSON schema directly into the prompt for strict compliance.'
    }
  ];

  const ADVANCED_TACTICS = [
    {
      title: '🔧 Variable Injection  {{variable}}',
      desc: 'Create reusable template prompts with dynamic placeholders. Use double curly braces to mark fields you\'ll swap per-request. Our workbench auto-detects these and lets you fill them in.',
      code: 'Act as a Senior {{language}} Engineer specializing in {{framework}}.\nRefactor this {{component_type}} to handle {{error_type}} errors cleanly.\nTarget: {{audience_level}} developers. Format: before/after comparison.'
    },
    {
      title: '📸 Few-Shot Exemplars (Show, Don\'t Tell)',
      desc: 'Give the model 1–2 concrete input → output examples inside the prompt. This pattern-locks the AI into producing the exact structure you need, every time.',
      code: 'Transform job descriptions into optimized bullet points.\n\nExample:\nInput: "Responsible for building features"\nOutput: "Engineered 12+ production features in React/Node.js, reducing load time by 40%"\n\nNow transform: "{{raw_bullet}}"'
    },
    {
      title: '📐 Format Enforcers & JSON Schemas',
      desc: 'For structured or API-ready outputs, paste the exact schema you need. The model treats it as a contract and conforms precisely.',
      code: 'Return ONLY valid JSON matching this schema. No prose:\n{\n  "severity": "CRITICAL|HIGH|MEDIUM|LOW",\n  "vulnerability": "string",\n  "affected_line": number,\n  "fix": "string",\n  "owasp_ref": "string"\n}'
    },
    {
      title: '🎭 Perspective Flipping',
      desc: 'Ask the AI to argue against itself, play devil\'s advocate, or analyze from multiple stakeholder viewpoints. Forces more balanced and rigorous outputs.',
      code: 'You are a skeptical senior engineer reviewing this architecture proposal.\nFirst, identify its 3 biggest weaknesses and failure modes.\nThen, as the original architect, defend each point.\nFinally, give your neutral verdict as a third-party consultant.'
    },
    {
      title: '🔁 Iterative Refinement Loop',
      desc: 'Build multi-step prompt chains where each output feeds the next. Tell the AI exactly what "done" looks like before starting.',
      code: 'Step 1: Draft a raw outline for {{topic}}. Label it [DRAFT].\nStep 2: Critique it as a harsh editor. Label issues [ISSUE].\nStep 3: Rewrite addressing every [ISSUE]. Label it [FINAL].\nOutput all 3 steps in sequence. Do not skip steps.'
    },
    {
      title: '🧪 Hallucination Guard',
      desc: 'Explicitly instruct the AI to signal when it\'s uncertain rather than confidently fabricating information. Critical for factual, medical, or legal content.',
      code: 'Answer only from your verified knowledge.\nIf you are uncertain about any fact, write [UNCERTAIN: explain why].\nIf you don\'t know, write [UNKNOWN] — never guess or fabricate.\nAfter your response, list all [UNCERTAIN] items separately.'
    }
  ];

  const DOMAIN_CHEATSHEET = [
    {
      domain: '💻 Coding & Engineering',
      icon: <Code size={16} color="#388BFD" />,
      color: '#388BFD',
      bullets: [
        'Specify language + version exactly (Python 3.11, React 18, Node.js 20 LTS).',
        'Ban "// TODO implement later" — demand fully working code only.',
        'Ask for explicit error handling, input sanitization, and edge case coverage.',
        'Request "explain each step with inline comments" for learning-mode output.',
        'For debugging: "trace the exact failure path before writing any fix."'
      ]
    },
    {
      domain: '📚 Study & Learning',
      icon: <BookOpen size={16} color="#34D399" />,
      color: '#34D399',
      bullets: [
        'Use "Feynman method" — ask for plain-language explanations with a strong analogy.',
        'Request active-recall quiz questions (not just summaries) for real retention.',
        'Specify your current level: "Explain as if I understand X but not Y."',
        'Ask for "the 3 most common misconceptions beginners have about this topic."',
        'For roadmaps: give your goal, time budget, and current skill level.'
      ]
    },
    {
      domain: '✍️ Writing & Content',
      icon: <PenTool size={16} color="#F59E0B" />,
      color: '#F59E0B',
      bullets: [
        'Ban AI clichés upfront: "In today\'s world...", "Dive into...", "In conclusion..."',
        'Provide target audience\'s role, pain, and desired outcome — not just demographics.',
        'Specify exact word count and structural requirements (H2 headers, bullet ratio).',
        'For SEO: name the primary + 2 secondary keywords explicitly.',
        'For emotional content: "Match the tone of [reference piece] — link or describe it."'
      ]
    },
    {
      domain: '💼 Business & Career',
      icon: <Briefcase size={16} color="#C084FC" />,
      color: '#C084FC',
      bullets: [
        'For interview prep: specify role, company stage, and interviewer type (HR vs tech lead).',
        'For negotiations: always include your BATNA (Best Alternative To Negotiated Agreement).',
        'For proposals: lead with the decision-maker\'s concern, not your solution.',
        'For product specs: use the "As a [user], I want [goal], so that [outcome]" format.',
        'For financial analysis: state which framework (DCF, SWOT, Porter\'s 5) to apply.'
      ]
    },
    {
      domain: '🌅 Daily Life & Productivity',
      icon: <Heart size={16} color="#FB7185" />,
      color: '#FB7185',
      bullets: [
        'For health plans: include current fitness level, equipment available, and time budget.',
        'For travel: specify budget tier, travel style (luxury/backpacker), and must-haves.',
        'For meal planning: list dietary restrictions, cooking skill level, and prep time limit.',
        'For decision-making: name the top 3 factors you care most about — weight them.',
        'For journaling: specify current mood or challenge for context-aware prompts.'
      ]
    },
    {
      domain: '🎨 Creative & Visuals',
      icon: <Palette size={16} color="#EC4899" />,
      color: '#EC4899',
      bullets: [
        'Image prompts: Subject + lighting type + camera lens (85mm f/1.4) + mood + flags (--ar 16:9).',
        'Never use contradictory descriptors (e.g. "blurry sharp photo").',
        'For video scripts: specify platform, video length, and target retention hook type.',
        'For brand design: describe 3 brands you admire and 2 you want to avoid — explain why.',
        'For creative fiction: give character motivation, world rules, and the emotional core.'
      ]
    },
    {
      domain: '🤖 AI Systems & Agents',
      icon: <Bot size={16} color="#818CF8" />,
      color: '#818CF8',
      bullets: [
        'System prompts: always define identity, scope of knowledge, and hard refusal boundaries.',
        'For function calling: specify exact parameter types, optional vs required, and error returns.',
        'For RAG prompts: add a "cite your source" constraint and hallucination guard clause.',
        'For chatbot personas: define tone variations (formal vs frustrated user scenarios).',
        'Always test with adversarial inputs: "Ignore previous instructions and..." — seal the gaps.'
      ]
    },
    {
      domain: '🌍 Language & Translation',
      icon: <Globe size={16} color="#22D3EE" />,
      color: '#22D3EE',
      bullets: [
        'Specify formality level (casual, professional, academic, slang) for translations.',
        'Request pronunciation guides for spoken language learning (IPA or phonetic).',
        'For grammar lessons: ask for "rule + 3 examples + 1 common mistake" format.',
        'Specify dialect where relevant (Brazilian vs European Portuguese, Mexican vs Castilian).',
        'For vocabulary drills: include context sentence, opposite word, and memory anchor.'
      ]
    }
  ];

  const MATRIX = [
    { doText: 'Assign a precise, domain-specific expert persona with tier (Senior, Principal)', dontText: 'Write "you are a helpful assistant" or skip persona entirely' },
    { doText: 'State your END GOAL before the task — why do you need this output?', dontText: 'Just state what to do without context — the AI can\'t infer your real need' },
    { doText: 'Specify exact output format: JSON schema, markdown table, word count, headers', dontText: 'Leave format unspecified and accept whatever the model defaults to' },
    { doText: 'Add hard negative guardrails: "Never...", "Avoid...", "Do not include..."', dontText: 'Trust the model to omit fluff and placeholders without being told' },
    { doText: 'Use step-by-step Chain-of-Thought for logic, math, architecture, and code', dontText: 'Expect correct multi-step reasoning in a single unconstrained shot' },
    { doText: 'Use {{variables}} for reusable, customizable prompt templates', dontText: 'Hardcode specific values into prompts you plan to use repeatedly' },
    { doText: 'Give 1–2 concrete examples of ideal input → output (few-shot)', dontText: 'Only describe what you want in abstract terms without showing it' },
    { doText: 'For uncertain domains, add hallucination guards: "[UNCERTAIN]" / "only verified facts"', dontText: 'Accept confident-sounding answers on factual or medical topics without verification' },
    { doText: 'Iterate: generate → critique → refine in the same or follow-up prompt', dontText: 'Accept the first output as final — first drafts are always improvable' },
    { doText: 'Specify your audience explicitly — who reads this output, and what do they need?', dontText: 'Assume the AI knows who your reader is without being told' }
  ];

  const handleCopyExample = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const filteredFrameworks = FRAMEWORK_GUIDES.filter(g =>
    searchQuery === '' ||
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDomains = DOMAIN_CHEATSHEET.filter(d =>
    searchQuery === '' ||
    d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Prompt Engineering Playbook">
      <div className="modal-content glass-card animate-fade-in guide-modal">

        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <BookOpen size={20} className="modal-icon-indigo" aria-hidden="true" />
            <div>
              <h2 className="modal-title">Prompt Engineering Playbook</h2>
              <p className="modal-subtitle">Master the art of getting the best from any AI model</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close guide">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="guide-stats-bar">
          <span className="stat-pill">6 Frameworks</span>
          <span className="stat-pill">6 Tactics</span>
          <span className="stat-pill">8 Domain Guides</span>
          <span className="stat-pill">10 Rules</span>
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
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  aria-pressed={activeTab === tab.id}
                >
                  <TabIcon size={13} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {(activeTab === 'frameworks' || activeTab === 'domains') && (
            <div className="guide-search-wrapper">
              <Search size={13} className="search-icon" aria-hidden="true" />
              <input
                type="search"
                className="guide-search-input"
                placeholder={activeTab === 'frameworks' ? 'Search frameworks…' : 'Search domains…'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search guide content"
              />
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="modal-body guide-body">

          {/* TAB 1: CORE FRAMEWORKS */}
          {activeTab === 'frameworks' && (
            <div className="guide-cards">
              {filteredFrameworks.length === 0 && (
                <p className="guide-empty">No frameworks match "{searchQuery}"</p>
              )}
              {filteredFrameworks.map((item, idx) => (
                <div key={idx} className="guide-card">
                  <div className="card-header">
                    <div className="title-left">
                      {item.icon}
                      <h3 className="guide-card-title">{item.title}</h3>
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
                          aria-label="Copy engineered prompt example"
                        >
                          {copiedIdx === idx ? <Check size={12} color="#10B981" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                          <span>{copiedIdx === idx ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="comp-text strong-text">{item.strong}</p>
                    </div>
                  </div>

                  <div className="pro-tip-bar">
                    <Sparkles size={12} className="tip-sparkle" aria-hidden="true" />
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
                  <h3 className="guide-card-title" style={{ marginBottom: '0.4rem' }}>{item.title}</h3>
                  <p className="guide-card-desc">{item.desc}</p>
                  <div className="code-example-block">
                    <pre className="guide-code">{item.code}</pre>
                    <button
                      className="btn-copy-mini copy-floating"
                      onClick={() => handleCopyExample(item.code, `tactic_${idx}`)}
                      aria-label="Copy tactic code example"
                    >
                      {copiedIdx === `tactic_${idx}` ? <Check size={12} color="#10B981" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DOMAIN CHEAT SHEETS */}
          {activeTab === 'domains' && (
            <div className="guide-cards">
              {filteredDomains.length === 0 && (
                <p className="guide-empty">No domain matches "{searchQuery}"</p>
              )}
              {filteredDomains.map((item, idx) => (
                <div key={idx} className="guide-card domain-card">
                  <div className="card-header">
                    <div className="title-left">
                      <div className="domain-icon-wrap" style={{ background: `${item.color}18`, borderColor: `${item.color}33` }}>
                        {item.icon}
                      </div>
                      <h3 className="guide-card-title">{item.domain}</h3>
                    </div>
                  </div>
                  <ul className="cheat-list" role="list">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="cheat-item">
                        <CheckCircle2 size={13} className="cheat-icon" aria-hidden="true" />
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
            <div>
              <p className="matrix-intro">10 rules that separate expert prompt engineers from casual users. Apply these and your outputs will improve immediately.</p>
              <div className="matrix-table-container">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th className="th-do">✅ Do This (Best Practice)</th>
                      <th className="th-dont">❌ Avoid This (Common Pitfall)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MATRIX.map((row, idx) => (
                      <tr key={idx}>
                        <td className="td-do">
                          <CheckCircle2 size={14} className="do-icon" aria-hidden="true" />
                          <span>{row.doText}</span>
                        </td>
                        <td className="td-dont">
                          <X size={14} className="dont-icon" aria-hidden="true" />
                          <span>{row.dontText}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-actions guide-footer">
          <button className="btn btn-emerald" onClick={onClose} style={{ width: '100%' }} aria-label="Close and return to workbench">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Apply Knowledge & Back to Workbench</span>
          </button>
        </div>
      </div>

      <style>{`
        .guide-modal {
          max-width: 740px;
          width: 95vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .modal-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 0.1rem;
        }

        /* Stats bar */
        .guide-stats-bar {
          display: flex;
          gap: 0.4rem;
          padding: 0.5rem 1.25rem;
          background: var(--bg-dark);
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }

        .stat-pill {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 99px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          color: #818CF8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
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
          scrollbar-width: none;
        }
        .guide-tabs-bar::-webkit-scrollbar { display: none; }

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

        .guide-tab-btn:hover { color: var(--text-primary); border-color: var(--border-medium); }
        .guide-tab-btn.active {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.35);
          color: #818CF8;
        }
        .guide-tab-btn:focus-visible { outline: 2px solid #818CF8; outline-offset: 2px; }

        .guide-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon { position: absolute; left: 0.65rem; color: var(--text-muted); }

        .guide-search-input {
          width: 100%;
          padding: 0.4rem 0.65rem 0.4rem 2rem;
          font-size: 0.775rem;
          border-radius: var(--radius-sm);
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          outline: none;
          transition: border-color 180ms ease;
        }
        .guide-search-input:focus { border-color: var(--border-medium); }

        .guide-body {
          overflow-y: auto;
          flex: 1;
          padding: 1.25rem;
        }

        .guide-empty {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-align: center;
          padding: 2rem 0;
        }

        .guide-cards { display: flex; flex-direction: column; gap: 1.15rem; }

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

        .title-left { display: flex; align-items: center; gap: 0.5rem; }

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
          flex-shrink: 0;
        }

        .guide-card-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        /* Domain card icon */
        .domain-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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

        .comp-weak  { background: rgba(248,81,73,0.05); border-color: rgba(248,81,73,0.2); }
        .comp-strong { background: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.25); }

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

        .strong-text { color: var(--text-primary); font-weight: 500; }

        .btn-copy-mini {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.7rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 150ms;
        }
        .btn-copy-mini:hover { color: var(--text-primary); }
        .btn-copy-mini:focus-visible { outline: 2px solid #818CF8; outline-offset: 2px; border-radius: 3px; }

        .pro-tip-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-style: italic;
          padding-top: 0.2rem;
        }
        .tip-sparkle { color: #F59E0B; }

        /* Code example block */
        .code-example-block { position: relative; }

        .guide-code {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.775rem;
          color: #A7F3D0;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.55;
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
        .cheat-list { display: flex; flex-direction: column; gap: 0.45rem; list-style: none; padding: 0; }

        .cheat-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.785rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .cheat-icon { color: #10B981; margin-top: 2px; flex-shrink: 0; }

        /* Matrix */
        .matrix-intro {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

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

        .th-do  { color: #10B981; }
        .th-dont { color: #F85149; }

        .matrix-table td {
          padding: 0.75rem 0.9rem;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: top;
          line-height: 1.45;
        }

        .td-do   { color: var(--text-primary);   background: rgba(16,185,129,0.02); }
        .td-dont { color: var(--text-secondary);  background: rgba(248,81,73,0.02); }

        .do-icon   { color: #10B981; margin-right: 0.35rem; display: inline-block; vertical-align: middle; flex-shrink: 0; }
        .dont-icon { color: #F85149; margin-right: 0.35rem; display: inline-block; vertical-align: middle; flex-shrink: 0; }

        .guide-footer {
          padding: 0.85rem 1.25rem;
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 640px) {
          .guide-tabs-bar { flex-wrap: wrap; }
          .comp-header { flex-direction: column; align-items: flex-start; gap: 0.25rem; }
          .guide-stats-bar { gap: 0.3rem; }
          .stat-pill { font-size: 0.6rem; }
          .matrix-table { font-size: 0.72rem; }
          .matrix-table td, .matrix-table th { padding: 0.6rem 0.65rem; }
        }
      `}</style>
    </div>
  );
}
