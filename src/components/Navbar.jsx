import React from 'react';
import { Settings, BookOpen, History, Github, Terminal, Sliders } from 'lucide-react';

export default function Navbar({ onOpenSettings, onOpenGuide, onToggleHistory, hasApiKey, sidebarOpen, onToggleSidebar }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Modern Developer-style Brand Logo */}
        <div className="brand-group">
          <div className="brand-logo-icon">
            <Terminal size={12} className="logo-svg" />
          </div>
          <span className="brand-title">PROMPT</span>
          <span className="brand-badge">PRO</span>
          
          <div className="status-indicator">
            <span className={`status-dot ${hasApiKey ? 'active' : ''}`} />
            <span className="status-text">{hasApiKey ? 'Gemini AI Active' : 'Local Sandbox'}</span>
          </div>
        </div>

        {/* Premium Capsule Navigation Links */}
        <div className="navbar-actions">
          {/* Collapsible parameters panel toggle button */}
          <button 
            className={`nav-link-btn tuner-toggle ${sidebarOpen ? 'active' : ''}`}
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Hide Tuner Panel" : "Show Tuner Panel"}
          >
            <Sliders size={13} />
            <span>Tuner</span>
          </button>

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

          <button 
            className="nav-link-btn settings-trigger"
            onClick={onOpenSettings}
            title="API Settings"
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>

          <div className="nav-divider" />

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="github-nav-link"
            title="GitHub Repository"
          >
            <Github size={15} />
          </a>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 900;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(11, 12, 16, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .navbar-inner {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          transition: max-width 0.2s ease;
        }

        /* Expand header width dynamically when sidebar layout is visible */
        .navbar-container:has(+ main .has-sidebar) .navbar-inner {
          max-width: 1200px;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand-logo-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-svg {
          color: #000000;
        }

        .brand-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.08em;
        }

        .brand-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 0.05rem 0.3rem;
          background: rgba(255, 255, 255, 0.02);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.01);
          font-size: 0.675rem;
          color: var(--text-secondary);
          margin-left: 0.5rem;
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
          gap: 0.4rem;
        }

        .nav-link-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-family: var(--font-ui);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .nav-link-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .nav-link-btn.active {
          color: #000000;
          background: #FFFFFF;
          border-color: #FFFFFF;
        }

        .nav-divider {
          width: 1px;
          height: 14px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 0.4rem;
        }

        .github-nav-link {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .github-nav-link:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.04);
        }

        @media (max-width: 640px) {
          .nav-link-btn span {
            display: none;
          }
          .status-indicator {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
