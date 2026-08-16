import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NearbyGrowthPanel } from '../src/components/NearbyGrowthPanel';
import { witness } from './fixtures/authorityRegistry';

test('renders legitimate empty state with observed registry provenance', () => {
  const markup = renderToStaticMarkup(React.createElement(NearbyGrowthPanel, {
    result: { doors: [], registryWitness: witness, diagnostics: [] }
  }));
  assert.match(markup, /Evidenced Nearby Growth/);
  assert.match(markup, /No evidenced nearby growth yet\./);
  assert.match(markup, /projects 2026-08-09/);
  assert.match(markup, /invariants 2026-08-07/);
});

test('renders evidence-bearing door without dispatch authority copy', () => {
  const result = {
    doors: [{
      projectId: 'tranchnode',
      repository: 'the-static-collective/tranchnode',
      role: 'custody',
      status: 'active' as const,
      evidence: [
        {
          kind: 'typed-relation' as const,
          relationType: 'DEPENDS_ON',
          direction: 'outbound' as const,
          sourceProjectId: 'corpus-os',
          targetProjectId: 'tranchnode'
        },
        {
          kind: 'shared-invariant' as const,
          invariantId: 'immutable-source',
          ownerProjectId: 'tranchnode',
          proofRefs: []
        }
      ]
    }],
    registryWitness: witness,
    diagnostics: []
  };
  const markup = renderToStaticMarkup(React.createElement(NearbyGrowthPanel, { result }));
  assert.match(markup, /tranchnode/);
  assert.match(markup, /active/);
  assert.match(markup, /DEPENDS_ON → tranchnode/);
  assert.match(markup, /invariant: immutable-source/);
  assert.doesNotMatch(markup, /dispatch/i);
  assert.doesNotMatch(markup, /approve/i);
  assert.doesNotMatch(markup, /create issue/i);
});
