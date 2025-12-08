import React, { useState } from 'react';
import { PROMPT_SETS } from '../constants';
import { PromptDefinition } from '../types';
import { generateArchitectureArtifact } from '../services/geminiService';
import { Play, Loader2, Copy, Check } from 'lucide-react';

const PromptRunner: React.FC = () => {
  const [activeSetId, setActiveSetId] = useState(PROMPT_SETS[0].id);
  const [loadingPromptId, setLoadingPromptId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRunPrompt = async (prompt: PromptDefinition) => {
    setLoadingPromptId(prompt.id);
    const result = await generateArchitectureArtifact(prompt.promptText);
    setResults(prev => ({ ...prev, [prompt.id]: result }));
    setLoadingPromptId(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeSet = PROMPT_SETS.find(s => s.id === activeSetId);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Architecture Prompt Studio</h2>
        <p className="text-slate-500 mt-2">Select a module set and generate the technical artifacts using Google Gemini.</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {PROMPT_SETS.map((set) => (
          <button
            key={set.id}
            onClick={() => setActiveSetId(set.id)}
            className={`px-6 py-3 font-medium text-sm transition-all rounded-t-lg ${
              activeSetId === set.id
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {set.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-8">
        {activeSet?.prompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-start">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {prompt.expectedOutput}
                  </span>
                  <h3 className="font-bold text-slate-800">{prompt.id} - {prompt.title}</h3>
                </div>
                <p className="text-slate-600 font-mono text-sm leading-relaxed bg-slate-100 p-3 rounded-lg border border-slate-200">
                  "{prompt.promptText}"
                </p>
              </div>
              <button
                onClick={() => handleRunPrompt(prompt)}
                disabled={loadingPromptId === prompt.id}
                className="flex-shrink-0 ml-4 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loadingPromptId === prompt.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
                Generate
              </button>
            </div>

            {results[prompt.id] && (
              <div className="p-0 bg-slate-900 text-slate-100 relative">
                <div className="absolute top-4 right-4 z-10">
                   <button 
                    onClick={() => copyToClipboard(results[prompt.id], prompt.id)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-slate-300"
                   >
                     {copiedId === prompt.id ? <Check size={16} /> : <Copy size={16} />}
                   </button>
                </div>
                <div className="overflow-x-auto max-h-[500px] p-6 text-sm font-mono scrollbar-thin">
                  <pre className="whitespace-pre-wrap">{results[prompt.id]}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptRunner;