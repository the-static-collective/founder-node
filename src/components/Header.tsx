import React from 'react';
import { 
  Terminal, 
  Cpu, 
  GitBranch, 
  Layers, 
  Send, 
  Receipt, 
  ShieldCheck, 
  BookOpen,
  Brain,
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts';
  setActiveTab: (tab: 'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts') => void;
  dispatchCount: number;
  receiptsCount: number;
  memoryEnabled: boolean;
  setMemoryEnabled: (enabled: boolean) => void;
  onOpenRulesModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dispatchCount,
  receiptsCount,
  memoryEnabled,
  setMemoryEnabled,
  onOpenRulesModal
}) => {
  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 sticky top-0 z-40">
      {/* Top Telemetry & Controls Bar */}
      <div className="bg-[#08080a] px-4 py-1.5 border-b border-zinc-800/80 text-xs font-mono flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
            <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">FOUNDER NODE CORE</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            PROPOSAL_READY
          </span>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            HUMAN DISPATCH MANDATE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMemoryEnabled(!memoryEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition flex items-center gap-1.5 border uppercase tracking-wider ${
              memoryEnabled 
                ? 'bg-cyan-950/70 border-cyan-700 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Architectural Memory Engine"
          >
            <Brain className="w-3 h-3 text-cyan-400" />
            MEMORY: {memoryEnabled ? 'ACTIVE' : 'OFF'}
          </button>

          <button
            onClick={onOpenRulesModal}
            className="text-zinc-400 hover:text-zinc-200 text-[10px] font-mono flex items-center gap-1 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 px-2 py-0.5 rounded transition uppercase tracking-wider"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            Ecosystem Laws
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-zinc-500 border-l border-zinc-800 pl-3">
            <Activity className="w-3 h-3 text-blue-500" />
            <span>UPTIME <strong className="text-zinc-300">312:14:55</strong></span>
          </div>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black border border-blue-900/40 rounded-lg text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-mono tracking-tight text-white uppercase">
                FOUNDER NODE <span className="text-zinc-600 font-normal text-xs">// v1.0.4</span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              The Static Collective • Intent Compiler & Multidispatch Console
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'bridge'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            01_Bridge
          </button>

          <button
            onClick={() => setActiveTab('idea')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'idea'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            02_IdeaStream
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'memory'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            03_Memory
          </button>

          <button
            onClick={() => setActiveTab('repos')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'repos'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            04_Repos
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'proposals'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            05_Proposals
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 relative tracking-wide ${
              activeTab === 'dispatch'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            06_Queue
            {dispatchCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] rounded font-bold ml-0.5">
                {dispatchCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition flex items-center gap-1.5 tracking-wide ${
              activeTab === 'receipts'
                ? 'bg-blue-950/60 text-blue-300 border border-blue-600/80 shadow-[0_0_10px_rgba(59,130,246,0.2)] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-blue-400" />
            07_Receipts
            {receiptsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] rounded font-mono ml-0.5">
                {receiptsCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

