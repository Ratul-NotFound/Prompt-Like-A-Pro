import React from 'react';
import { X, History, Trash2, Copy, Star, ArrowRight } from 'lucide-react';

export default function HistoryDrawer({ history, onSelectPrompt, onDeleteItem, onClearHistory, onClose }) {
  return (
    <div className="drawer-overlay">
      <div className="drawer-panel glass-card animate-slide-right">
        <div className="drawer-header">
          <div className="header-left">
            <History size={18} className="text-indigo" />
            <h3 className="drawer-title">Prompt History ({history.length})</h3>
          </div>
          <div className="header-right">
            {history.length > 0 && (
              <button 
                className="btn btn-ghost btn-sm text-rose"
                onClick={onClearHistory}
                title="Clear all saved history"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="empty-history">
              <History size={36} className="empty-icon" />
              <p className="empty-title">No Prompts Saved Yet</p>
              <p className="empty-desc">Enhanced prompts will automatically appear here for easy reuse and quick copying.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-card glass-card">
                  <div className="history-card-top">
                    <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                      {item.domainName}
                    </span>
                    <span className="history-time">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="history-preview">"{item.rawPrompt}"</p>

                  <div className="history-card-actions">
                    <button 
                      className="btn btn-ghost btn-sm text-rose"
                      onClick={() => onDeleteItem(item.id)}
                      title="Delete item"
                    >
                      <Trash2 size={13} />
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectPrompt(item)}
                    >
                      <span>Load into Workbench</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(8, 11, 17, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-panel {
          width: 100%;
          max-width: 420px;
          height: 100%;
          border-radius: 0;
          border-left: 1px solid var(--border-medium);
          background: var(--bg-surface);
          display: flex;
          flex-direction: column;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .drawer-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          margin-bottom: 0.75rem;
          opacity: 0.4;
        }

        .empty-title {
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .empty-desc {
          font-size: 0.8rem;
          max-width: 260px;
          line-height: 1.45;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .history-card {
          padding: 0.85rem 1rem;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .history-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .history-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .history-preview {
          font-size: 0.825rem;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-style: italic;
        }

        .history-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .text-indigo { color: #818CF8; }
        .text-rose { color: #FB7185; }
      `}</style>
    </div>
  );
}
