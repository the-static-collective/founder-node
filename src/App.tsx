import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandBridgeOverview } from './components/CommandBridgeOverview';
import { IdeaStream } from './components/IdeaStream';
import { UnderstandingPanel } from './components/UnderstandingPanel';
import { ArchitecturalMemoryPanel } from './components/ArchitecturalMemoryPanel';
import { RepositoryContextBrowser } from './components/RepositoryContextBrowser';
import { ProposalGenerator } from './components/ProposalGenerator';
import { DispatchQueue } from './components/DispatchQueue';
import { ExecutionReceipts } from './components/ExecutionReceipts';
import { ArchitecturalRulesModal } from './components/ArchitecturalRulesModal';

import {
  CompiledIdea,
  Proposal,
  DispatchReceipt,
  Attachment,
  ProposalType,
  RepositoryId
} from './types/founderNode';
import { compileFounderIntent } from './services/compilerEngine';

const STORAGE_KEY_IDEAS = 'founder_node_ideas_v1';
const STORAGE_KEY_PROPOSALS = 'founder_node_proposals_v1';
const STORAGE_KEY_QUEUE = 'founder_node_queue_v1';
const STORAGE_KEY_RECEIPTS = 'founder_node_receipts_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'bridge' | 'idea' | 'memory' | 'repos' | 'proposals' | 'dispatch' | 'receipts'
  >('bridge');

  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);

  const [lastCompiledIdea, setLastCompiledIdea] = useState<CompiledIdea | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IDEAS);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [queuedProposals, setQueuedProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [receipts, setReceipts] = useState<DispatchReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  useEffect(() => {
    if (lastCompiledIdea) {
      localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(lastCompiledIdea));
    }
  }, [lastCompiledIdea]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queuedProposals));
  }, [queuedProposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  const handleCompile = async (
    rawText: string,
    attachments: Attachment[],
    proposalTypes: ProposalType[],
    selectedRepos: RepositoryId[]
  ) => {
    setIsCompiling(true);

    try {
      const compiled = await compileFounderIntent({
        rawText,
        attachments,
        requestedProposalTypes: proposalTypes,
        selectedTargetRepos: selectedRepos,
        architecturalMemoryEnabled: memoryEnabled
      });

      setLastCompiledIdea(compiled);

      if (compiled.architecturalCheck.routingBlocked) {
        const reason = compiled.architecturalCheck.authorityConflicts[0]?.conflictReason
          || compiled.architecturalCheck.guidance
          || 'Authority Kit registry blocked this route.';
        showToast(`Routing blocked: ${reason}`);
        setActiveTab('memory');
        return;
      }

      setProposals(prev => [...compiled.proposals, ...prev]);
      showToast(`Compiled intent into ${compiled.proposals.length} proposal(s) inside declared authority boundaries.`);
      setActiveTab('proposals');
    } catch (err) {
      console.error('Compilation error:', err);
      const message = err instanceof Error ? err.message : String(err);
      showToast(`Compilation failed: ${message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleQuickCompileSample = (sampleText: string) => {
    handleCompile(
      sampleText,
      [],
      ['github_issue', 'specification', 'aistudio_prompt'],
      []
    );
  };

  const handleQueueForDispatch = (proposal: Proposal) => {
    if (queuedProposals.some(p => p.id === proposal.id)) {
      showToast('Proposal is already in Dispatch Queue.');
      return;
    }

    const updatedProposal: Proposal = { ...proposal, status: 'queued' };
    setQueuedProposals(prev => [updatedProposal, ...prev]);
    setProposals(prev => prev.map(p => p.id === proposal.id ? updatedProposal : p));
    showToast(`Queued "${proposal.title.substring(0, 30)}..." for Founder review.`);
  };

  const handleUpdateProposal = (updated: Proposal) => {
    setProposals(prev => prev.map(p => p.id === updated.id ? updated : p));
    setQueuedProposals(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
    setQueuedProposals(prev => prev.filter(p => p.id !== id));
    showToast('Proposal removed.');
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueuedProposals(prev => prev.filter(p => p.id !== id));
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'draft' } : p));
    showToast('Removed proposal from Dispatch Queue.');
  };

  const handleClearQueue = () => {
    setQueuedProposals([]);
    showToast('Dispatch Queue cleared.');
  };

  const handleClearReceipts = () => {
    setReceipts([]);
    localStorage.removeItem(STORAGE_KEY_RECEIPTS);
    showToast('Receipts log cleared.');
  };

  const handleApproveAndDispatch = (proposalsToDispatch: Proposal[]) => {
    const now = new Date().toISOString();

    const newReceipts: DispatchReceipt[] = proposalsToDispatch.map(prop => {
      const receiptHash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      return {
        id: `rcpt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        proposalId: prop.id,
        ideaRaw: lastCompiledIdea?.rawText || prop.title,
        ideaSummary: lastCompiledIdea?.rawText.substring(0, 90) || prop.title,
        interpretationSummary: prop.summary,
        proposalType: prop.type,
        targetRepo: prop.targetRepo,
        dispatchTarget: prop.dispatchTarget,
        approvedBy: 'Founder',
        approvedAt: now,
        dispatchedAt: now,
        externalResult: {
          status: 'simulated_success',
          payloadSummary: `Dispatched payload successfully to ${prop.dispatchTarget.toUpperCase()} endpoint. External state updated.`,
          referenceUrl: prop.dispatchTarget === 'github' ? `https://github.com/the-static-collective/${prop.targetRepo}` : undefined,
          receiptHash
        }
      };
    });

    setReceipts(prev => [...newReceipts, ...prev]);

    const dispatchedIds = proposalsToDispatch.map(p => p.id);
    setProposals(prev => prev.map(p => dispatchedIds.includes(p.id) ? { ...p, status: 'dispatched' } : p));
    setQueuedProposals(prev => prev.filter(p => !dispatchedIds.includes(p.id)));

    showToast(`Approved & Dispatched ${proposalsToDispatch.length} proposal(s). Receipts recorded.`);
    setActiveTab('receipts');
  };

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-300 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dispatchCount={queuedProposals.length}
        receiptsCount={receipts.length}
        memoryEnabled={memoryEnabled}
        setMemoryEnabled={setMemoryEnabled}
        onOpenRulesModal={() => setIsRulesModalOpen(true)}
      />

      {toastMessage && (
        <div className="fixed bottom-20 right-5 z-50 max-w-xl px-4 py-3 bg-[#08080a] border border-blue-500/80 text-blue-300 text-xs font-mono rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {activeTab === 'bridge' && (
          <CommandBridgeOverview
            lastCompiledIdea={lastCompiledIdea}
            proposals={proposals}
            queuedProposals={queuedProposals}
            receipts={receipts}
            memoryEnabled={memoryEnabled}
            onNavigateTab={setActiveTab}
            onQuickCompileSample={handleQuickCompileSample}
          />
        )}

        {activeTab === 'idea' && (
          <div className="space-y-8">
            <IdeaStream
              onCompile={handleCompile}
              isCompiling={isCompiling}
            />

            {lastCompiledIdea && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UnderstandingPanel understanding={lastCompiledIdea.understanding} />
                <ArchitecturalMemoryPanel
                  checkResult={lastCompiledIdea.architecturalCheck}
                  memoryEnabled={memoryEnabled}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-6">
            <ArchitecturalMemoryPanel
              checkResult={lastCompiledIdea?.architecturalCheck || null}
              memoryEnabled={memoryEnabled}
            />
            {lastCompiledIdea && (
              <UnderstandingPanel understanding={lastCompiledIdea.understanding} />
            )}
          </div>
        )}

        {activeTab === 'repos' && (
          <RepositoryContextBrowser />
        )}

        {activeTab === 'proposals' && (
          <ProposalGenerator
            proposals={proposals}
            onQueueForDispatch={handleQueueForDispatch}
            onUpdateProposal={handleUpdateProposal}
            onDeleteProposal={handleDeleteProposal}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchQueue
            queuedProposals={queuedProposals}
            onApproveAndDispatch={handleApproveAndDispatch}
            onRemoveFromQueue={handleRemoveFromQueue}
            onClearQueue={handleClearQueue}
          />
        )}

        {activeTab === 'receipts' && (
          <ExecutionReceipts
            receipts={receipts}
            onClearReceipts={handleClearReceipts}
          />
        )}
      </main>

      <ArchitecturalRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <footer className="border-t border-zinc-800 bg-black/80 backdrop-blur-md py-3 px-6 text-xs font-mono text-zinc-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto max-w-full">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">AUTHORITY SOURCE:</span>
          <div className="h-7 px-2.5 bg-[#08080a] border border-zinc-800 rounded flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span className="text-[11px] text-zinc-300">jubilee-authority-kit / registry/projects.json</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] text-zinc-500">
          <div className="hidden sm:block text-zinc-600">PROPOSAL AUTHORITY ONLY</div>
        </div>
      </footer>
    </div>
  );
}
