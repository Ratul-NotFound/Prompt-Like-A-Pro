import React, { useState } from 'react';
import { DOMAINS, CATEGORIES } from '../data/domains';
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
  Coding: { icon: Code, color: '#6366F1', label: 'Coding & Tech' },
  Study: { icon: BookOpen, color: '#06B6D4', label: 'Study & Academics' },
  Writing: { icon: PenTool, color: '#3B82F6', label: 'Content Writing' },
  Visuals: { icon: Sparkles, color: '#14B8A6', label: 'AI Image Prompts' },
  'AI Systems': { icon: Cpu, color: '#8B5CF6', label: 'AI System Prompts' }
};

export default function CategoryDropdownHeader({ selectedDomain, onSelectDomain }) {
  const [openCategory, setOpenCategory] = useState(null);

  // Group domains by main category
  const mainCategories = ['Coding', 'Study', 'Writing', 'Visuals', 'AI Systems'];

  const toggleDropdown = (cat) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  return (
    <section className="category-header-section">
      <div className="section-title-bar">
        <div>
          <h2 className="header-main-title">Select Scenario Category & Subcategory</h2>
          <p className="header-sub-title">Pick a category below to open subcategory options and load domain-specific prompt engineering rules.</p>
        </div>

        {/* Active Selection Badge */}
        <div className="active-selection-pill" style={{ borderColor: `${selectedDomain.color}50`, background: `${selectedDomain.color}15` }}>
          <span className="pill-dot" style={{ background: selectedDomain.color }} />
          <span className="pill-text" style={{ color: selectedDomain.color }}>
            Active: <strong>{selectedDomain.name}</strong>
          </span>
        </div>
      </div>

      {/* Categories Cards & Dropdown Row */}
      <div className="category-cards-grid">
        {mainCategories.map((catKey) => {
          const meta = CATEGORY_META[catKey] || { icon: Code, color: '#6366F1', label: catKey };
          const CatIcon = meta.icon;
          const categoryDomains = DOMAINS.filter(d => d.category === catKey);
          const isOpen = openCategory === catKey;
          const hasSelectedChild = categoryDomains.some(d => d.id === selectedDomain.id);

          return (
            <div key={catKey} className={`cat-card-wrapper ${isOpen ? 'dropdown-open' : ''}`}>
              {/* Category Card Header Button */}
              <button
                className={`cat-card-button glass-card ${hasSelectedChild ? 'active-parent' : ''}`}
                onClick={() => toggleDropdown(catKey)}
                style={{ '--cat-color': meta.color }}
              >
                <div className="cat-card-left">
                  <div className="cat-icon-box" style={{ background: `${meta.color}1A`, color: meta.color }}>
                    <CatIcon size={18} />
                  </div>
                  <div className="cat-label-group">
                    <span className="cat-name">{meta.label}</span>
                    <span className="cat-count">{categoryDomains.length} Subcategories</span>
                  </div>
                </div>

                <div className="cat-card-right">
                  <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                </div>
              </button>

              {/* Subcategories Dropdown Menu */}
              {isOpen && (
                <div className="subcategory-dropdown glass-card animate-fade-in">
                  <div className="dropdown-title">Select Subcategory:</div>
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
                          <div className="sub-icon-box" style={{ color: subDomain.color }}>
                            <SubIcon size={16} />
                          </div>
                          <div className="sub-info">
                            <span className="sub-name">{subDomain.name}</span>
                            <span className="sub-desc">{subDomain.description}</span>
                          </div>

                          {isSubSelected && (
                            <Check size={16} className="sub-check" style={{ color: subDomain.color }} />
                          )}
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
          margin-bottom: 1.75rem;
        }

        .section-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .header-main-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .header-sub-title {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .active-selection-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid;
          font-size: 0.8rem;
        }

        .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .category-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .cat-card-wrapper {
          position: relative;
        }

        .cat-card-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          transition: all var(--transition-fast);
        }

        .cat-card-button:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-medium);
        }

        .cat-card-button.active-parent {
          border-color: var(--cat-color);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
        }

        .cat-card-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .cat-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-label-group {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .cat-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cat-count {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .chevron-icon {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        /* Subcategory Dropdown Menu */
        .subcategory-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          min-width: 280px;
          z-index: 100;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          box-shadow: var(--shadow-lg);
        }

        .dropdown-title {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
          padding-left: 0.35rem;
        }

        .subcategory-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .subcategory-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .subcategory-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .subcategory-item.selected {
          background: rgba(99, 102, 241, 0.12);
        }

        .sub-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sub-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .sub-name {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sub-desc {
          font-size: 0.725rem;
          color: var(--text-muted);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .category-cards-grid {
            grid-template-columns: 1fr;
          }
          .subcategory-dropdown {
            position: relative;
            top: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
