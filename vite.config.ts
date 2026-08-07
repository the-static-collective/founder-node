import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/compile-intent' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const rawText = body.rawText || '';
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'fallback', message: 'No GEMINI_API_KEY found, using local compiler' }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const prompt = `You are the Founder Intent Compiler and Architectural Partner for "The Static Collective".
The user is the Founder. The app is proposal authority ONLY (never executes directly).
Ecosystem repositories:
- Haunted Toaster (Upstream imagination engine only, never owns execution law)
- Band Runtime (Audio & musical event execution runtime)
- TranchNode (Micro-node slice execution engine, worker isolation in Tranch #7)
- Project0 (Canonical identity, key registry, & root governance authority)
- Toaster Lab (Experimental UI sandbox)
- TranchNOSE (Telemetry sensory monitor)
- reCOreturn (Continuous feedback loop & return state processor)

Analyze this raw Founder Intent:
"${rawText}"

Generate a structured JSON response containing:
1. understanding: {
    observedFacts: string[],
    goals: string[],
    constraints: string[],
    unknowns: string[],
    potentialRepositories: string[],
    dependencies: string[],
    risks: string[],
    suggestedSlice: string
  }
2. architecturalCheck: {
    belongsTo: string,
    isNewWork: boolean,
    isAlreadySolved: boolean,
    isDuplicated: boolean,
    existingIssue: string or null,
    authorityConflicts: Array<{ repository: string, conflictReason: string, severity: "high"|"medium"|"low" }>,
    dependenciesAndBlockers: string[],
    guidance: string,
    architecturalMemoryFlags: string[]
  }`;

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

              const resultText = response.text;
              res.setHeader('Content-Type', 'application/json');
              res.end(resultText);
            } catch (err) {
              console.error('Error in /api/compile-intent:', err);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'error', message: String(err) }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
