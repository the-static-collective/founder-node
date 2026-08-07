import React, { useState } from 'react';
import { 
  Layers, 
  Copy, 
  Check, 
  Send, 
  Edit3, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Proposal, DispatchTarget } from '../types/founderNode';

interface ProposalGeneratorProps {
  proposals: Proposal[];
  onQueueForDispatch: (proposal: Proposal) => void;
  onUpdateProposal: (updated: Proposal) => void;
  onDeleteProposal: (id: string) => void;
}

const DISPATCH_TARGET_LABELS: Record<DispatchTarget, string> = {
  github: 'GitHub',
  lovable: 'Lovable',
  bolt: 'Bolt',
  aistudio: 'Google AI Studio',
  gemini_cli: 'Gemini CLI',
  gdocs: 'Google Docs',
  markdown: 'Markdown Document',
  local_files: 'Local File System',
  notion: 'Notion Workspace',
  supabase: 'Supabase Database',
  band_runtime: 'Band Runtime Engine'
};

export const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({
  proposals,
  onQueueForDispatch,
  onUpdateProposal,
  onDeleteProposal
}) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals[0]?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (proposal: Proposal) => {
    const blob = new Blob([proposal.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${proposal.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!proposals || proposals.length === 0) {
    return (
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-6 text-center space-y-3 shadow-2xl">
        <Layers className="w-8 h-8 text-zinc-700 mx-auto" />
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em]">05 // NO PROPOSALS GENERATED YET</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
          Submit an intention in the Idea Stream to generate structured executable proposals for GitHub, AI Studio, Lovable, Bolt, or Specs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-purple-950/60 border border-purple-800/60 text-purple-400 rounded">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              05 // PROPOSAL GENERATOR & REVIEW ({proposals.length})
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Structured proposals ready for founder review & dispatch queueing.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded border border-zinc-800">
          Authority: <strong className="text-blue-400">Human Approval Required</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Proposal Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
            Generated Proposal Items:
          </span>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {proposals.map(prop => {
              const isSelected = prop.id === activeProposal?.id;
              const isQueued = prop.status === 'queued' || prop.status === 'approved' || prop.status === 'dispatched';

              return (
                <button
                  key={prop.id}
                  onClick={() => {
                    setSelectedProposalId(prop.id);
                    setIsEditing(false);
                  }}
                  className={`w-full p-3 rounded border text-left font-mono transition space-y-2.5 ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-600 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.2)] font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-purple-900/60 border border-purple-700/80 text-purple-300 text-[10px] uppercase rounded font-bold">
                      {prop.type.replace(/_/g, ' ')}
                    </span>
                    {isQueued && (
                      <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {prop.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold leading-snug line-clamp-2">
                    {prop.title}
                  </h3>

                  <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                    <span>Target: {prop.targetRepo}</span>
                    <span className="text-zinc-400">{DISPATCH_TARGET_LABELS[prop.dispatchTarget]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Proposal Detail & Editor */}
        {activeProposal && (
          <div className="lg:col-span-8 bg-black/40 border border-zinc-800 rounded-lg p-5 space-y-4">
            {/* Header / Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div>
                <h3 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                  <span>{activeProposal.title}</span>
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Target Repository: <strong className="font-mono text-indigo-300">{activeProposal.targetRepo}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1.5 bg-[#08080a] hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
                >
                  {isEditing ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <Edit3 className="w-3.5 h-3.5 text-amber-400" />}
                  {isEditing ? 'Preview' : 'Edit'}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeProposal.content, activeProposal.id)}
                  className="px-2.5 py-1.5 bg-[#08080a] hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
                >
                  {copiedId === activeProposal.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  {copiedId === activeProposal.id ? 'Copied' : 'Copy'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(activeProposal)}
                  className="px-2.5 py-1.5 bg-[#08080a] hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => onQueueForDispatch(activeProposal)}
                  disabled={activeProposal.status === 'queued' || activeProposal.status === 'dispatched'}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded border border-blue-400/50 shadow transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {activeProposal.status === 'queued' ? 'Queued' : 'Queue for Dispatch'}
                </button>
              </div>
            </div>

            {/* Target Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#08080a] border border-zinc-800 rounded">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Dispatch Target System:</span>
                <select
                  value={activeProposal.dispatchTarget}
                  onChange={e => onUpdateProposal({ ...activeProposal, dispatchTarget: e.target.value as DispatchTarget })}
                  className="bg-black border border-zinc-800 text-zinc-200 text-xs font-mono px-2.5 py-1 rounded focus:outline-none focus:border-blue-500"
                >
                  {Object.entries(DISPATCH_TARGET_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => onDeleteProposal(activeProposal.id)}
                className="text-xs font-mono text-zinc-500 hover:text-red-400 flex items-center gap-1 transition uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>

            {/* Markdown Content / Editor Area */}
            {isEditing ? (
              <textarea
                value={activeProposal.content}
                onChange={e => onUpdateProposal({ ...activeProposal, content: e.target.value })}
                rows={16}
                className="w-full bg-[#08080a] border border-zinc-800 text-zinc-100 font-mono text-xs leading-relaxed p-4 rounded focus:border-blue-500 focus:outline-none shadow-inner resize-y"
              />
            ) : (
              <div className="bg-[#08080a] border border-zinc-800 rounded p-4 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto shadow-inner">
                {activeProposal.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
