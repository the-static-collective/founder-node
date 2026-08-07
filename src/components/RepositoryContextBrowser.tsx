import React, { useState } from 'react';
import { 
  GitBranch, 
  GitPullRequest, 
  CircleDot, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  MapPin
} from 'lucide-react';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';
import { RepositoryId } from '../types/founderNode';

interface RepositoryContextBrowserProps {
  selectedRepoId?: RepositoryId;
  onSelectRepo?: (id: RepositoryId) => void;
}

export const RepositoryContextBrowser: React.FC<RepositoryContextBrowserProps> = ({
  selectedRepoId = 'haunted-toaster',
  onSelectRepo
}) => {
  const [activeId, setActiveId] = useState<RepositoryId>(selectedRepoId);
  const [viewSection, setViewSection] = useState<'readme' | 'laws' | 'issues' | 'prs' | 'commits' | 'roadmap'>('readme');

  const currentRepo = COLLECTIVE_REPOSITORIES.find(r => r.id === activeId) || COLLECTIVE_REPOSITORIES[0];

  const handleRepoClick = (id: RepositoryId) => {
    setActiveId(id);
    if (onSelectRepo) onSelectRepo(id);
  };

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 rounded">
            <GitBranch className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              04 // REPOSITORY CONTEXT REGISTRY
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Auto-loaded context across all nodes in The Static Collective network.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded border border-zinc-800">
          Total Repositories: <strong className="text-zinc-200">{COLLECTIVE_REPOSITORIES.length}</strong>
        </div>
      </div>

      {/* Repo Switcher Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {COLLECTIVE_REPOSITORIES.map(repo => {
          const isActive = repo.id === activeId;
          return (
            <button
              key={repo.id}
              onClick={() => handleRepoClick(repo.id)}
              className={`p-2.5 rounded border text-left font-mono transition flex flex-col justify-between h-20 ${
                isActive
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.25)] font-bold'
                  : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60'
              }`}
            >
              <div className="text-xs font-bold truncate">{repo.name}</div>
              <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                <span>#{repo.openIssues.length} issues</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Repo Detail View */}
      <div className="bg-black/40 border border-zinc-800 rounded-lg p-5 space-y-5">
        {/* Repo Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-mono text-zinc-100 uppercase tracking-wide">
                {currentRepo.name}
              </h3>
              <span className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-700/80 text-indigo-300 text-[10px] font-mono rounded uppercase font-bold">
                {currentRepo.id}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              {currentRepo.description}
            </p>
          </div>

          <div className="p-3 bg-[#08080a] border border-zinc-800 rounded max-w-sm">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block tracking-wider">
              Authority Domain
            </span>
            <span className="text-xs font-mono text-zinc-300 leading-tight block mt-0.5">
              {currentRepo.authorityDomain}
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800/60">
          <button
            onClick={() => setViewSection('readme')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'readme' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            README.md
          </button>

          <button
            onClick={() => setViewSection('laws')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'laws' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Laws ({currentRepo.laws.length})
          </button>

          <button
            onClick={() => setViewSection('issues')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'issues' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            Issues ({currentRepo.openIssues.length})
          </button>

          <button
            onClick={() => setViewSection('prs')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'prs' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
            PRs ({currentRepo.activePRs.length})
          </button>

          <button
            onClick={() => setViewSection('commits')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'commits' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Commits ({currentRepo.recentCommits.length})
          </button>

          <button
            onClick={() => setViewSection('roadmap')}
            className={`px-3 py-1.5 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewSection === 'roadmap' ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Roadmap ({currentRepo.roadmap.length})
          </button>
        </div>

        {/* Section Content */}
        {viewSection === 'readme' && (
          <div className="bg-[#08080a] border border-zinc-800 rounded p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
            {currentRepo.readme}
          </div>
        )}

        {viewSection === 'laws' && (
          <div className="space-y-2">
            {currentRepo.laws.map((law, idx) => (
              <div key={idx} className="p-3 bg-[#08080a] border border-amber-900/40 rounded text-xs font-mono text-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Law #{idx + 1}:</strong> {law}</span>
              </div>
            ))}
          </div>
        )}

        {viewSection === 'issues' && (
          <div className="space-y-2">
            {currentRepo.openIssues.map(issue => (
              <div key={issue.id} className="p-3 bg-[#08080a] border border-zinc-800 rounded text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-400 font-bold">#{issue.id}</span>
                  <span className="text-zinc-200">{issue.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {issue.labels.map((lbl, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[10px] rounded border border-zinc-800 uppercase">
                      {lbl}
                    </span>
                  ))}
                  <span className="text-zinc-500 text-[10px]">{issue.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewSection === 'prs' && (
          <div className="space-y-2">
            {currentRepo.activePRs.length > 0 ? (
              currentRepo.activePRs.map(pr => (
                <div key={pr.id} className="p-3 bg-[#08080a] border border-zinc-800 rounded text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-purple-400" />
                    <span className="text-zinc-400 font-bold">#{pr.id}</span>
                    <span className="text-zinc-200">{pr.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-950/80 text-purple-300 text-[10px] rounded border border-purple-800 uppercase font-bold">
                      {pr.branch}
                    </span>
                    <span className="text-zinc-500 text-[10px]">by @{pr.author}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs font-mono text-zinc-500 p-4 text-center">
                No active pull requests open for {currentRepo.name}.
              </div>
            )}
          </div>
        )}

        {viewSection === 'commits' && (
          <div className="space-y-2">
            {currentRepo.recentCommits.map((cm, idx) => (
              <div key={idx} className="p-3 bg-[#08080a] border border-zinc-800 rounded text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-zinc-900 text-cyan-400 rounded text-[10px] font-bold border border-zinc-800">
                    {cm.hash}
                  </span>
                  <span className="text-zinc-200">{cm.message}</span>
                </div>
                <div className="text-zinc-500 text-[10px]">
                  {cm.author} • {cm.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewSection === 'roadmap' && (
          <div className="space-y-2">
            {currentRepo.roadmap.map((step, idx) => (
              <div key={idx} className="p-3 bg-[#08080a] border border-zinc-800 rounded text-xs font-mono flex items-center gap-2.5 text-zinc-200">
                <span className="w-5 h-5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
