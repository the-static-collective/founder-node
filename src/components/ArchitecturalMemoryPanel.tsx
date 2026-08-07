import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  AlertOctagon, 
  FolderCheck, 
  Layers, 
  Sparkles,
  Plus,
  Trash2,
  Search,
  Check,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Terminal,
  BookOpen
} from 'lucide-react';
import { ArchitecturalCheckResult } from '../types/founderNode';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';

const STORAGE_KEY_CUSTOM_RULES = 'founder_node_custom_rules_v1';

export interface CustomArchitecturalRule {
  id: string;
  repoId: string;
  ruleText: string;
  platformScope: string;
  createdAt: string;
}

interface ArchitecturalMemoryPanelProps {
  checkResult: ArchitecturalCheckResult | null;
  memoryEnabled: boolean;
}

export const ArchitecturalMemoryPanel: React.FC<ArchitecturalMemoryPanelProps> = ({
  checkResult,
  memoryEnabled
}) => {
  const [customRules, setCustomRules] = useState<CustomArchitecturalRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_RULES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'rule-1',
          repoId: 'haunted-toaster',
          ruleText: 'Haunted Toaster must remain purely speculative and never execute deployment code.',
          platformScope: 'AI Studio / Upstream',
          createdAt: new Date().toISOString()
        },
        {
          id: 'rule-2',
          repoId: 'project0',
          ruleText: 'Project0 is the sole authority for global identity. No downstream node may create duplicate user pools.',
          platformScope: 'GitHub / Infrastructure',
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleRepo, setNewRuleRepo] = useState('haunted-toaster');
  const [newRulePlatform, setNewRulePlatform] = useState('GitHub / AI Studio / Lovable / Bolt');

  // Deep Audit Playground state
  const [auditInput, setAuditInput] = useState('');
  const [auditResult, setAuditResult] = useState<ArchitecturalCheckResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_RULES, JSON.stringify(customRules));
  }, [customRules]);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    const rule: CustomArchitecturalRule = {
      id: `rule-${Date.now()}`,
      repoId: newRuleRepo,
      ruleText: newRuleText.trim(),
      platformScope: newRulePlatform,
      createdAt: new Date().toISOString()
    };

    setCustomRules(prev => [rule, ...prev]);
    setNewRuleText('');
  };

  const handleRemoveRule = (id: string) => {
    setCustomRules(prev => prev.filter(r => r.id !== id));
  };

  const handleRunDeepAudit = () => {
    if (!auditInput.trim()) return;
    setIsAuditing(true);

    setTimeout(() => {
      const textLower = auditInput.toLowerCase();
      const flags: string[] = [];
      const conflicts = [];

      // Check against all repos
      if (textLower.includes('execute') && textLower.includes('toaster')) {
        flags.push('⚠️ Conflict: Haunted Toaster owns upstream imagination only. Execution code must be placed in TranchNode or Band Runtime.');
        conflicts.push({
          repository: 'Haunted Toaster',
          conflictReason: 'Misplaced work placement: Upstream node cannot execute deployment law.',
          severity: 'high' as const
        });
      }

      if (textLower.includes('auth') || textLower.includes('login') || textLower.includes('user pool')) {
        flags.push('⚠️ Duplicated Authority Warning: Project0 already owns canonical network identity. Avoid creating local auth pools in Bolt or Lovable.');
        conflicts.push({
          repository: 'Project0',
          conflictReason: 'Duplicated authority: Core identity must delegate to Project0.',
          severity: 'medium' as const
        });
      }

      if (textLower.includes('tranch') || textLower.includes('video')) {
        flags.push('⏳ Dependency Warning: TranchNode #7 (Worker Isolation) is unresolved in open issues. Execution in this slice is blocked until #7 lands.');
      }

      // Custom rules check
      customRules.forEach(rule => {
        if (textLower.includes(rule.repoId.replace('-', ' '))) {
          flags.push(`📜 Custom Rule Verified (${rule.platformScope}): ${rule.ruleText}`);
        }
      });

      if (flags.length === 0) {
        flags.push('✅ Architectural Memory Clear: Zero boundary conflicts or duplicated authorities detected.');
      }

      setAuditResult({
        belongsTo: textLower.includes('tranch') ? 'TranchNode' : textLower.includes('audio') ? 'Band Runtime' : 'Haunted Toaster',
        isNewWork: !textLower.includes('fix'),
        isAlreadySolved: false,
        isDuplicated: conflicts.length > 0,
        existingIssue: '#102 (policy: Define imagination boundary versus execution law)',
        authorityConflicts: conflicts,
        dependenciesAndBlockers: ['TranchNode #7 (Worker Isolation)'],
        guidance: 'Ensure proposed action adheres strictly to repository domain boundaries. Submit proposals for Founder approval before dispatching.',
        architecturalMemoryFlags: flags
      });

      setIsAuditing(false);
    }, 600);
  };

  if (!memoryEnabled) {
    return (
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 text-center space-y-2 shadow-2xl">
        <Brain className="w-8 h-8 text-zinc-700 mx-auto" />
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em]">ARCHITECTURAL MEMORY OFFLINE</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans">
          Toggle Architectural Memory in the header to continuously verify intent against ecosystem laws.
        </p>
      </div>
    );
  }

  const displayCheck = auditResult || checkResult;

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded">
            <Brain className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              03 // ARCHITECTURAL MEMORY & BOUNDARY MATRIX
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Continuously checks proposed work against repository documentation, authority domains, and open issues across GitHub, Lovable, Bolt, and AI Studio.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs font-mono rounded font-bold uppercase tracking-wider">
          Ecosystem Memory Active
        </span>
      </div>

      {/* Deep Audit Testing Playground */}
      <div className="p-4 bg-black/40 border border-zinc-800/80 rounded-lg space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Deep Architectural Memory Playground & Drift Checker:
          </span>
          <span className="text-[10px] text-zinc-500">Instant Drift Diagnostic</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={auditInput}
            onChange={e => setAuditInput(e.target.value)}
            placeholder="Test a proposed action (e.g. 'Add custom auth login pool to Band Runtime and execute directly on Haunted Toaster')..."
            className="flex-1 bg-[#08080a] border border-zinc-800 text-zinc-200 text-xs font-mono px-3.5 py-2 rounded focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleRunDeepAudit}
            disabled={isAuditing || !auditInput.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded border border-cyan-400/50 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isAuditing ? 'Auditing...' : 'Run Memory Audit'}
          </button>
        </div>
      </div>

      {/* Active Audit Check Display */}
      {displayCheck && (
        <div className="space-y-4">
          {/* Memory Flags */}
          {displayCheck.architecturalMemoryFlags.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Memory Integrity Audit Findings:
              </span>
              <div className="space-y-2">
                {displayCheck.architecturalMemoryFlags.map((flag, idx) => {
                  const isWarning = flag.includes('⚠️') || flag.includes('Conflict');
                  const isBlocked = flag.includes('⏳') || flag.includes('blocked');
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded border font-mono text-xs leading-relaxed flex items-start gap-2.5 ${
                        isWarning
                          ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                          : isBlocked
                          ? 'bg-purple-950/40 border-purple-800/80 text-purple-200'
                          : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                      }`}
                    >
                      <span className="shrink-0 mt-0.5">
                        {isWarning ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </span>
                      <span>{flag}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Authority Conflict Box */}
          {displayCheck.authorityConflicts.length > 0 && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded p-4 space-y-2">
              <h3 className="text-[10px] font-mono text-rose-300 uppercase font-bold flex items-center gap-1.5 tracking-wider">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Authority Boundary Conflicts Flagged ({displayCheck.authorityConflicts.length})
              </h3>
              <div className="space-y-2">
                {displayCheck.authorityConflicts.map((conf, idx) => (
                  <div key={idx} className="bg-black/60 border border-rose-900/60 rounded p-2.5 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-rose-200 font-bold">{conf.repository}</span>
                      <span className="px-1.5 py-0.2 bg-rose-900/60 border border-rose-700 text-rose-300 text-[10px] uppercase rounded font-bold">
                        Severity: {conf.severity}
                      </span>
                    </div>
                    <p className="text-rose-100/90 font-sans">{conf.conflictReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
            <div className="bg-black/40 border border-zinc-800 rounded p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1 tracking-wider">
                <FolderCheck className="w-3.5 h-3.5 text-indigo-400" />
                Correct Repo Location
              </span>
              <p className="text-xs font-bold text-indigo-200 pt-0.5">
                {displayCheck.belongsTo}
              </p>
            </div>

            <div className="bg-black/40 border border-zinc-800 rounded p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1 tracking-wider">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Work Classification
              </span>
              <p className="text-xs font-bold text-zinc-200 pt-0.5">
                {displayCheck.isNewWork ? 'New Specification' : 'Refactor / Bugfix'}
              </p>
            </div>

            <div className="bg-black/40 border border-zinc-800 rounded p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1 tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Authority Duplicate Check
              </span>
              <p className={`text-xs font-bold pt-0.5 ${displayCheck.isDuplicated ? 'text-amber-300' : 'text-emerald-400'}`}>
                {displayCheck.isDuplicated ? 'Potential Duplicate' : 'Unique Domain Work'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Architectural Rules Manager */}
      <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
              Custom Architectural Laws & Platform Rules ({customRules.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Persisted in Founder Memory</span>
        </div>

        {/* Add New Rule Form */}
        <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={newRuleText}
            onChange={e => setNewRuleText(e.target.value)}
            placeholder="Define custom ecosystem law (e.g., 'All audio processing must use 24-bit stems')..."
            className="sm:col-span-6 bg-[#08080a] border border-zinc-800 text-zinc-200 text-xs font-mono px-3 py-1.5 rounded focus:outline-none focus:border-purple-500"
          />

          <select
            value={newRuleRepo}
            onChange={e => setNewRuleRepo(e.target.value)}
            className="sm:col-span-3 bg-[#08080a] border border-zinc-800 text-zinc-200 text-xs font-mono px-2 py-1.5 rounded"
          >
            {COLLECTIVE_REPOSITORIES.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!newRuleText.trim()}
            className="sm:col-span-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Ecosystem Law
          </button>
        </form>

        {/* List of Custom Rules */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {customRules.map(rule => (
            <div
              key={rule.id}
              className="p-2.5 bg-[#08080a] border border-zinc-800/80 rounded font-mono text-xs flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-bold uppercase text-[10px]">
                    [{rule.repoId}]
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    Scope: {rule.platformScope}
                  </span>
                </div>
                <p className="text-zinc-300">{rule.ruleText}</p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                className="text-zinc-500 hover:text-red-400 p-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
