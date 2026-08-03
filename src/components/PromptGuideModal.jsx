import React from 'react';
import { BookOpen, X, Sparkles, Brain, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function PromptGuideModal({ onClose }) {
  const GUIDES = [
    {
      title: '1. Role & Identity Priming',
      icon: <Brain size={18} color="#818CF8" />,
      desc: 'Assigning a specific persona (e.g., "Act as a Principal Security Architect...") conditions the LLM to pull parameters from its most specialized training distribution.',
      example: '❌ "Fix this bug"\n✅ "Act as a Senior Node.js Performance Engineer. Analyze this stack trace and fix memory leaks without introducing breaking changes."'
    },
    {
      title: '2. The CO-STAR Framework',
      icon: <Sparkles size={18} color="#C084FC" />,
      desc: 'CO-STAR stands for Context, Objective, Style, Tone, Audience, and Response Format. Providing all 6 dimensions yields up to 3x higher quality outputs.',
      example: '❌ "Write an email about our product"\n✅ "Context: Launching B2B SaaS. Objective: Convert trial users. Tone: Persuasive. Audience: CTOs. Format: Markdown with bullet points."'
    },
    {
      title: '3. Negative Constraints (Guardrails)',
      icon: <ShieldAlert size={18} color="#FB7185" />,
      desc: 'LLMs tend to generate conversational filler, vague placeholders, or unneeded fluff. Adding explicit negative constraints prevents low-value output.',
      example: '❌ "Build a React navbar"\n✅ "Build a React navbar. Constraints: Do not use inline CSS. Do not leave placeholder functions like // do logic here. Provide complete, runnable code."'
    },
    {
      title: '4. Chain-of-Thought (CoT) Reasoning',
      icon: <FileText size={18} color="#34D399" />,
      desc: 'Forcing the model to think step-by-step before outputting final answers significantly reduces hallucinations in math, logic, and code compilation.',
      example: '❌ "Calculate the database connection pool size needed for 5,000 requests/sec."\n✅ "First, break down the step-by-step math for memory allocation per thread. Then provide the final connection pool configuration."'
    }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in guide-modal">
        <div className="modal-header">
          <div className="header-left">
            <BookOpen size={20} className="modal-icon-indigo" />
            <h3 className="modal-title">Prompt Engineering Best Practices</h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body guide-body">
          <div className="guide-intro">
            <p>Mastering prompt engineering isn't about guessing magic words — it's about providing structured context, clear constraints, and explicit personas. Here is your quick reference guide:</p>
          </div>

          <div className="guide-cards">
            {GUIDES.map((item, idx) => (
              <div key={idx} className="guide-card">
                <div className="card-header">
                  {item.icon}
                  <h4 className="guide-card-title">{item.title}</h4>
                </div>
                <p className="guide-card-desc">{item.desc}</p>
                <pre className="guide-code">{item.example}</pre>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            <CheckCircle2 size={16} />
            <span>Got it, back to Workbench</span>
          </button>
        </div>
      </div>

      <style>{`
        .guide-modal {
          max-width: 680px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }

        .guide-body {
          overflow-y: auto;
          flex: 1;
        }

        .guide-intro {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .guide-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .guide-card {
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }

        .guide-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .guide-card-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 0.75rem;
        }

        .guide-code {
          background: #06090F;
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.65rem 0.85rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #A7F3D0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .modal-icon-indigo {
          color: #818CF8;
        }
      `}</style>
    </div>
  );
}
