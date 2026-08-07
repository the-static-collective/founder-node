import React from 'react';
import { 
  Cpu, 
  Terminal, 
  Brain, 
  GitBranch, 
  Layers, 
  Send, 
  Receipt, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CircleDot,
  CheckCircle2
} from 'lucide-react';
import { CompiledIdea, Proposal, DispatchReceipt, RepositoryId } from '../types/founderNode';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';
import { PipelineVisualizer } from './PipelineVisualizer';

interface CommandBridgeOverviewProps {
  lastCompiledIdea: CompiledIdea | null;
  proposals: Proposal[];
  queuedProposals: Proposal[];
  receipts: DispatchReceipt[];
  memoryEnabled: boolean;
  onNavigateTab: (tab: 'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts') => void;
  onQuickCompileSample: (sampleText: string) => void;
}

export const CommandBridgeOverview: React.FC<CommandBridgeOverviewProps> = ({
  lastCompiledIdea,
  proposals,
  queuedProposals,
  receipts,
  memoryEnabled,
  onNavigateTab,
  onQuickCompileSample
}) => {
  return (
    <div className="space-y-6">
      {/* Visual Pipeline Journey Representation */}
      <PipelineVisualizer
        lastCompiledIdea={lastCompiledIdea}
        proposals={proposals}
        queuedProposals={queuedProposals}
        receipts={receipts}
        onNavigateTab={onNavigateTab}
      />

      {/* Top Mission Control Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#08080a] border border-zinc-800 rounded-lg p-3.5 space-y-1 font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5 tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            01_Last Compiled Intent
          </span>
          <p className="text-xs font-bold text-zinc-100 truncate pt-0.5">
            {lastCompiledIdea ? lastCompiledIdea.rawText.substring(0, 32) + '...' : 'Awaiting Input'}
          </p>
        </div>

        <div className="bg-[#08080a] border border-zinc-800 rounded-lg p-3.5 space-y-1 font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5 tracking-wider">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            02_Proposals Batch
          </span>
          <p className="text-xs font-bold text-purple-300 pt-0.5">
            {proposals.length} active items
          </p>
        </div>

        <div className="bg-[#08080a] border border-zinc-800 rounded-lg p-3.5 space-y-1 font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5 tracking-wider">
            <Send className="w-3.5 h-3.5 text-amber-400" />
            03_Dispatch Queue
          </span>
          <p className="text-xs font-bold text-amber-300 pt-0.5">
            {queuedProposals.length} pending review
          </p>
        </div>

        <div className="bg-[#08080a] border border-zinc-800 rounded-lg p-3.5 space-y-1 font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold flex items-center gap-1.5 tracking-wider">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            04_Execution Log
          </span>
          <p className="text-xs font-bold text-emerald-300 pt-0.5">
            {receipts.length} receipts
          </p>
        </div>
      </div>

      {/* Main Command Bridge Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Idea Stream Portal & Current Work */}
        <div className="lg:col-span-7 space-y-6">
          {/* Idea Stream Panel Card */}
          <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl relative overflow-hidden group hover:border-blue-900/50 transition-colors">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                    01 // IDEA STREAM COMPILER
                  </h2>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('idea')}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Open Stream Console <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Dump raw unstructured intention. The Founder Node compiler extracts core goals, verifies architectural boundaries against repository rules, and generates actionable proposal slices.
            </p>

            {/* Quick Action Sample Prompts */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Quick Sample Intent Compilation:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onQuickCompileSample("Haunted Toaster should become wildly creative but never own execution law. AI Studio should become the upstream imagination engine.")}
                  className="p-3 bg-black/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-blue-800/60 rounded text-left transition font-mono text-xs space-y-1 group/btn"
                >
                  <div className="text-blue-400 font-bold group-hover/btn:underline flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    HT Upstream Engine
                  </div>
                  <div className="text-zinc-500 text-[11px] line-clamp-1">Imagination engine vs execution law boundary</div>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickCompileSample("We need TranchNode to automatically ingest audio stems and generate video renders for ready tracks.")}
                  className="p-3 bg-black/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-indigo-800/60 rounded text-left transition font-mono text-xs space-y-1 group/btn"
                >
                  <div className="text-indigo-400 font-bold group-hover/btn:underline flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    TranchNode Render Loop
                  </div>
                  <div className="text-zinc-500 text-[11px] line-clamp-1">Audio-to-video slice execution pipeline</div>
                </button>
              </div>
            </div>
          </div>

          {/* Current Work & Suggested Actions */}
          <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-950/60 border border-purple-800/60 text-purple-400 rounded">
                  <Layers className="w-4 h-4" />
                </span>
                <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                  02 // CURRENT WORK BATCH
                </h2>
              </div>

              <button
                onClick={() => onNavigateTab('proposals')}
                className="text-xs font-mono text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Inspect Proposals ({proposals.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {proposals.length > 0 ? (
              <div className="space-y-2">
                {proposals.slice(0, 3).map(prop => (
                  <div key={prop.id} className="p-3 bg-black/40 border border-zinc-800/80 rounded font-mono text-xs flex items-center justify-between">
                    <div>
                      <span className="text-purple-300 font-bold">{prop.title}</span>
                      <p className="text-[11px] text-zinc-500 font-sans mt-0.5">{prop.summary}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 text-[10px] rounded border border-zinc-800 uppercase">
                      {prop.dispatchTarget}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-zinc-500 p-4 bg-black/40 border border-zinc-900 rounded text-center">
                No active work items generated yet. Submit a thought in the Idea Stream above.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Repository Context & Architectural Memory & Receipts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Architectural Memory Card */}
          <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded">
                  <Brain className="w-4 h-4" />
                </span>
                <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                  03 // ARCHITECTURAL MATRIX
                </h2>
              </div>

              <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold border uppercase tracking-wider ${memoryEnabled ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                {memoryEnabled ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>

            {lastCompiledIdea?.architecturalCheck ? (
              <div className="p-3 bg-black/40 border border-zinc-800 rounded font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase text-[10px]">Authority Domain:</span>
                  <strong className="text-indigo-300">{lastCompiledIdea.architecturalCheck.belongsTo}</strong>
                </div>
                <div className="text-[11px] text-cyan-200 leading-snug">
                  {lastCompiledIdea.architecturalCheck.guidance}
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-500 p-3 bg-black/40 border border-zinc-900 rounded">
                Boundary rules loaded across {COLLECTIVE_REPOSITORIES.length} repositories. Memory active.
              </p>
            )}
          </div>

          {/* Repository Context Summary Card */}
          <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 rounded">
                  <GitBranch className="w-4 h-4" />
                </span>
                <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                  04 // ECOSYSTEM REPOSITORIES
                </h2>
              </div>

              <button
                onClick={() => onNavigateTab('repos')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Inspect Registry <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {COLLECTIVE_REPOSITORIES.map(repo => (
                <div key={repo.id} className="p-2 bg-black/40 border border-zinc-800/80 rounded font-mono text-xs flex items-center justify-between">
                  <span className="text-zinc-200 font-bold">{repo.name}</span>
                  <span className="text-[10px] text-zinc-500">{repo.openIssues.length} issues</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Queue & Receipts Quick Card */}
          <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-950/60 border border-amber-800/60 text-amber-400 rounded">
                  <Send className="w-4 h-4" />
                </span>
                <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                  05 // DISPATCH & RECEIPTS
                </h2>
              </div>

              <button
                onClick={() => onNavigateTab('dispatch')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Review Queue ({queuedProposals.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Human approval mandate protects external systems. Dispatched work produces traceable cryptographic receipts in the execution log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
