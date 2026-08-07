import { loadCollectiveRepositories } from './authorityKitRegistry';

/**
 * Live repository context from Jubilee Authority Kit.
 *
 * Module evaluation intentionally waits for the registry. Founder Node should
 * fail visibly rather than silently fall back to stale local authority claims.
 */
export const COLLECTIVE_REPOSITORIES = await loadCollectiveRepositories();
