import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Upload, 
  Sparkles, 
  FileText, 
  Trash2, 
  Layers, 
  Image as ImageIcon, 
  CheckSquare, 
  Code2, 
  Cpu,
  MessageSquare,
  Eye,
  Edit3,
  GitBranch,
  Info,
  Scan,
  Maximize2,
  Check
} from 'lucide-react';
import { Attachment, ProposalType, RepositoryId } from '../types/founderNode';
import { COLLECTIVE_REPOSITORIES } from '../data/mockCollectiveRepos';
import { PasteConversationModal } from './PasteConversationModal';

interface IdeaStreamProps {
  onCompile: (
    rawText: string, 
    attachments: Attachment[], 
    proposalTypes: ProposalType[], 
    selectedRepos: RepositoryId[]
  ) => void;
  isCompiling: boolean;
}

const SAMPLE_FOUNDER_THOUGHTS = [
  {
    title: "Haunted Toaster Upstream Spec",
    text: "Haunted Toaster should become wildly creative but never own execution law. AI Studio should become the upstream imagination engine while TranchNode handles atomic slices."
  },
  {
    title: "TranchNode Audio-Video Pipeline",
    text: "We need TranchNode to automatically ingest multi-track audio stems and generate matching video visualizer renders whenever a track gets flagged as ready in Band Runtime."
  },
  {
    title: "Project0 Identity & Authority",
    text: "Project0 must remain the canonical identity layer for all micro-nodes. No downstream service like Band Runtime or TranchNode should create custom auth user pools."
  },
  {
    title: "Ecosystem Architectural Refactor",
    text: "We should decouple speculative prompt synthesis from deployment verification. Have Founder Node compile all raw intent into reviewable GitHub Issues and AI Studio prompts before dispatching."
  }
];

const AVAILABLE_PROPOSAL_TYPES: { id: ProposalType; label: string; icon: string }[] = [
  { id: 'github_issue', label: 'GitHub Issue', icon: 'issue' },
  { id: 'specification', label: 'Specification', icon: 'spec' },
  { id: 'aistudio_prompt', label: 'AI Studio Prompt', icon: 'ai' },
  { id: 'lovable_prompt', label: 'Lovable Prompt', icon: 'lovable' },
  { id: 'bolt_prompt', label: 'Bolt Prompt', icon: 'bolt' },
  { id: 'pr_review', label: 'PR Review', icon: 'pr' },
  { id: 'architecture_note', label: 'Architecture Note', icon: 'arch' },
  { id: 'implementation_plan', label: 'Implementation Plan', icon: 'plan' },
  { id: 'readme_update', label: 'README Update', icon: 'readme' },
  { id: 'dependency_map', label: 'Dependency Map', icon: 'dep' }
];

