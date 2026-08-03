import React, { useState, useEffect } from 'react';
import { DOMAINS } from './data/domains';
import { enhancePrompt } from './utils/enhancerEngine';
import { enhancePromptWithGemini } from './utils/geminiApi';

import Navbar from './components/Navbar';
import COStarTuner from './components/COStarTuner';
import SketchLayoutWorkbench from './components/SketchLayoutWorkbench';
import Toast from './components/Toast';
import VariableModal from './components/VariableModal';
import SettingsModal from './components/SettingsModal';
import PromptGuideModal from './components/PromptGuideModal';
import HistoryDrawer from './components/HistoryDrawer';

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [rawInput, setRawInput] = useState('');
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [tunerSettings, setTunerSettings] = useState({});
  const [isEnhancing, setIsEnhancing] = useState(false);

  // LocalStorage Persistence
  const [apiKey, setApiKey] = useState(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (envKey) return envKey;
    return localStorage.getItem('prompt_pro_gemini_key') || '';
  });
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('prompt_pro_gemini_model') || 'gemini-2.5-pro');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompt_pro_history')) || [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('prompt_pro_gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('prompt_pro_gemini_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('prompt_pro_history', JSON.stringify(history));
  }, [history]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleEnhance = async () => {
    if (!rawInput.trim()) return;

    setIsEnhancing(true);

    try {
      let resultObj = null;

      try {
        const apiResponse = await enhancePromptWithGemini(rawInput, selectedDomain, apiKey, selectedModel);
        resultObj = {
          enhancedText: apiResponse.text,
          additions: [
            { 
              tag: `${apiResponse.actualModelUsed} via ${apiResponse.providerUsed}`, 
              text: apiResponse.text 
            }
          ],
          variables: [],
          tokenCount: Math.ceil(apiResponse.text.length / 4),
          rawTokenCount: Math.ceil(rawInput.length / 4)
        };

        if (apiResponse.fallbackUsed) {
          showToast(`Pro limit reached. Automatically fell back to ${apiResponse.actualModelUsed} via ${apiResponse.providerUsed}!`, 'warning');
        } else {
          showToast(`Enhanced using ${apiResponse.actualModelUsed} (${apiResponse.providerUsed})!`, 'success');
        }
      } catch (apiErr) {
        console.warn('Gemini Live API failed. Falling back to local heuristics:', apiErr);
        resultObj = enhancePrompt(rawInput, selectedDomain, tunerSettings);
        showToast('Live API failed. Automatically fell back to Local Heuristic Engine.', 'warning');
      }

      setEnhancedResult(resultObj);
    } catch (err) {
      showToast(err.message || 'Failed to enhance prompt', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyPrompt = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    showToast('Copied enhanced prompt to clipboard!', 'success');
  };

  const handleApplyVariables = (variableValues) => {
    if (!enhancedResult?.enhancedText) return;

    let finalPrompt = enhancedResult.enhancedText;
    Object.entries(variableValues).forEach(([key, val]) => {
      if (val && val.trim()) {
        finalPrompt = finalPrompt.replaceAll(`{{${key}}}`, val.trim());
        finalPrompt = finalPrompt.replaceAll(`[${key}]`, val.trim());
      }
    });

    navigator.clipboard.writeText(finalPrompt);
    setShowVariableModal(false);
    showToast('Replaced variables & copied prompt!', 'success');
  };

  const handleSaveToHistory = (item) => {
    const historyItem = {
      id: Date.now(),
      domainId: selectedDomain.id,
      domainName: selectedDomain.name,
      rawPrompt: rawInput,
      enhancedText: item.enhancedText,
      timestamp: new Date().toISOString()
    };

    setHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    showToast('Prompt saved to History!', 'info');
  };

  const handleLoadFromHistory = (item) => {
    setRawInput(item.rawPrompt);
    const domainMatch = DOMAINS.find(d => d.id === item.domainId) || selectedDomain;
    setSelectedDomain(domainMatch);
    setEnhancedResult({
      enhancedText: item.enhancedText,
      additions: [{ tag: 'Saved History Item', text: item.enhancedText }],
      variables: [],
      tokenCount: Math.ceil(item.enhancedText.length / 4),
      rawTokenCount: Math.ceil(item.rawPrompt.length / 4)
    });
    setShowHistory(false);
    showToast('Loaded prompt into Workbench', 'info');
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        hasApiKey={Boolean(apiKey)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenGuide={() => setShowGuide(true)}
        onToggleHistory={() => setShowHistory(true)}
      />

      {/* Main Content Layout Flow */}
      <main className="main-content">
        {/* 1. Prompt Parameters Tuner placed above the Prompt Input Box */}
        <COStarTuner
          settings={tunerSettings}
          onChangeSettings={setTunerSettings}
          selectedDomain={selectedDomain}
        />

        {/* 2. Prompt Input & Output Flow */}
        <SketchLayoutWorkbench
          rawInput={rawInput}
          onRawInputChange={setRawInput}
          enhancedResult={enhancedResult}
          selectedDomain={selectedDomain}
          onSelectDomain={(dom) => {
            setSelectedDomain(dom);
            setTunerSettings({});
          }}
          onEnhance={handleEnhance}
          isEnhancing={isEnhancing}
          hasApiKey={Boolean(apiKey)}
          onCopy={handleCopyPrompt}
          onOpenVariableModal={() => setShowVariableModal(true)}
          onSaveToHistory={handleSaveToHistory}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} <strong>Prompt Like A Pro</strong>. Empowering developers, students, and creators with engineered prompts.</p>
          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => setShowGuide(true)}>Prompting Guide</button>
            <span>•</span>
            <button className="footer-link-btn" onClick={() => setShowSettings(true)}>API Settings</button>
            <span>•</span>
            <a href="https://github.com/Ratul-NotFound/Prompt-Like-A-Pro" target="_blank" rel="noreferrer" className="footer-link-btn">GitHub</a>
          </div>
        </div>

        <style>{`
          .app-footer {
            border-top: 1px solid var(--border-subtle);
            padding: 1.5rem;
            margin-top: 3rem;
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-muted);
            background: var(--bg-surface);
          }

          .footer-content {
            max-width: 840px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }

          .footer-links {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .footer-link-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 0.8rem;
            cursor: pointer;
            text-decoration: none;
          }

          .footer-link-btn:hover {
            color: var(--text-primary);
            text-decoration: underline;
          }
        `}</style>
      </footer>

      {/* Modals & Drawers */}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSaveApiKey={setApiKey}
          selectedModel={selectedModel}
          onSaveModel={setSelectedModel}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showGuide && (
        <PromptGuideModal onClose={() => setShowGuide(false)} />
      )}

      {showHistory && (
        <HistoryDrawer
          history={history}
          onSelectPrompt={handleLoadFromHistory}
          onDeleteItem={(id) => setHistory(prev => prev.filter(i => i.id !== id))}
          onClearHistory={() => setHistory([])}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showVariableModal && enhancedResult?.variables && (
        <VariableModal
          variables={enhancedResult.variables}
          onApply={handleApplyVariables}
          onClose={() => setShowVariableModal(false)}
        />
      )}

      {/* Toast Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
