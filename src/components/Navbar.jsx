import React from 'react';
import { Terminal, Key, BookOpen, History, Github } from 'lucide-react';

export default function Navbar({ onOpenSettings, onOpenGuide, onToggleHistory, hasApiKey }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Title */}
        <div className="brand-group">
          <div className="brand-icon">
            <Terminal size={18} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Prompt Like A Pro</h1>
            <span className="brand-tagline">AI Engineering Workbench</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onOpenGuide}
            title="Prompting Guide"
          >
            <BookOpen size={14} />
            <span className="hide-mobile">Guide</span>
          </button>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={onToggleHistory}
            title="Prompt History"
          >
            <History size={14} />
            <span className="hide-mobile">History</span>
          </button>

          <button 
            className={`btn btn-sm ${hasApiKey ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={onOpenSettings}
            title="API Settings"
          >
            <Key size={14} />
            <span>{hasApiKey ? 'API Active' : 'API Key'}</span>
          </button>

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            title="GitHub Repository"
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      <style>{`
        .navbar-container {
          width: 100%;
          border-bottom: 1px solid var(--border-medium);
          background: var(--bg-surface);
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .brand-icon {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }

        .brand-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .brand-tagline {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 500;
          display: block;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
          .navbar-inner {
            padding: 0.65rem 1rem;
          }
        }
      `}</style>
    </header>
  );
}