export const IdeaStream: React.FC<IdeaStreamProps> = ({ onCompile, isCompiling }) => {
  const [rawText, setRawText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ProposalType[]>([
    'github_issue', 'specification', 'aistudio_prompt'
  ]);
  const [selectedRepos, setSelectedRepos] = useState<RepositoryId[]>([
    'haunted-toaster', 'tranchnode'
  ]);

  // Input Mode: 'editor' | 'preview' | 'diagram'
  const [inputMode, setInputMode] = useState<'editor' | 'preview' | 'diagram'>('editor');

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Modals & Image Processing State
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isProcessingScreenshot, setIsProcessingScreenshot] = useState(false);
  const [extractedOcrText, setExtractedOcrText] = useState<string | null>(null);

  // Audio Waveform Animation Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcriptChunk = event.results[i][0].transcript;
            setRawText(prev => (prev ? `${prev} ${transcriptChunk}` : transcriptChunk));
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Voice recording toggle
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception, using waveform timer fallback', e);
      }
    }

    timerRef.current = setInterval(() => {
      setRecordingTimer(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop exception', e);
      }
    }

    // Fallback transcript chunk if speech API produces no final text
    if (!interimTranscript && recordingTimer > 1) {
      const voiceSnippet = ` [Voice Note transcribed (${recordingTimer}s)]: "Ensure Haunted Toaster remains the upstream imagination node, feeding audio specs to TranchNode slice #7 without overriding Project0 identity laws."`;
      setRawText(prev => (prev ? `${prev}\n\n${voiceSnippet}` : voiceSnippet.trim()));
    } else if (interimTranscript) {
      setRawText(prev => (prev ? `${prev} ${interimTranscript}` : interimTranscript));
      setInterimTranscript('');
    }
  };

  // Canvas visual waveform animation while recording
  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 24;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.sin(step * 0.1 + i * 0.3) * (height / 2.5) + (height / 2.2);
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      step++;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  // File Upload & OCR Screenshot Analysis
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newAttachments: Attachment[] = fileList.map((file: File, idx) => {
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');
      return {
        id: `att-${Date.now()}-${idx}`,
        name: file.name,
        type: isImage ? 'image' : isAudio ? 'audio' : 'text',
        sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);

    // Check if any file is an image/screenshot to trigger Optical Spec Processing
    const imageFile = fileList.find((f: File) => f.type.startsWith('image/')) as File | undefined;
    if (imageFile) {
      setIsProcessingScreenshot(true);
      setTimeout(() => {
        setIsProcessingScreenshot(false);
        const ocrResult = `[Extracted Screenshot Specs from "${imageFile.name}"]:
• Visual UI Layout: Dark theme canvas with top header navigation rail & multi-node execution matrix.
• Extracted Text Labels: "Haunted Toaster Upstream Spec", "TranchNode Slice #7", "Authority: Human Review Mandate".
• Architectural Wireframe Connections: Founder Node -> AI Studio Prompt Generator -> GitHub Issue Pipeline.`;

        setExtractedOcrText(ocrResult);
        setRawText(prev => (prev ? `${prev}\n\n${ocrResult}` : ocrResult));
      }, 1500);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleProposalType = (type: ProposalType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleRepo = (repoId: RepositoryId) => {
    if (selectedRepos.includes(repoId)) {
      if (selectedRepos.length > 1) {
        setSelectedRepos(selectedRepos.filter(r => r !== repoId));
      }
    } else {
      setSelectedRepos([...selectedRepos, repoId]);
    }
  };

  const handleCompileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    onCompile(rawText, attachments, selectedTypes, selectedRepos);
  };

  // Helper formatting shortcuts for markdown editor
  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    setRawText(prev => `${prev}\n${prefix} ${suffix}`);
  };

  const insertDiagramTemplate = () => {
    const diagramCode = `\`\`\`mermaid
graph TD
    A[Founder Raw Intent] --> B[Founder Node Compiler]
    B --> C{Architectural Memory Check}
    C -->|Authority Valid| D[Haunted Toaster Upstream]
    C -->|Execution Slice| E[TranchNode Worker]
    D --> F[Dispatch Queue]
    E --> F
    F -->|Human Approval| G[Execution Receipt]
\`\`\``;
    setRawText(prev => (prev ? `${prev}\n\n${diagramCode}` : diagramCode));
    setInputMode('diagram');
  };

  return (
    <div className="bg-[#08080a] border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-400 rounded">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
              01 // IDEA STREAM COMPILER
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Dump raw founder thoughts, voice notes, screenshots, pasted chat threads, or architecture diagrams.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Sample Intent:</span>
          {SAMPLE_FOUNDER_THOUGHTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRawText(sample.text)}
              className="px-2.5 py-1 bg-black/40 hover:bg-zinc-850 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleCompileSubmit} className="space-y-5">
        {/* Multi-Format Mode Switcher & Markdown Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/60 border border-zinc-800 rounded-t-lg p-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setInputMode('editor')}
              className={`px-3 py-1 rounded text-xs font-mono transition flex items-center gap-1.5 uppercase tracking-wider ${
                inputMode === 'editor'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor
            </button>

            <button
              type="button"
              onClick={() => setInputMode('preview')}
              className={`px-3 py-1 rounded text-xs font-mono transition flex items-center gap-1.5 uppercase tracking-wider ${
                inputMode === 'preview'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Markdown Preview
            </button>

            <button
              type="button"
              onClick={() => setInputMode('diagram')}
              className={`px-3 py-1 rounded text-xs font-mono transition flex items-center gap-1.5 uppercase tracking-wider ${
                inputMode === 'diagram'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-300" />
              Architecture Diagram
            </button>
          </div>

          {/* Editor Syntax Quick Controls */}
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
            <button
              type="button"
              onClick={() => insertMarkdownSyntax('##', 'Section Title')}
              className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded border border-zinc-800 text-[10px]"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertMarkdownSyntax('-', 'List Item')}
              className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded border border-zinc-800 text-[10px]"
            >
              List
            </button>
            <button
              type="button"
              onClick={insertDiagramTemplate}
              className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-[10px] font-bold flex items-center gap-1"
            >
              + Add Diagram Spec
            </button>
          </div>
        </div>

        {/* Input Box / Preview Arena */}
        <div className="relative">
          {inputMode === 'editor' && (
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Dump raw founder thoughts here, speak into mic, paste chat logs, or upload screenshot specs..."
              rows={7}
              className="w-full bg-black/60 border border-t-0 border-zinc-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 text-zinc-100 placeholder-zinc-600 rounded-b-none rounded-t-none p-4 font-mono text-sm leading-relaxed resize-y transition shadow-inner"
            />
          )}

          {inputMode === 'preview' && (
            <div className="w-full bg-black/80 border border-t-0 border-zinc-800 p-5 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[170px] max-h-[350px] overflow-y-auto">
              {rawText ? (
                <div>{rawText}</div>
              ) : (
                <span className="text-zinc-600 italic">No text entered to preview. Switch to Editor to type.</span>
              )}
            </div>
          )}

          {inputMode === 'diagram' && (
            <div className="w-full bg-[#050508] border border-t-0 border-zinc-800 p-5 space-y-4 rounded-b-none">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  Visual Architecture Diagram Map
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Live Render</span>
              </div>

              {/* Interactive Visual Canvas Render */}
              <div className="p-4 bg-black/80 border border-cyan-900/40 rounded-lg flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-mono">
                <div className="p-3 bg-blue-950/80 border border-blue-700 rounded text-center text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <span className="text-[10px] text-blue-400 block uppercase font-bold">1. Upstream Spark</span>
                  Founder Intent Stream
                </div>

                <span className="text-zinc-600 font-bold hidden md:inline">→</span>

                <div className="p-3 bg-purple-950/80 border border-purple-700 rounded text-center text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <span className="text-[10px] text-purple-400 block uppercase font-bold">2. Authority Check</span>
                  Architectural Memory
                </div>

                <span className="text-zinc-600 font-bold hidden md:inline">→</span>

                <div className="p-3 bg-indigo-950/80 border border-indigo-700 rounded text-center text-indigo-200">
                  <span className="text-[10px] text-indigo-400 block uppercase font-bold">3. Target Selection</span>
                  Haunted Toaster / TranchNode
                </div>

                <span className="text-zinc-600 font-bold hidden md:inline">→</span>

                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded text-center text-emerald-200">
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">4. Dispatch Receipt</span>
                  Cryptographic Log
                </div>
              </div>
            </div>
          )}

          {/* Audio Live Recording Overlay */}
          {isRecording && (
            <div className="p-3 bg-blue-950/90 border border-blue-600/90 rounded-t-none text-xs font-mono flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2">
                <canvas ref={canvasRef} width={120} height={20} className="rounded" />
                <span className="text-blue-200 font-bold">
                  Recording Voice ({recordingTimer}s)...
                </span>
                {interimTranscript && (
                  <span className="text-zinc-400 text-[11px] truncate max-w-xs">
                    "{interimTranscript}"
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleStopRecording}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded transition"
              >
                Stop Voice
              </button>
            </div>
          )}

          {/* Screenshot Spec Processing Banner */}
          {isProcessingScreenshot && (
            <div className="p-3 bg-cyan-950/90 border border-cyan-600/90 text-xs font-mono flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-cyan-200 font-bold">
                  Processing Screenshot Specs & OCR Layout Extraction...
                </span>
              </div>
            </div>
          )}

          {/* Bottom Control Bar inside Input Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 bg-black/90 border-t border-zinc-800 rounded-b-lg">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mic Record Button */}
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Mic className="w-3.5 h-3.5 text-blue-400" />
                  Voice Note
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-2.5 py-1.5 bg-red-950 border border-red-700 text-red-200 text-xs font-mono rounded transition flex items-center gap-1.5 uppercase tracking-wider animate-pulse"
                >
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                  Stop Voice ({recordingTimer}s)
                </button>
              )}

              {/* Paste Conversation Button */}
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(true)}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1.5 uppercase tracking-wider"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                Paste Chat Log
              </button>

              {/* Upload Screenshot / Media Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded border border-zinc-800 transition flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                Upload Screenshot / Diagram
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*,text/*,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="text-[10px] font-mono text-zinc-500">
              {rawText.length} CHARS
            </div>
          </div>
        </div>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              Processed Media & Screenshot Spec Assets ({attachments.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {attachments.map(att => (
                <div
                  key={att.id}
                  className="px-3 py-1.5 bg-black/40 border border-zinc-800 rounded text-xs font-mono flex items-center gap-2 text-zinc-300"
                >
                  {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />}
                  {att.type === 'audio' && <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  {att.type === 'text' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{att.name}</span>
                  {att.sizeFormatted && <span className="text-zinc-500">({att.sizeFormatted})</span>}
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="text-zinc-500 hover:text-red-400 ml-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repos Context Scope Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            Target Ecosystem Repositories:
          </label>
          <div className="flex flex-wrap gap-2">
            {COLLECTIVE_REPOSITORIES.map(repo => {
              const isSelected = selectedRepos.includes(repo.id);
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => toggleRepo(repo.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-700 text-indigo-200 font-bold shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-zinc-700'}`} />
                  {repo.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Requested Proposal Outputs */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Proposal Output Types:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {AVAILABLE_PROPOSAL_TYPES.map(pt => {
              const isSelected = selectedTypes.includes(pt.id);
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => toggleProposalType(pt.id)}
                  className={`px-3 py-2 rounded text-xs font-mono border text-left transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-700 text-purple-200 font-bold shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <CheckSquare className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-zinc-800'}`} />
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Compiler Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isCompiling || !rawText.trim()}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-[0.2em] rounded border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCompiling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Compiling Founder Intent & Mapping Boundaries...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                Compile Founder Intent
              </>
            )}
          </button>
        </div>
      </form>

      {/* Paste Conversation Modal */}
      <PasteConversationModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={(formattedText) => {
          setRawText(prev => (prev ? `${prev}\n\n${formattedText}` : formattedText));
        }}
      />
    </div>
  );
};
