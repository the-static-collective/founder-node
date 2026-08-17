import React from 'react';
import type { NearbyGrowthEvidence, NearbyGrowthResult } from '../types/nearbyGrowth';

export interface NearbyGrowthPanelProps {
  result: NearbyGrowthResult;
  onChooseDoor?: (projectId: string) => void;
}

const evidenceLabel = (evidence: NearbyGrowthEvidence) => {
  if (evidence.kind === 'shared-invariant') return `invariant: ${evidence.invariantId}`;
  return evidence.direction === 'outbound'
    ? `${evidence.relationType} → ${evidence.targetProjectId}`
    : `${evidence.sourceProjectId} → ${evidence.relationType}`;
};

export const NearbyGrowthPanel: React.FC<NearbyGrowthPanelProps> = ({ result, onChooseDoor }) =>
  React.createElement(
    'section',
    { className: 'bg-[#08080a] border border-zinc-800 rounded-xl p-5 space-y-4' },
    React.createElement('div', null,
      React.createElement('h3', null, 'Evidenced Nearby Growth'),
      React.createElement('p', null, `projects ${result.registryWitness.projects.updated} · invariants ${result.registryWitness.invariants.updated}`)
    ),
    result.doors.length === 0
      ? React.createElement('p', null, 'No evidenced nearby growth yet.')
      : result.doors.map(door => React.createElement(
          'article',
          { key: door.projectId, className: 'border border-zinc-800 rounded-lg p-3 space-y-2' },
          React.createElement('div', null,
            React.createElement('strong', null, door.projectId),
            React.createElement('span', null, ` ${door.status}`),
            React.createElement('p', null, door.repository)
          ),
          React.createElement('div', null,
            door.evidence.map(evidence => React.createElement('span', { key: evidenceLabel(evidence) }, evidenceLabel(evidence)))
          ),
          onChooseDoor
            ? React.createElement('button', { type: 'button', onClick: () => onChooseDoor(door.projectId) }, 'Review this door')
            : null
        ))
  );
