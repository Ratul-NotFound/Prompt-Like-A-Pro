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
  Coding: { icon: Code, label: 'Coding & Engineering' },
  Study: { icon: BookOpen, label: 'Study & Academics' },
  Writing: { icon: PenTool, label: 'Content & Copywriting' },
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
          <h2 className="header-main-title">Target Scenario & Persona Blueprint</h2>
          <p className="header-sub-title">Select a category below to open subcategory options and inject specialized prompt rules.</p>
        </div>

        {/* Active Selection Badge */}
        <div className="active-selection-pill">
          <span className="pill-dot" />
          <span className="pill-text">
            Active Persona: <strong>{selectedDomain.name}</strong>
          </span>
        </div>
      </div>

      {/* Category Segmented Navigation Bar */}
      <div className="category-tabs-row">
        {mainCategories.map((catKey) => {
          const meta = CATEGORY_META[catKey] || { icon: Code, label: catKey };
          const CatIcon = meta.icon;
          const categoryDomains = DOMAINS.filter(d => d.category === catKey);
          const isOpen = openCategory === catKey;
          const hasSelectedChild = categoryDomains.some(d => d.id === selectedDomain.id);

          return (
            <div key={catKey} className="cat-card-wrapper">
              <button
                className={`cat-tab-btn ${hasSelectedChild ? 'active-parent' : ''} ${isOpen ? 'open' : ''}`}
                onClick={() => toggleDropdown(catKey)}
              >
                <div className="cat-tab-left">
                  <CatIcon size={15} className="cat-icon" />
                  <span className="cat-name">{meta.label}</span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
              </button>

              {/* Subcategory Dropdown Panel */}
              {isOpen && (
                <div className="subcategory-dropdown animate-fade-in">
                  <div className="dropdown-header-text">Select Scenario Blueprint:</div>
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
                          <div className="sub-icon-container">
                            <SubIcon size={15} />
                          </div>
                          <div className="sub-info">
                            <div className="sub-header-row">
                              <span className="sub-name">{subDomain.name}</span>
                              <span className="sub-badge">{subDomain.badge}</span>
                            </div>
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

        .pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-primary);
        }

        .pill-text {
          color: var(--text-secondary);
        }

        .pill-text strong {
          color: var(--text-primary);
        }

        .category-tabs-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.65rem;
        }

        .cat-card-wrapper {
          position: relative;
        }

        .cat-tab-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .cat-tab-btn:hover {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .cat-tab-btn.active-parent {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: var(--accent-primary);
        }

        .cat-tab-btn.open {
          border-color: var(--accent-primary);
        }

        .cat-tab-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cat-icon {
          color: var(--text-muted);
        }

        .active-parent .cat-icon {
          color: var(--accent-primary);
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

        /* Subcategory Dropdown Panel */
        .subcategory-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          min-width: 280px;
          z-index: 100;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.55rem 0.6rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .subcategory-item:hover {
          background: var(--bg-subtle);
        }

        .subcategory-item.selected {
          background: var(--bg-subtle);
          border: 1px solid var(--accent-primary);
        }

        .sub-icon-container {
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .selected .sub-icon-container {
          color: var(--accent-primary);
        }

        .sub-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .sub-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sub-name {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sub-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .sub-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sub-check {
          color: var(--accent-primary);
          margin-top: 2px;
        }

        @media (max-width: 640px) {
          .category-tabs-row {
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
