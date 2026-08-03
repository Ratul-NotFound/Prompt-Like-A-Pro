import React from 'react';
import { Settings, BookOpen, History, Github } from 'lucide-react';

export default function Navbar({ onOpenSettings, onOpenGuide, onToggleHistory, hasApiKey }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Clean Minimalist Brand Logo */}
        <div className="brand-group">
          <span className="brand-dot" />
          <span className="brand-title">PROMPT LIKE A PRO</span>
        </div>

        {/* Minimalist Navigation Actions */}
        <div className="navbar-actions">
          <button 
            className="nav-link-btn"
            onClick={onOpenGuide}
            title="Read Prompting Guide"
          >
            <BookOpen size={13} />
            <span>Guide</span>
          </button>

          <button 
            className="nav-link-btn"
            onClick={onToggleHistory}
            title="View History"
          >
            <History size={13} />
            <span>History</span>
          </button>

          <div className="nav-divider" />

          {/* Minimal Status Dot on the right */}
          <div 
            className="engine-status-tag active"
            title="Multi-Provider AI Rotation Pool Active"
          >
            <span className="status-dot-core" />
            <span className="status-dot-label">AI ENGINE</span>
          </div>

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="github-nav-link"
            title="GitHub Repository"
          >
            <Github size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 900;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          background: #0B0C10; /* Merges completely with the main page background */
        }

        .navbar-inner {
          max-width: 840px; /* Centered chat canvas alignment */
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.25rem;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .brand-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFFFFF;
        }

        .brand-title {
          font-size: 0.775rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 0.15em;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0;
          transition: color var(--transition-fast);
        }

        .nav-link-btn:hover {
          color: #FFFFFF;
        }

        .nav-divider {
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Minimal Status Indicator */
        .engine-status-tag {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .status-dot-core {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #555;
        }

        .engine-status-tag.active .status-dot-core {
          background: #10B981;
          box-shadow: 0 0 6px #10B981;
        }

        .engine-status-tag.active .status-dot-label {
          color: #10B981;
        }

        .github-nav-link {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          transition: color var(--transition-fast);
        }

        .github-nav-link:hover {
          color: #FFFFFF;
        }

        @media (max-width: 640px) {
          .nav-link-btn span {
            display: none;
          }
          .status-dot-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
