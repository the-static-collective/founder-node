import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Filter,
  Code
} from 'lucide-react';
import { DispatchReceipt } from '../types/founderNode';

interface ExecutionReceiptsProps {
  receipts: DispatchReceipt[];
  onClearReceipts: () => void;
}

export const ExecutionReceipts: React.FC<ExecutionReceiptsProps> = ({ receipts, onClearReceipts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredReceipts = receipts.filter(rc => {
    const matchesSearch = 
      rc.ideaSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rc.targetRepo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rc.proposalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rc.externalResult.receiptHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTarget = selectedTarget === 'all' || rc.dispatchTarget === selectedTarget;

    return matchesSearch && matchesTarget;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(receipts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `founder-node-receipts-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!receipts || receipts.length === 0) {
    return (
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-6 text-center space-y-3 shadow-2xl">
        <Receipt className="w-8 h-8 text-zinc-700 mx-auto" />
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em]">07 // EXECUTION RECEIPTS LOG EMPTY</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans leading-relaxed">
          Nothing disappears. Everything is traceable. Once you approve and dispatch proposals from the Dispatch Queue, cryptographic execution receipts are recorded here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
            <Receipt className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              07 // EXECUTION RECEIPTS AUDIT LOG ({receipts.length})
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Traceable provenance pipeline: Idea → Interpretation → Proposal → Approved → Dispatched → External Result.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 bg-black/60 hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Export Log
          </button>

          <button
            type="button"
            onClick={onClearReceipts}
            className="px-2.5 py-1.5 bg-black/60 hover:bg-zinc-850 text-zinc-500 hover:text-red-400 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1 uppercase tracking-wider"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-black/40 border border-zinc-800 rounded-lg">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search receipt hash, repo, or idea..."
            className="w-full bg-[#08080a] border border-zinc-800 text-zinc-200 text-xs font-mono pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Target:</span>
          <select
            value={selectedTarget}
            onChange={e => setSelectedTarget(e.target.value)}
            className="bg-[#08080a] border border-zinc-800 text-zinc-200 text-xs font-mono px-2.5 py-1.5 rounded focus:outline-none"
          >
            <option value="all">All Destinations</option>
            <option value="github">GitHub</option>
            <option value="aistudio">Google AI Studio</option>
            <option value="lovable">Lovable</option>
            <option value="bolt">Bolt</option>
            <option value="notion">Notion</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
      </div>

      {/* Receipts Audit Trail List */}
      <div className="space-y-4">
        {filteredReceipts.map(rc => {
          const isExpanded = expandedId === rc.id;

          return (
            <div
              key={rc.id}
              className="bg-black/40 border border-zinc-800/90 rounded-lg p-4 font-mono text-xs space-y-3 shadow-inner"
            >
              {/* Top Receipt Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-950/80 border border-blue-800 text-blue-300 text-[10px] uppercase font-bold rounded">
                    Receipt #{rc.id.substring(rc.id.length - 6)}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] uppercase font-bold rounded">
                    {rc.dispatchTarget.toUpperCase()}
                  </span>
                  <span className="text-zinc-400">
                    Repo: <strong className="text-indigo-300">{rc.targetRepo}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    {new Date(rc.dispatchedAt).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(rc.externalResult.receiptHash, rc.id)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedHash === rc.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                    <span>Hash: {rc.externalResult.receiptHash.substring(0, 10)}...</span>
                  </button>
                </div>
              </div>

              {/* Traceable Pipeline Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 bg-[#08080a] border border-zinc-800 rounded text-[10px]">
                {/* 1. Idea */}
                <div className="space-y-0.5 border-r md:border-r border-zinc-800 pr-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block tracking-wider">1. Idea</span>
                  <p className="text-zinc-200 line-clamp-2">{rc.ideaSummary}</p>
                </div>

                {/* 2. Interpretation */}
                <div className="space-y-0.5 border-r md:border-r border-zinc-800 pr-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block tracking-wider">2. Interpretation</span>
                  <p className="text-cyan-300 line-clamp-2">{rc.interpretationSummary}</p>
                </div>

                {/* 3. Proposal */}
                <div className="space-y-0.5 border-r md:border-r border-zinc-800 pr-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block tracking-wider">3. Proposal Type</span>
                  <p className="text-purple-300 font-bold">{rc.proposalType.replace(/_/g, ' ')}</p>
                </div>

                {/* 4. Approved */}
                <div className="space-y-0.5 border-r md:border-r border-zinc-800 pr-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block tracking-wider">4. Approved By</span>
                  <p className="text-blue-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    {rc.approvedBy}
                  </p>
                </div>

                {/* 5. External Result */}
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold block tracking-wider">5. External Result</span>
                  <p className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    DISPATCHED
                  </p>
                </div>
              </div>

              {/* Expand Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-400 text-[10px]">
                  Payload: {rc.externalResult.payloadSummary}
                </span>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : rc.id)}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 transition uppercase tracking-wider"
                >
                  {isExpanded ? 'Hide Raw JSON' : 'View Full Receipt JSON'}
                </button>
              </div>

              {/* Full JSON Payload Box */}
              {isExpanded && (
                <div className="p-3 bg-[#08080a] border border-zinc-800 rounded text-[10px] font-mono text-zinc-300 overflow-x-auto whitespace-pre">
                  {JSON.stringify(rc, null, 2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
