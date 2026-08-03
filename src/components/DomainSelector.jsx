import React, { useState } from 'react';
import { CATEGORIES, DOMAINS } from '../data/domains';
import { 
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
  Check 
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

export default function DomainSelector({ selectedDomain, onSelectDomain }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDomains = activeCategory === 'All' 
    ? DOMAINS 
    : DOMAINS.filter(d => d.category === activeCategory);

  return (
    <section className="domain-selector-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Select Scenario & Target Domain</h2>
          <p className="section-desc">Choose a domain blueprint to apply expert persona rules, negative constraints, and output formatting.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Domain Grid */}
      <div className="domain-grid">
        {filteredDomains.map(domain => {
          const IconComponent = ICON_MAP[domain.icon] || Sparkles;
          const isSelected = selectedDomain.id === domain.id;

          return (
            <div
              key={domain.id}
              className={`domain-card glass-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDomain(domain)}
              style={{ '--domain-color': domain.color }}
            >
              <div className="card-top">
                <div className="icon-wrapper" style={{ background: `${domain.color}1A`, borderColor: `${domain.color}40`, color: domain.color }}>
                  <IconComponent size={20} />
                </div>
                <span className="badge badge-indigo" style={{ background: `${domain.color}15`, color: domain.color, borderColor: `${domain.color}30` }}>
                  {domain.badge}
                </span>
              </div>

              <div className="card-body">
                <h3 className="domain-title">{domain.name}</h3>
                <p className="domain-desc">{domain.description}</p>
              </div>

              {isSelected && (
                <div className="selected-indicator" style={{ background: domain.color }}>
                  <Check size={14} color="#FFF" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .domain-selector-section {
          margin-bottom: 2rem;
        }

        .section-header {
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }

        .section-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .category-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .category-pill {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }

        .category-pill:hover {
          background: var(--bg-surface-hover);
          color: var(--text-primary);
          border-color: var(--border-medium);
        }

        .category-pill.active {
          background: rgba(99, 102, 241, 0.15);
          color: #818CF8;
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
        }

        .domain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .domain-card {
          position: relative;
          padding: 1.15rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .domain-card.selected {
          border-color: var(--domain-color);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .domain-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.3rem;
        }

        .domain-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .selected-indicator {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .domain-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
