import React from 'react';
import { Sun, Moon, BookOpen, History, Github } from 'lucide-react';

export default function Navbar({ onOpenGuide, onToggleHistory, theme, onToggleTheme }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-group">
          <span className="brand-orb" />
          <span className="brand-title">PROMPT LIKE A PRO</span>
        </div>

        {/* Minimalist Navigation Actions */}
        <div className="navbar-actions">
          <button 
            className="nav-link-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <button 
            className="nav-link-btn"
            onClick={onOpenGuide}
            aria-label="Open prompting playbook guide"
            title="Read Prompting Guide"
          >
            <BookOpen size={13} aria-hidden="true" />
            <span>Guide</span>
          </button>

          <button 
            className="nav-link-btn"
            onClick={onToggleHistory}
            aria-label="View saved prompt history"
            title="View History"
          >
            <History size={13} aria-hidden="true" />
            <span>History</span>
          </button>

          <div className="nav-divider" role="separator" />

          {/* Minimal Status Dot on the right */}
          <div 
            className="engine-status-tag active"
            title="Multi-Provider AI Rotation Pool Active"
            role="status"
            aria-live="polite"
          >
            <span className="status-dot-core" aria-hidden="true" />
            <span className="status-dot-label">AI ENGINE</span>
          </div>

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="github-nav-link"
            aria-label="View source code on GitHub"
            title="GitHub Repository"
          >
            <Github size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 900;
          width: 100%;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(11, 12, 16, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background 200ms ease, border-color 200ms ease;
        }

        [data-theme="light"] .navbar-container {
          background: rgba(248, 250, 252, 0.88);
        }

        .navbar-inner {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        /* Glowing indigo orb */
        .brand-orb {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366F1;
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.7), 0 0 16px rgba(99, 102, 241, 0.3);
          animation: orb-pulse 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes orb-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99, 102, 241, 0.7), 0 0 16px rgba(99, 102, 241, 0.25); }
          50%       { box-shadow: 0 0 12px rgba(99, 102, 241, 0.9), 0 0 24px rgba(99, 102, 241, 0.45); }
        }

        .brand-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.18em;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.55rem;
          border-radius: 6px;
          transition: color 150ms ease, background 150ms ease;
        }

        .nav-link-btn:hover {
          color: var(--text-primary);
          background: var(--bg-subtle);
        }

        .nav-divider {
          width: 1px;
          height: 14px;
          background: var(--border-subtle);
          margin: 0 0.25rem;
        }

        /* Status pill */
        .engine-status-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          padding: 0.2rem 0.5rem;
          border-radius: 99px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
        }

        .status-dot-core {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #555;
          flex-shrink: 0;
        }

        .engine-status-tag.active .status-dot-core {
          background: #10B981;
          box-shadow: 0 0 5px #10B981;
          animation: status-blink 2.5s ease-in-out infinite;
        }

        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .engine-status-tag.active {
          border-color: rgba(16, 185, 129, 0.25);
          background: rgba(16, 185, 129, 0.06);
        }

        .engine-status-tag.active .status-dot-label {
          color: #10B981;
        }

        .github-nav-link {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          padding: 0.3rem;
          border-radius: 6px;
          transition: color 150ms ease, background 150ms ease;
        }

        .github-nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-subtle);
        }

        @media (max-width: 640px) {
          .navbar-inner { padding: 0.65rem 0.85rem; }
          .brand-title { font-size: 0.65rem; letter-spacing: 0.1em; }
          .navbar-actions { gap: 0.3rem; }
          .nav-link-btn {
            padding: 0.3rem 0.45rem;
            background: var(--bg-subtle);
            border: 1px solid var(--border-subtle);
            font-size: 0.68rem;
          }
          .nav-divider, .engine-status-tag { display: none; }
        }
        @media (max-width: 400px) {
          .brand-title { font-size: 0.6rem; }
          .nav-link-btn span { display: none; }
          .nav-link-btn { padding: 0.35rem; }
        }
      `}</style>
    </header>
  );
}
