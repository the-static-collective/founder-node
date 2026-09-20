import { compileFounderIntent as compileBase } from './compilerEngine';
import { loadAuthorityRegistryBundle } from '../data/authorityKitRegistry';
import { deriveNearbyGrowth } from './nearbyGrowth';
import { deriveEcosystemComposition } from './ecosystemComposition';
import type { CompileOptions } from './compilerEngine';
import type { CompiledIdea } from '../types/founderNode';

export async function compileFounderIntent(options: CompileOptions): Promise<CompiledIdea> {
  const compiled = await compileBase(options);
  if (compiled.architecturalCheck.routingBlocked) return compiled;

  const registryBundle = await loadAuthorityRegistryBundle();
  const nearbyGrowth = deriveNearbyGrowth({
    routedProjectIds: compiled.understanding.potentialRepositories,
    projects: registryBundle.repositories,
    invariants: registryBundle.invariants,
    registryWitness: registryBundle.witness
  });
  return {
    ...compiled,
    nearbyGrowth,
    ecosystemComposition: deriveEcosystemComposition({
      routedProjectIds: compiled.understanding.potentialRepositories,
      projects: registryBundle.repositories,
      invariants: registryBundle.invariants,
      registryWitness: registryBundle.witness,
      nearbyGrowth
    })
  };
}
