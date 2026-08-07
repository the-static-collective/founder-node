import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, Check, FileText } from 'lucide-react';

interface PasteConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (extractedText: string) => void;
}

export const PasteConversationModal: React.FC<PasteConversationModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [sourceFormat, setSourceFormat] = useState<'auto' | 'slack' | 'chatgpt' | 'discord' | 'email'>('auto');

  if (!isOpen) return null;

  const handleProcessAndImport = () => {
    if (!pasteContent.trim()) return;

    // Smart conversation parser & speaker tags extractor
    const lines = pasteContent.split('\n');
    const parsedLines: string[] = [];
    const speakers = new Set<string>();

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Detect speaker pattern like "Alice:", "[12:30] Bob:", "User:", "Assistant:"
      const speakerMatch = trimmed.match(/^\[?\d{1,2}:\d{2}\]?\s*([A-Za-z0-9_\s]{2,15}):\s*(.*)$/) ||
                           trimmed.match(/^([A-Za-z0-9_\s]{2,15}):\s*(.*)$/);

      if (speakerMatch) {
        const name = speakerMatch[1].trim();
        const msg = speakerMatch[2].trim();
        speakers.add(name);
        parsedLines.push(`• **${name}**: ${msg}`);
      } else {
        parsedLines.push(`• ${trimmed}`);
      }
    });

    const speakersList = Array.from(speakers);
    const summaryHeader = speakersList.length > 0 
      ? `[Pasted Conversation transcript featuring ${speakersList.join(', ')}]:` 
      : `[Pasted Conversation Note]:`;

    const formattedOutput = `${summaryHeader}\n${parsedLines.join('\n')}`;

    onImport(formattedOutput);
    setPasteContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#08080a] border border-zinc-800 rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-950/80 border border-purple-800 text-purple-400 rounded">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-[0.15em]">
                PASTE CONVERSATION / CHAT LOG IMPORTER
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Paste raw Slack, Discord, WhatsApp, or LLM chat transcripts to auto-extract speakers & founder action items.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-black/60 hover:bg-zinc-800 rounded border border-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Format Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Format Preset:</span>
          {(['auto', 'slack', 'chatgpt', 'discord', 'email'] as const).map(fmt => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSourceFormat(fmt)}
              className={`px-2.5 py-1 rounded uppercase tracking-wider text-[10px] transition border ${
                sourceFormat === fmt
                  ? 'bg-purple-950 border-purple-600 text-purple-200 font-bold'
                  : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={pasteContent}
          onChange={e => setPasteContent(e.target.value)}
          placeholder={`Paste raw discussion thread here...\n\nExample:\n[10:14 AM] Founder: We need Haunted Toaster to process raw stems before sending audio slices to TranchNode.\n[10:15 AM] Lead Architect: Approved, as long as Project0 retains canonical auth rules.`}
          rows={8}
          className="w-full bg-black/80 border border-zinc-800 focus:border-purple-500/80 focus:outline-none text-zinc-100 text-xs font-mono p-4 rounded-lg leading-relaxed resize-y"
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <span className="text-[10px] font-mono text-zinc-500">
            Auto-extracts key dialogue & formats action items.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-black/60 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded border border-zinc-800 transition uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcessAndImport}
              disabled={!pasteContent.trim()}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded border border-purple-400/50 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Parse & Import Into Idea Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
