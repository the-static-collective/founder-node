import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Layers, 
  Send, 
  Receipt, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ChevronRight, 
  X, 
  ExternalLink, 
  GitBranch, 
  ShieldCheck, 
  AlertTriangle,
  Play,
  FileCode,
  Terminal,
  Search,
  Eye
} from 'lucide-react';
import { CompiledIdea, Proposal, DispatchReceipt } from '../types/founderNode';

export interface PipelineStep {
  id: number;
  key: 'idea' | 'understanding' | 'mapping' | 'selection' | 'proposals' | 'review' | 'dispatch' | 'execution' | 'receipt';
  label: string;
  subLabel: string;
  tabTarget: 'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts';
  icon: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, key: 'idea', label: '01. Idea', subLabel: 'Unstructured Intention', tabTarget: 'idea', icon: 'idea' },
  { id: 2, key: 'understanding', label: '02. Understanding', subLabel: 'Facts & Goals', tabTarget: 'idea', icon: 'understanding' },
  { id: 3, key: 'mapping', label: '03. Arch Mapping', subLabel: 'Boundary Memory Check', tabTarget: 'memory', icon: 'mapping' },
  { id: 4, key: 'selection', label: '04. Project Selection', subLabel: 'Target Repos Routing', tabTarget: 'repos', icon: 'selection' },
  { id: 5, key: 'proposals', label: '05. Proposal Gen', subLabel: 'Specs & Prompts', tabTarget: 'proposals', icon: 'proposals' },
  { id: 6, key: 'review', label: '06. Human Review', subLabel: 'Founder Queue Authority', tabTarget: 'dispatch', icon: 'review' },
  { id: 7, key: 'dispatch', label: '07. Dispatch', subLabel: 'Payload Execution', tabTarget: 'dispatch', icon: 'dispatch' },
  { id: 8, key: 'execution', label: '08. Execution', subLabel: 'External Repos/APIs', tabTarget: 'receipts', icon: 'execution' },
  { id: 9, key: 'receipt', label: '09. Receipt Log', subLabel: 'Provenance Hash', tabTarget: 'receipts', icon: 'receipt' },
];

