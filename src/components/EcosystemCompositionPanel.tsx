import React from 'react';
import type { EcosystemComposition, FounderIntentWitness } from '../services/ecosystemComposition';
import { createWorkbenchInspectionHandoff } from '../services/ecosystemComposition';

export interface EcosystemCompositionPanelProps {
  composition: EcosystemComposition;
  onRecordIntent?: () => void;
  recordedIntent?: FounderIntentWitness;
  onCopyHandoff?: (value: string) => void;
}

export const EcosystemCompositionPanel: React.FC<EcosystemCompositionPanelProps> = ({
  composition, onRecordIntent, recordedIntent, onCopyHandoff
}) => {
  const draft = composition.draft;
  const handoff = draft ? createWorkbenchInspectionHandoff(draft) : null;
  return (
    <section className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-lg text-zinc-100 font-semibold">Ecosystem Composition · proposal only</h3>
        <p className="text-xs text-zinc-500">The map describes recorded claims; it is not a dependency resolver or an authority grant.</p>
        <p className="text-xs text-zinc-500">Registry witnesses: projects {composition.draft?.registryWitness.projects.updated ?? 'unknown'} · invariants {composition.draft?.registryWitness.invariants.updated ?? 'unknown'}</p>
      </div>
      <div className="border border-zinc-800 rounded-lg p-3">
        <h4 className="text-sm font-semibold">Recorded ecosystem map</h4>
        <p className="text-xs text-zinc-400">{composition.nodes.length} declared project nodes · {composition.edges.length} recorded relation/invariant edges.</p>
        <details className="text-xs text-zinc-400 mt-2">
          <summary className="cursor-pointer">Inspect all declared edges</summary>
          <div className="mt-2 max-h-56 overflow-y-auto space-y-1">
            {composition.edges.map((edge, i) => (
              <p key={i}>{edge.from} → {edge.to} · {edge.kind}: {edge.reference}</p>
            ))}
          </div>
        </details>
      </div>
      {!draft ? (
        <p className="text-sm text-amber-300">No bounded composition proposal: no admitted nearby project with sufficient recorded evidence.</p>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-100">Reviewable project composition</h4>
          <p className="text-xs text-zinc-400">A participant's inclusion denotes a proposal, not an executable integration.</p>
          {draft.participants.map(participant => (
            <div key={participant.projectId} className="border border-zinc-800 rounded-lg p-3">
              <strong className="text-sm text-zinc-200">{participant.projectId}</strong>
              <span className="text-xs text-zinc-500"> · {participant.status}</span>
              <p className="text-xs text-zinc-400">{participant.role}</p>
              <p className="text-xs text-zinc-500">Evidence: {participant.evidence.length ? participant.evidence.map(e => e.kind === 'typed-relation' ? e.relationType : e.invariantId).join(', ') : 'originating routed project'}</p>
              <p className="text-xs text-zinc-500">Owns: {participant.owns.join('; ') || 'not declared'}</p>
              <p className="text-xs text-zinc-500">Does not own: {participant.nonAuthority.join('; ') || 'not declared'}</p>
            </div>
          ))}
          <p className="text-xs text-amber-300">Local readiness: unknown · compatibility: unverified · execution: not authorized.</p>
          {handoff && (
            <button type="button" className="border border-blue-500 rounded px-3 py-2 text-sm text-blue-200" onClick={() => onCopyHandoff?.(JSON.stringify(handoff, null, 2))}>
              Copy Workbench inspection descriptor
            </button>
          )}
          {draft.unknowns.map(item => <p key={item} className="text-xs text-zinc-500">Unresolved: {item}</p>)}
        </div>
      )}
      <div className="border-t border-zinc-800 pt-3 space-y-2">
        <h4 className="text-sm font-semibold text-zinc-100">Founder-intent continuity</h4>
        <p className="text-xs text-zinc-400">Preserve the original words alongside the compiler's interpretation. Browser-local testimony only; it is not signed, canonical, or project authority.</p>
        {recordedIntent ? (
          <p className="text-xs text-emerald-300">This compiled intent has a local witness ({recordedIntent.id}). Any revision requires a new compilation.</p>
        ) : (
          <button type="button" className="border border-zinc-600 rounded px-3 py-2 text-sm" onClick={onRecordIntent}>
            Record this compiled intent locally
          </button>
        )}
      </div>
      {composition.diagnostics.map(d => <p className="text-xs text-amber-300" key={d}>Registry gap: {d}</p>)}
    </section>
  );
};
