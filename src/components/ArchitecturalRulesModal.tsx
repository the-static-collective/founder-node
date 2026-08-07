import React from 'react';
import { BookOpen, X, ShieldCheck, Layers, GitBranch, Terminal } from 'lucide-react';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';

interface ArchitecturalRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitecturalRulesModal: React.FC<ArchitecturalRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl max-w-3xl w-full p-6 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                08 // ECOSYSTEM LAWS & ARCHITECTURAL BOUNDARIES
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Canonical laws governing The Static Collective nodes and Founder Node proposal authority.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-black/60 hover:bg-zinc-850 rounded border border-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Rules List */}
        <div className="space-y-4">
          <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg space-y-1.5 font-mono text-xs">
            <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Rule 1: Proposal Authority Only
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              Founder Node never executes work directly on external systems. Humans approve all proposals in the Dispatch Queue before external APIs or repositories are modified.
            </p>
          </div>

          <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg space-y-1.5 font-mono text-xs">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Rule 2: Upstream Imagination vs Execution Law
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              Haunted Toaster and Google AI Studio serve as upstream imagination engines. They generate creative specs but must NEVER own execution or deployment law. Downstream systems (TranchNode, Band Runtime) own execution.
            </p>
          </div>

          <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg space-y-1.5 font-mono text-xs">
            <span className="text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Layers className="w-4 h-4 text-purple-400" />
              Rule 3: Canonical Root Identity
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              Project0 is the sole authority for global identity, public keys, and authorization law. No downstream micro-node may create duplicate auth pools or re-define key logic.
            </p>
          </div>
        </div>

        {/* Repository Laws Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-300 tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-purple-400" />
            Repository Domain Authority Map:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
            {COLLECTIVE_REPOSITORIES.map(repo => (
              <div key={repo.id} className="p-3 bg-black/40 border border-zinc-800 rounded-lg space-y-1 font-mono text-xs">
                <span className="text-indigo-300 font-bold uppercase tracking-wide">{repo.name} ({repo.id})</span>
                <p className="text-[11px] text-zinc-400 font-sans leading-snug">{repo.authorityDomain}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded border border-blue-400/50 shadow transition"
          >
            Acknowledge Laws
          </button>
        </div>
      </div>
    </div>
  );
};
