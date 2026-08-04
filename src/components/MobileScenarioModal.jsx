import React, { useState } from 'react';
import { DOMAINS, CATEGORIES } from '../data/domains';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  Code, 
  BookOpen, 
  PenTool, 
  Cpu, 
  Layout, 
  Server, 
  ShieldCheck, 
  Bug, 
  Brain, 
  FileText, 
  MessageSquare,
  Terminal,
  Database,
  TrendingUp,
  HelpCircle,
  Mail,
  Workflow
} from 'lucide-react';

const ICON_MAP = {
  Layout,
  Server,
  ShieldCheck,
  Bug,
  Brain,
  BookOpen,
  FileText,
  PenTool,
  MessageSquare,
  Sparkles,
  Cpu,
  Terminal,
  Database,
  TrendingUp,
  HelpCircle,
  Mail,
  Workflow
};

export default function MobileScenarioModal({ selectedDomain, onSelectDomain, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDomains = DOMAINS.filter(d => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-overlay mobile-scenario-overlay" onClick={onClose}>
      <div className="mobile-scenario-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Drag Handle */}
        <div className="drag-handle-bar">
          <div className="drag-handle" />
        </div>

        {/* Header */}
        <div className="sheet-header">
          <div className="header-left">
            <Sparkles size={18} className="sheet-icon" />
            <h3 className="sheet-title">Scenario Blueprints</h3>
          </div>
          <button className="btn btn-ghost btn-sm close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="sheet-search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="sheet-search-input"
            placeholder="Search 17+ domain blueprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="sheet-category-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Subcategories Blueprint List */}
        <div className="sheet-blueprint-list">
          {filteredDomains.map(subDomain => {
            const SubIcon = ICON_MAP[subDomain.icon] || Sparkles;
            const isSelected = selectedDomain.id === subDomain.id;

            return (
              <button
                key={subDomain.id}
                className={`blueprint-card-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectDomain(subDomain);
                  onClose();
                }}
              >
                <div className="bp-card-left">
                  <div className="bp-icon-box">
                    <SubIcon size={16} />
                  </div>
                  <div className="bp-info">
                    <div className="bp-title-row">
                      <span className="bp-title">{subDomain.name}</span>
                      <span className="bp-badge">{subDomain.badge}</span>
                    </div>
                    <span className="bp-desc">{subDomain.description}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="bp-check-badge">
                    <Check size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .mobile-scenario-overlay {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1100;
        }

        .mobile-scenario-sheet {
          width: 100%;
          max-width: 540px;
          max-height: 85vh;
          background: var(--bg-surface);
          border-radius: 24px 24px 0 0;
          border-top: 1px solid var(--border-medium);
          border-left: 1px solid var(--border-subtle);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1rem 1.5rem 1rem;
          box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.8);
        }

        .drag-handle-bar {
          display: flex;
          justify-content: center;
          padding: 0.4rem 0;
        }

        .drag-handle {
          width: 36px;
          height: 4px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.2);
        }

        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.2rem 0.6rem 0.2rem;
        }

        .sheet-icon {
          color: var(--accent-emerald, #10B981);
        }

        .sheet-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sheet-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
        }

        .sheet-search-input {
          width: 100%;
          height: 44px;
          padding: 0 2.2rem 0 2.4rem;
          border-radius: 12px;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          font-size: 0.85rem;
          color: var(--text-primary);
          outline: none;
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
        }

        .sheet-category-scroll {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.65rem;
          margin-bottom: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .category-pill {
          padding: 0.4rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          white-space: nowrap;
          cursor: pointer;
        }

        .category-pill.active {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.35);
          color: #10B981;
        }

        .sheet-blueprint-list {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding-right: 0.2rem;
          max-height: 55vh;
        }

        .blueprint-card-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0.85rem;
          border-radius: 14px;
          background: var(--bg-input);
          border: 1px solid var(--border-subtle);
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .blueprint-card-item:active {
          transform: scale(0.98);
        }

        .blueprint-card-item.selected {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .bp-card-left {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          flex: 1;
        }

        .bp-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .blueprint-card-item.selected .bp-icon-box {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .bp-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }

        .bp-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .bp-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .bp-badge {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .blueprint-card-item.selected .bp-badge {
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.25);
        }

        .bp-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .bp-check-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.5rem;
          flex-shrink: 0;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .animate-slide-up {
          animation: slideUp 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