interface PipelineVisualizerProps {
  lastCompiledIdea: CompiledIdea | null;
  proposals: Proposal[];
  queuedProposals: Proposal[];
  receipts: DispatchReceipt[];
  onNavigateTab: (tab: 'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts') => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  lastCompiledIdea,
  proposals,
  queuedProposals,
  receipts,
  onNavigateTab
}) => {
  const [selectedStep, setSelectedStep] = useState<PipelineStep | null>(null);

  // Determine completion stage based on state
  const getStepStatus = (stepKey: PipelineStep['key']) => {
    switch (stepKey) {
      case 'idea':
        return lastCompiledIdea ? 'completed' : 'active';
      case 'understanding':
        return lastCompiledIdea?.understanding ? 'completed' : lastCompiledIdea ? 'active' : 'pending';
      case 'mapping':
        return lastCompiledIdea?.architecturalCheck ? 'completed' : lastCompiledIdea ? 'active' : 'pending';
      case 'selection':
        return lastCompiledIdea?.architecturalCheck?.belongsTo ? 'completed' : 'pending';
      case 'proposals':
        return proposals.length > 0 ? 'completed' : lastCompiledIdea ? 'active' : 'pending';
      case 'review':
        return queuedProposals.length > 0 ? 'active' : proposals.length > 0 ? 'completed' : 'pending';
      case 'dispatch':
        return receipts.length > 0 ? 'completed' : queuedProposals.length > 0 ? 'active' : 'pending';
      case 'execution':
        return receipts.length > 0 ? 'completed' : 'pending';
      case 'receipt':
        return receipts.length > 0 ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const activeCount = PIPELINE_STEPS.filter(s => getStepStatus(s.key) === 'completed').length;

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Pipeline Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-blue-950/80 border border-blue-800/80 text-blue-400 rounded">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em] flex items-center gap-2">
              <span>FOUNDER INTENT VISUAL PIPELINE</span>
              <span className="px-2 py-0.5 bg-blue-950/80 border border-blue-700/80 text-blue-300 text-[10px] rounded font-mono">
                {activeCount}/9 STAGES ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Traceable journey from raw founder thought → architectural boundary check → proposal review → external dispatch receipt.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded border border-zinc-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SYSTEM STATE: <strong className="text-zinc-200">ZERO DRIFT MANDATE ACTIVE</strong></span>
        </div>
      </div>

      {/* Horizontal Interactive Visual Pipeline */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center min-w-[980px] gap-1">
          {PIPELINE_STEPS.map((step, idx) => {
            const status = getStepStatus(step.key);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStep(step)}
                  className={`flex-1 p-2.5 rounded-lg border font-mono text-left transition group relative ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-zinc-200 hover:bg-emerald-950/40 hover:border-emerald-500'
                      : isActive
                      ? 'bg-blue-950/40 border-blue-600/80 text-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                      : 'bg-black/30 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider truncate">
                      {step.label}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-zinc-700 shrink-0" />
                    )}
                  </div>

                  <p className="text-[10px] font-sans text-zinc-400 leading-tight line-clamp-1 group-hover:text-zinc-200">
                    {step.subLabel}
                  </p>

                  <div className="mt-2 pt-1 border-t border-zinc-800/50 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                    <span>Stage {step.id}</span>
                    <span className="text-blue-400 group-hover:underline flex items-center gap-0.5">
                      Inspect <Eye className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </button>

                {idx < PIPELINE_STEPS.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-zinc-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Inspector Detail Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#08080a] border border-blue-900/80 rounded-xl max-w-2xl w-full p-5 space-y-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-950 border border-blue-800 text-blue-400 rounded font-mono text-xs font-bold">
                  STAGE 0{selectedStep.id}
                </span>
                <div>
                  <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider">
                    {selectedStep.label} Inspector
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    {selectedStep.subLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-black/60 hover:bg-zinc-800 rounded border border-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stage Detailed Content View */}
            <div className="space-y-4 font-mono text-xs">
              {selectedStep.key === 'idea' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    1. Raw Input Stream Data:
                  </span>
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {lastCompiledIdea ? lastCompiledIdea.rawText : 'No raw intention compiled yet. Go to Idea Stream to submit.'}
                  </div>
                  {lastCompiledIdea?.attachments && lastCompiledIdea.attachments.length > 0 && (
                    <div className="text-[11px] text-cyan-300">
                      Attachments included: {lastCompiledIdea.attachments.map(a => a.name).join(', ')}
                    </div>
                  )}
                </div>
              )}

              {selectedStep.key === 'understanding' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    2. Deconstructed Understanding Facts:
                  </span>
                  {lastCompiledIdea?.understanding ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-black/60 border border-zinc-800 rounded">
                        <strong className="text-blue-400 block mb-1">Observed Facts:</strong>
                        {lastCompiledIdea.understanding.observedFacts.map((f, i) => (
                          <p key={i} className="text-zinc-300 text-[11px]">- {f}</p>
                        ))}
                      </div>
                      <div className="p-2.5 bg-black/60 border border-zinc-800 rounded">
                        <strong className="text-emerald-400 block mb-1">System Goals:</strong>
                        {lastCompiledIdea.understanding.goals.map((g, i) => (
                          <p key={i} className="text-zinc-300 text-[11px]">- {g}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500">Understanding stage waiting for compiled input.</p>
                  )}
                </div>
              )}

              {selectedStep.key === 'mapping' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    3. Architectural Memory & Boundary Audit:
                  </span>
                  {lastCompiledIdea?.architecturalCheck ? (
                    <div className="p-3 bg-black/60 border border-zinc-800 rounded space-y-2">
                      <div className="flex justify-between text-cyan-300 font-bold">
                        <span>Assigned Domain:</span>
                        <span>{lastCompiledIdea.architecturalCheck.belongsTo}</span>
                      </div>
                      <div className="text-zinc-300 text-[11px]">
                        {lastCompiledIdea.architecturalCheck.guidance}
                      </div>
                      {lastCompiledIdea.architecturalCheck.architecturalMemoryFlags.map((flag, i) => (
                        <div key={i} className="p-2 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-amber-200">
                          {flag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500">Memory mapping active. Submit an idea to verify boundaries.</p>
                  )}
                </div>
              )}

              {selectedStep.key === 'selection' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    4. Repository Domain Routing:
                  </span>
                  <div className="p-3 bg-black/60 border border-zinc-800 rounded space-y-1">
                    <span className="text-indigo-300 font-bold block">
                      Target Repo: {lastCompiledIdea?.architecturalCheck?.belongsTo || 'Haunted Toaster'}
                    </span>
                    <p className="text-zinc-400 text-[11px]">
                      Selected based on authority laws across collective repository registry.
                    </p>
                  </div>
                </div>
              )}

              {selectedStep.key === 'proposals' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    5. Generated Proposals ({proposals.length}):
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {proposals.map(p => (
                      <div key={p.id} className="p-2 bg-black/60 border border-zinc-800 rounded flex justify-between items-center text-[11px]">
                        <span className="text-purple-300 font-bold">{p.title}</span>
                        <span className="px-1.5 py-0.5 bg-purple-950 text-purple-200 rounded uppercase">{p.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStep.key === 'review' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    6. Human Approval Queue ({queuedProposals.length}):
                  </span>
                  <p className="text-zinc-400 text-[11px]">
                    Nothing is dispatched automatically. Humans hold explicit authority in this stage before external systems are updated.
                  </p>
                </div>
              )}

              {selectedStep.key === 'dispatch' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    7. Dispatch Payload Execution:
                  </span>
                  <p className="text-zinc-400 text-[11px]">
                    Translates approved proposal items into signed JSON payload streams sent to target targets (GitHub API, AI Studio, Lovable, Bolt, Specs).
                  </p>
                </div>
              )}

              {selectedStep.key === 'execution' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    8. External System Execution:
                  </span>
                  <p className="text-zinc-400 text-[11px]">
                    External repository or model system receives dispatched payload and executes work in feature branch or prompt environment.
                  </p>
                </div>
              )}

              {selectedStep.key === 'receipt' && (
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">
                    9. Execution Receipt Log ({receipts.length}):
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {receipts.map(r => (
                      <div key={r.id} className="p-2 bg-black/60 border border-zinc-800 rounded flex justify-between items-center text-[11px]">
                        <span className="text-emerald-400 font-bold">Receipt #{r.id.substring(r.id.length - 6)}</span>
                        <span className="text-zinc-500">{r.externalResult.receiptHash}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                Stage {selectedStep.id} / 09
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStep(null)}
                  className="px-3 py-1.5 bg-black/60 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded border border-zinc-800 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab(selectedStep.tabTarget);
                    setSelectedStep(null);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded border border-blue-400/50 transition flex items-center gap-1.5"
                >
                  Jump to {selectedStep.tabTarget.toUpperCase()} Console <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
