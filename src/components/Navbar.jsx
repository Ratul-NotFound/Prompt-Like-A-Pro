import React from 'react';
import { Zap, Key, BookOpen, History, Github, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenSettings, onOpenGuide, onToggleHistory, hasApiKey }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner glass-card">
        {/* Brand Logo */}
        <div className="brand-group">
          <div className="brand-icon">
            <Zap size={22} className="brand-glow-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              Prompt<span className="brand-gradient">Like A Pro</span>
            </h1>
            <span className="brand-tagline">AI Engineering Workbench</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={onOpenGuide}
            title="Prompt Engineering Cheat Sheet & Guide"
          >
            <BookOpen size={16} />
            <span className="hide-mobile">Guide</span>
          </button>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={onToggleHistory}
            title="Saved & Recent Prompts History"
          >
            <History size={16} />
            <span className="hide-mobile">History</span>
          </button>

          <button 
            className={`btn btn-sm ${hasApiKey ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={onOpenSettings}
            title="Configure Gemini API Key for Live Meta-Prompting"
          >
            <Key size={16} />
            <span>{hasApiKey ? 'AI API Active' : 'Set API Key'}</span>
          </button>

          <a 
            href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm github-btn"
            title="View Source on GitHub"
          >
            <Github size={18} />
            <span className="hide-mobile">GitHub</span>
          </a>
        </div>
      </div>
      
      <style>{`
        .navbar-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 1rem 1.5rem 0.5rem 1.5rem;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-lg);
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.25);
        }

        .brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .brand-gradient {
          background: linear-gradient(135deg, #818CF8 0%, #C084FC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 0.35rem;
        }

        .brand-tagline {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 500;
          display: block;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
          .navbar-container {
            padding: 0.75rem 1rem 0.25rem 1rem;
          }
        }
      `}</style>
    </header>
  );
}
