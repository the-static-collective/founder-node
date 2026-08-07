import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const AUTHORITY_REGISTRY_URL =
  'https://raw.githubusercontent.com/the-static-collective/jubilee-authority-kit/main/registry/projects.json';

interface RegistryProject {
  id: string;
  repository: string;
  kind: string;
  status: string;
  role: string;
  owns: string[];
  nonAuthority: string[];
}

async function loadAuthorityContext(): Promise<string> {
  const response = await fetch(AUTHORITY_REGISTRY_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Authority Kit registry unavailable: HTTP ${response.status}`);
  const registry = await response.json() as { projects?: RegistryProject[] };
  if (!Array.isArray(registry.projects)) throw new Error('Authority Kit registry is malformed.');

  return registry.projects.map(project => [
    `${project.id} (${project.repository})`,
    `kind=${project.kind}`,
    `status=${project.status}`,
    `role=${project.role}`,
    `owns=[${project.owns.join('; ')}]`,
    `nonAuthority=[${project.nonAuthority.join('; ')}]`
  ].join(' | ')).join('\n');
}

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/compile-intent' || req.method !== 'POST') {
          next();
          return;
        }

        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk; });
        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyStr || '{}');
            const rawText = body.rawText || '';
            const selectedTargetRepos = Array.isArray(body.selectedTargetRepos) ? body.selectedTargetRepos : [];
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'fallback', message: 'No GEMINI_API_KEY found, using local compiler' }));
              return;
            }

            const authorityContext = await loadAuthorityContext();
            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
            });

            const prompt = `You are the Founder Intent Compiler for The Static Collective.
Founder Node is proposal authority only. The Jubilee Authority Kit registry below is descriptive routing evidence; it does not own the laws it indexes.

Hard routing rules:
- Never assign a repository a capability listed in its nonAuthority array.
- Treat status=ancestor, status=monument, or kind=lineage-ancestor as historical by default; do not route new work there unless the founder explicitly requests revival.
- Ownership stays with the repository declaring the relevant owns capability.
- Do not invent repository roles that contradict this registry.

Authority Kit registry:
${authorityContext}

Selected targets after deterministic client-side routing:
${selectedTargetRepos.join(', ') || '(none)'}

Founder intent:
"${rawText}"

Return structured JSON with:
1. understanding: observedFacts, goals, constraints, unknowns, potentialRepositories, dependencies, risks, suggestedSlice.
2. architecturalCheck: belongsTo, isNewWork, isAlreadySolved, isDuplicated, existingIssue, authorityConflicts, dependenciesAndBlockers, guidance, architecturalMemoryFlags.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    understanding: {
                      type: Type.OBJECT,
                      properties: {
                        observedFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                        goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                        constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                        unknowns: { type: Type.ARRAY, items: { type: Type.STRING } },
                        potentialRepositories: { type: Type.ARRAY, items: { type: Type.STRING } },
                        dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestedSlice: { type: Type.STRING }
                      },
                      required: ['observedFacts', 'goals', 'constraints', 'unknowns', 'potentialRepositories', 'dependencies', 'risks', 'suggestedSlice']
                    },
                    architecturalCheck: {
                      type: Type.OBJECT,
                      properties: {
                        belongsTo: { type: Type.STRING },
                        isNewWork: { type: Type.BOOLEAN },
                        isAlreadySolved: { type: Type.BOOLEAN },
                        isDuplicated: { type: Type.BOOLEAN },
                        existingIssue: { type: Type.STRING },
                        authorityConflicts: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              repository: { type: Type.STRING },
                              conflictReason: { type: Type.STRING },
                              severity: { type: Type.STRING }
                            },
                            required: ['repository', 'conflictReason', 'severity']
                          }
                        },
                        dependenciesAndBlockers: { type: Type.ARRAY, items: { type: Type.STRING } },
                        guidance: { type: Type.STRING },
                        architecturalMemoryFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ['belongsTo', 'isNewWork', 'isAlreadySolved', 'isDuplicated', 'authorityConflicts', 'dependenciesAndBlockers', 'guidance', 'architecturalMemoryFlags']
                    }
                  },
                  required: ['understanding', 'architecturalCheck']
                }
              }
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(response.text);
          } catch (err) {
            console.error('Error in /api/compile-intent:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'error', message: String(err) }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), expressApiPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }
  },
  build: {
    target: 'esnext'
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  }
}));
