import React from 'react';
import { Settings, BookOpen, History, Github } from 'lucide-react';

export default function Navbar({ onOpenSettings, onOpenGuide, onToggleHistory, hasApiKey }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Minimalist Brand Name */}
        <div className="brand-group">
          <span className="brand-title">Prompt Like A Pro</span>
          <div className="status-indicator">
            <span className={`status-dot ${hasApiKey ? 'active' : ''}`} />
            <span className="status-text">{hasApiKey ? 'Gemini AI' : 'Local Engine'}</span>
          </div>
        </div>

        {/* Crisp Navigation Links */}
        <div className="navbar-actions">
          <button 
            className="nav-link-btn"
            onClick={onOpenGuide}
            title="Read Prompting Guide"
          >
            <BookOpen size={14} />
            <span>Guide</span>
          </button>

          <button 
            className="nav-link-btn"
            onClick={onToggleHistory}
            title="View History"
          >
            <History size={14} />
            <span>History</span>
          </button>

          <button 
            className="nav-link-btn settings-trigger"
            onClick={onOpenSettings}
            title="API Settings"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="github-nav-link"
            title="GitHub Repository"
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      <style>{`
        .navbar-container {
          width: 100%;
          border-bottom: 1px solid var(--border-subtle);
          background: #171717; /* ChatGPT-style solid dark header */
        }

        .navbar-inner {
          max-width: 840px; /* Aligns perfectly with the centered chat layout */
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .brand-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.02);
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #555;
        }

        .status-dot.active {
          background: #10B981;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.15rem; /* Clean text spacing instead of cluttered buttons */
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0;
          transition: color var(--transition-fast);
        }

        .nav-link-btn:hover {
          color: var(--text-primary);
        }

        .github-nav-link {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          transition: color var(--transition-fast);
        }

        .github-nav-link:hover {
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .nav-link-btn span {
            display: none;
          }
          .navbar-actions {
            gap: 0.85rem;
          }
        }
      `}</style>
    </header>
  );
}
