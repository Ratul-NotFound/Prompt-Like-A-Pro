import React, { useState } from 'react';
import { DOMAINS } from '../data/domains';
import { 
  ChevronDown, 
  Check, 
  Code, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Layout, 
  Server, 
  ShieldCheck, 
  Bug, 
  Brain, 
  FileText, 
  MessageSquare, 
  Cpu 
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
  Cpu
};

const CATEGORY_META = {
  Coding: { icon: Code, label: 'Coding & Tech' },
  Study: { icon: BookOpen, label: 'Study & Academics' },
  Writing: { icon: PenTool, label: 'Content Writing' },
  Visuals: { icon: Sparkles, label: 'AI Image Prompts' },
  'AI Systems': { icon: Cpu, label: 'AI System Prompts' }
};

export default function CategoryDropdownHeader({ selectedDomain, onSelectDomain }) {
  const [openCategory, setOpenCategory] = useState(null);

  const mainCategories = ['Coding', 'Study', 'Writing', 'Visuals', 'AI Systems'];

  const toggleDropdown = (cat) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  return (
    <section className="category-header-section">
      <div className="section-title-bar">
        <div>
          <h2 className="header-main-title">Scenario Blueprint</h2>
          <p className="header-sub-title">Select a category and subcategory to load domain-specific rules and persona constraints.</p>
        </div>

        {/* Active Selection Badge */}
        <div className="active-selection-pill">
          <span className="pill-text">
            Active: <strong>{selectedDomain.name}</strong> ({selectedDomain.badge})
          </span>
        </div>
      </div>

      {/* Category Dropdown Navigation Row */}
      <div className="category-tabs-grid">
        {mainCategories.map((catKey) => {
          const meta = CATEGORY_META[catKey] || { icon: Code, label: catKey };
          const CatIcon = meta.icon;
          const categoryDomains = DOMAINS.filter(d => d.category === catKey);
          const isOpen = openCategory === catKey;
          const hasSelectedChild = categoryDomains.some(d => d.id === selectedDomain.id);

          return (
            <div key={catKey} className="cat-card-wrapper">
              <button
                className={`cat-card-button ${hasSelectedChild ? 'active-parent' : ''}`}
                onClick={() => toggleDropdown(catKey)}
              >
                <div className="cat-card-left">
                  <CatIcon size={16} className="cat-icon" />
                  <span className="cat-name">{meta.label}</span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
              </button>

              {/* Subcategory Dropdown */}
              {isOpen && (
                <div className="subcategory-dropdown animate-fade-in">
                  <div className="dropdown-header-text">Subcategory Blueprint:</div>
                  <div className="subcategory-list">
                    {categoryDomains.map((subDomain) => {
                      const SubIcon = ICON_MAP[subDomain.icon] || Sparkles;
                      const isSubSelected = selectedDomain.id === subDomain.id;

                      return (
                        <div
                          key={subDomain.id}
                          className={`subcategory-item ${isSubSelected ? 'selected' : ''}`}
                          onClick={() => {
                            onSelectDomain(subDomain);
                            setOpenCategory(null);
                          }}
                        >
                          <SubIcon size={15} className="sub-icon" />
                          <div className="sub-info">
                            <span className="sub-name">{subDomain.name}</span>
                            <span className="sub-desc">{subDomain.description}</span>
                          </div>
                          {isSubSelected && <Check size={14} className="sub-check" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .category-header-section {
          margin-bottom: 1.5rem;
        }

        .section-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .header-main-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .header-sub-title {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .active-selection-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-medium);
          background: var(--bg-surface);
          font-size: 0.775rem;
        }

        .pill-text {
          color: var(--text-secondary);
        }

        .pill-text strong {
          color: var(--text-primary);
        }

        .category-tabs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .cat-card-wrapper {
          position: relative;
        }

        .cat-card-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          border: 1px solid var(--border-medium);
          background: var(--bg-surface);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .cat-card-button:hover {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
          border-color: #484F58;
        }

        .cat-card-button.active-parent {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: var(--border-active);
        }

        .cat-card-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cat-icon {
          color: var(--text-muted);
        }

        .active-parent .cat-icon {
          color: var(--accent-blue);
        }

        .cat-name {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .chevron-icon {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        /* Subcategory Dropdown */
        .subcategory-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          min-width: 260px;
          z-index: 100;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .dropdown-header-text {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.25rem 0.5rem;
          margin-bottom: 0.25rem;
        }

        .subcategory-list {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .subcategory-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .subcategory-item:hover {
          background: var(--bg-subtle);
        }

        .subcategory-item.selected {
          background: #1F242C;
          border: 1px solid rgba(88, 166, 255, 0.2);
        }

        .sub-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .selected .sub-icon {
          color: var(--accent-blue);
        }

        .sub-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sub-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sub-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sub-check {
          color: var(--accent-blue);
        }

        @media (max-width: 640px) {
          .category-tabs-grid {
            grid-template-columns: 1fr;
          }
          .subcategory-dropdown {
            position: relative;
            top: 0;
            margin-top: 0.35rem;
          }
        }
      `}</style>
    </section>
  );
}
