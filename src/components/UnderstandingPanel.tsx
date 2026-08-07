import React from 'react';
import { 
  Eye, 
  Target, 
  ShieldAlert, 
  HelpCircle, 
  GitBranch, 
  Link2, 
  AlertTriangle, 
  Sparkles,
  Layers
} from 'lucide-react';
import { UnderstandingStage } from '../types/founderNode';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';

interface UnderstandingPanelProps {
  understanding: UnderstandingStage | null;
}

export const UnderstandingPanel: React.FC<UnderstandingPanelProps> = ({ understanding }) => {
  if (!understanding) {
    return (
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-6 text-center space-y-3 shadow-2xl">
        <Sparkles className="w-8 h-8 text-zinc-700 mx-auto" />
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em]">02 // UNDERSTANDING STAGE IDLE</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
          Submit an intention in the Idea Stream to extract observed facts, goals, constraints, risks, and suggested slices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              02 // UNDERSTANDING & BOUNDARIES
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              "What is this actually about?" — Extracted facts, boundaries, and dependencies.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-blue-950/80 border border-blue-700/80 text-blue-300 text-xs font-mono rounded font-bold uppercase tracking-wider">
          Compiled Analysis
        </span>
      </div>

      {/* Suggested Slice Hero Box */}
      <div className="bg-black/50 border border-blue-800/60 rounded p-4 space-y-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Suggested Implementation Slice
        </span>
        <p className="text-xs font-mono text-blue-100 leading-relaxed">
          {understanding.suggestedSlice}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Observed Facts */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Observed Facts ({understanding.observedFacts.length})
          </h3>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
            {understanding.observedFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono mt-0.5">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Goals */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Goals ({understanding.goals.length})
          </h3>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
            {understanding.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono mt-0.5">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Constraints */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Constraints ({understanding.constraints.length})
          </h3>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
            {understanding.constraints.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-mono mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unknowns */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Unknowns ({understanding.unknowns.length})
          </h3>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
            {understanding.unknowns.map((u, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-400 font-mono mt-0.5">•</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Target Repositories */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            Potential Repositories ({understanding.potentialRepositories.length})
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {understanding.potentialRepositories.map(repoId => {
              const repo = COLLECTIVE_REPOSITORIES.find(r => r.id === repoId);
              return (
                <div key={repoId} className="px-2.5 py-1 bg-indigo-950/80 border border-indigo-700/80 text-indigo-200 text-xs font-mono rounded">
                  {repo?.name || repoId}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risks & Dependencies */}
        <div className="bg-black/40 border border-zinc-800/90 rounded p-4 space-y-2">
          <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Risks & Blockers
          </h3>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
            {understanding.risks.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-mono mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
            {understanding.dependencies.map((d, idx) => (
              <li key={`dep-${idx}`} className="flex items-start gap-2 text-zinc-400">
                <Link2 className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                <span>Dependency: {d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
