import React, { useState } from 'react';
import { 
  Send, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Play, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Proposal, DispatchReceipt, DispatchTarget } from '../types/founderNode';

interface DispatchQueueProps {
  queuedProposals: Proposal[];
  onApproveAndDispatch: (proposalsToDispatch: Proposal[]) => void;
  onRemoveFromQueue: (id: string) => void;
  onClearQueue: () => void;
}

const TARGET_SYSTEM_BADGES: Record<DispatchTarget, { label: string; color: string }> = {
  github: { label: 'GitHub', color: 'bg-zinc-800 border-zinc-700 text-zinc-200' },
  lovable: { label: 'Lovable', color: 'bg-pink-950 border-pink-700 text-pink-300' },
  bolt: { label: 'Bolt', color: 'bg-amber-950 border-amber-700 text-amber-300' },
  aistudio: { label: 'Google AI Studio', color: 'bg-blue-950 border-blue-700 text-blue-300' },
  gemini_cli: { label: 'Gemini CLI', color: 'bg-teal-950 border-teal-700 text-teal-300' },
  gdocs: { label: 'Google Docs', color: 'bg-sky-950 border-sky-700 text-sky-300' },
  markdown: { label: 'Markdown File', color: 'bg-emerald-950 border-emerald-700 text-emerald-300' },
  local_files: { label: 'Local Disk', color: 'bg-stone-900 border-stone-700 text-stone-300' },
  notion: { label: 'Notion', color: 'bg-purple-950 border-purple-700 text-purple-300' },
  supabase: { label: 'Supabase', color: 'bg-emerald-950 border-emerald-800 text-emerald-300' },
  band_runtime: { label: 'Band Runtime', color: 'bg-indigo-950 border-indigo-700 text-indigo-300' }
};

export const DispatchQueue: React.FC<DispatchQueueProps> = ({
  queuedProposals,
  onApproveAndDispatch,
  onRemoveFromQueue,
  onClearQueue
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    queuedProposals.map(p => p.id)
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === queuedProposals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(queuedProposals.map(p => p.id));
    }
  };

  const handleDispatchAction = () => {
    const proposalsToDispatch = queuedProposals.filter(p => selectedIds.includes(p.id));
    if (proposalsToDispatch.length === 0) return;
    onApproveAndDispatch(proposalsToDispatch);
  };

  if (!queuedProposals || queuedProposals.length === 0) {
    return (
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-6 text-center space-y-3 shadow-2xl">
        <Send className="w-8 h-8 text-zinc-700 mx-auto" />
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em]">06 // DISPATCH QUEUE EMPTY</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
          Nothing is dispatched automatically. Every generated proposal enters this review queue. Select items from Proposals to queue them for Founder review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      {/* Queue Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
            <Send className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              06 // HUMAN DISPATCH QUEUE ({queuedProposals.length})
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Founder proposal review authority. Humans explicitly approve work before external systems are modified.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-2.5 py-1 bg-black/60 hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
          >
            {selectedIds.length === queuedProposals.length ? (
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-zinc-500" />
            )}
            {selectedIds.length === queuedProposals.length ? 'Deselect All' : 'Select All'}
          </button>

          <button
            type="button"
            onClick={onClearQueue}
            className="px-2.5 py-1 bg-black/60 hover:bg-zinc-850 text-zinc-400 hover:text-red-400 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Queue
          </button>
        </div>
      </div>

      {/* Authority Rule Notice */}
      <div className="bg-black/40 border border-blue-800/60 rounded p-3.5 text-xs font-mono text-blue-200 flex items-center justify-between gap-3 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Human Approval Mandate:</strong> Approving items below generates signed receipts and dispatches work payloads to target destinations.
          </span>
        </div>
        <span className="px-2 py-0.5 bg-blue-950/80 border border-blue-700 text-blue-300 text-[10px] uppercase font-bold rounded">
          {selectedIds.length} Selected
        </span>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {queuedProposals.map(proposal => {
          const isSelected = selectedIds.includes(proposal.id);
          const badge = TARGET_SYSTEM_BADGES[proposal.dispatchTarget] || TARGET_SYSTEM_BADGES.github;

          return (
            <div
              key={proposal.id}
              className={`p-4 rounded border font-mono transition space-y-3 ${
                isSelected
                  ? 'bg-black/60 border-blue-600/80 text-zinc-100 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'bg-black/20 border-zinc-800/80 text-zinc-400 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSelect(proposal.id)}
                    className="mt-0.5 text-blue-400 hover:text-blue-300 transition"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 text-[10px] uppercase font-bold rounded border border-zinc-800">
                        {proposal.type.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${badge.color}`}>
                        Target: {badge.label}
                      </span>
                      <span className="text-zinc-500 text-[10px]">
                        Repo: <strong className="text-indigo-300">{proposal.targetRepo}</strong>
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wide mt-1.5">
                      {proposal.title}
                    </h3>

                    <p className="text-xs font-sans text-zinc-400 mt-1 line-clamp-2">
                      {proposal.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveFromQueue(proposal.id)}
                  className="text-zinc-500 hover:text-red-400 text-xs flex items-center gap-1 transition p-1"
                  title="Remove from queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Preview Box */}
              <div className="p-3 bg-[#08080a] border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 max-h-24 overflow-y-auto whitespace-pre-wrap">
                {proposal.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dispatch Approval Trigger */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDispatchAction}
          disabled={selectedIds.length === 0}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          Approve & Dispatch Selected Proposals ({selectedIds.length})
        </button>
      </div>
    </div>
  );
};
