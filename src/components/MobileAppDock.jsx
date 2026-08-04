import React from 'react';
import { Sparkles, Sliders, BookOpen, History, Layers, Zap } from 'lucide-react';

export default function MobileAppDock({
  onToggleTuner,
  isTunerOpen,
  onOpenScenarios,
  onOpenGuide,
  onOpenHistory,
  onEnhance,
  isEnhancing,
  hasInput
}) {
  return (
    <nav className="mobile-app-dock animate-fade-in">
      <button 
        className="dock-item"
        onClick={onOpenScenarios}
      >
        <div className="dock-icon-box">
          <Layers size={18} />
        </div>
        <span className="dock-label">Blueprints</span>
      </button>

      <button 
        className={`dock-item ${isTunerOpen ? 'active' : ''}`}
        onClick={onToggleTuner}
      >
        <div className="dock-icon-box">
          <Sliders size={18} />
        </div>
        <span className="dock-label">Parameters</span>
      </button>

      {/* Prominent Center Enhance Action Button */}
      <button 
        className={`dock-item dock-item-enhance ${hasInput ? 'has-input' : ''}`}
        onClick={onEnhance}
        disabled={!hasInput || isEnhancing}
      >
        <div className="dock-enhance-circle">
          {isEnhancing ? (
            <div className="dock-spinner" />
          ) : (
            <Zap size={20} className="dock-zap-icon" />
          )}
        </div>
        <span className="dock-label label-enhance">Enhance</span>
      </button>

      <button 
        className="dock-item"
        onClick={onOpenGuide}
      >
        <div className="dock-icon-box">
          <BookOpen size={18} />
        </div>
        <span className="dock-label">Playbook</span>
      </button>

      <button 
        className="dock-item"
        onClick={onOpenHistory}
      >
        <div className="dock-icon-box">
          <History size={18} />
        </div>
        <span className="dock-label">History</span>
      </button>

      <style>{`
        .mobile-app-dock {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-app-dock {
            display: flex;
            position: fixed;
            bottom: 0.75rem;
            left: 0.75rem;
            right: 0.75rem;
            height: 64px;
            z-index: 1000;
            background: rgba(18, 18, 18, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 0 0.5rem;
            align-items: center;
            justify-content: space-around;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }

          .dock-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            flex: 1;
            height: 100%;
            transition: all 150ms ease;
            position: relative;
          }

          .dock-item:active {
            transform: scale(0.92);
          }

          .dock-item.active {
            color: var(--text-primary);
          }

          .dock-icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 28px;
            border-radius: 8px;
            transition: background 150ms ease;
          }

          .dock-item.active .dock-icon-box {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
          }

          .dock-label {
            font-size: 0.625rem;
            font-weight: 600;
            letter-spacing: 0.02em;
          }

          /* Prominent Floating Center Button */
          .dock-item-enhance {
            margin-top: -16px;
          }

          .dock-enhance-circle {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: #2F2F2F;
            border: 2px solid var(--bg-dark, #121212);
            color: #71717A;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            transition: all 200ms ease;
          }

          .dock-item-enhance.has-input .dock-enhance-circle {
            background: linear-gradient(135deg, #10B981, #059669);
            color: #FFFFFF;
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }

          .dock-zap-icon {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          }

          .label-enhance {
            margin-top: 2px;
            font-weight: 700;
            color: var(--text-secondary);
          }

          .dock-item-enhance.has-input .label-enhance {
            color: #10B981;
          }

          .dock-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            border-top-color: #FFFFFF;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        }
      `}</style>
    </nav>
  );
}
