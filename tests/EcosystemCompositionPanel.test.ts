import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EcosystemCompositionPanel } from '../src/components/EcosystemCompositionPanel';
import { deriveNearbyGrowth } from '../src/services/nearbyGrowth';
import { deriveEcosystemComposition } from '../src/services/ecosystemComposition';
import { projects, invariants, witness } from './fixtures/authorityRegistry';

test('renders proposal and manual descriptor without alleging actual execution', () => {
  const nearbyGrowth = deriveNearbyGrowth({
    routedProjectIds: ['corpus-os'], projects, invariants, registryWitness: witness
  });
  const composition = deriveEcosystemComposition({
    routedProjectIds: ['corpus-os'], projects, invariants, nearbyGrowth, registryWitness: witness
  });
  const markup = renderToStaticMarkup(React.createElement(EcosystemCompositionPanel, {
    composition,
    onCopyHandoff: () => {},
    onRecordIntent: () => {}
  }));
  assert.match(markup, /Ecosystem Composition/);
  assert.match(markup, /proposal only/);
  assert.match(markup, /Copy Workbench inspection descriptor/);
  assert.match(markup, /Local readiness: unknown/);
  assert.match(markup, /not authorized/);
  assert.match(markup, /Record this compiled intent locally/);
  assert.doesNotMatch(markup, /Execute composition/);
});

test('renders a legitimate no-evidence empty state without a Workbench handoff', () => {
  const composition = deriveEcosystemComposition({
    routedProjectIds: [], projects, invariants, registryWitness: witness,
    nearbyGrowth: { doors: [], diagnostics: [], registryWitness: witness }
  });
  const markup = renderToStaticMarkup(React.createElement(EcosystemCompositionPanel, { composition }));
  assert.match(markup, /No bounded composition proposal/);
  assert.doesNotMatch(markup, /Copy Workbench inspection descriptor/);
});
