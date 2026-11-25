import React, { useState, useMemo } from 'react';
import { useJournalStore } from '../core/journal_store';
import { DreamMood, LucidityLevel } from '../types';
import { SymbolicAnalyzer } from '../core/symbolic_analyzer';
import { X, Sparkles, Lock, Moon, Zap, Tag } from 'lucide-react';

interface DreamEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DreamEditor: React.FC<DreamEditorProps> = ({ isOpen, onClose }) => {
  const { addEntry } = useJournalStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DreamMood>('MYSTICAL');
  const [lucidity, setLucidity] = useState<LucidityLevel>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [tagsInput, setTagsInput] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live symbolic extraction preview
  const liveSymbols = useMemo(() => {
    if (!content.trim()) return [];
    const analyzer = new SymbolicAnalyzer();
    return analyzer.extractSymbols(content);
  }, [content]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await addEntry({
        title,
        date,
        content,
        mood,
        lucidity,
        sleepQuality,
        tags,
        isEncrypted,
        passcode: isEncrypted ? passcode : undefined
      });

      // Reset form
      setTitle('');
      setContent('');
      setTagsInput('');
      setIsEncrypted(false);
      setPasscode('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-6">
          <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Record New Dream</h2>
            <p className="text-xs text-slate-400">Capture narrative details, emotions, and symbolic resonance</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Dream Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Flight Across the Neon Sea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Dream Narrative</label>
            <textarea
              required
              rows={5}
              placeholder="Describe your dream as vividly as possible: where were you, who was there, what occurred, and what feelings lingered?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Live Symbolic Extraction Preview */}
          {liveSymbols.length > 0 && (
            <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs">
              <div className="font-semibold text-purple-300 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Jungian Analysis:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {liveSymbols.map((sym, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-200 border border-purple-700/50"
                  >
                    #{sym.symbol}: {sym.interpretation.slice(0, 45)}...
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mood, Lucidity, Sleep Quality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Dominant Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as DreamMood)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="EUPHORIC">Euphoric</option>
                <option value="PEACEFUL">Peaceful</option>
                <option value="MYSTICAL">Mystical</option>
                <option value="ANXIOUS">Anxious</option>
                <option value="NIGHTMARISH">Nightmarish</option>
                <option value="CONFUSED">Confused</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                <span>Lucidity Level</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Zap className="w-3 h-3" /> {lucidity}/5
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={lucidity}
                onChange={(e) => setLucidity(Number(e.target.value) as LucidityLevel)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Unconscious</span>
                <span>Fully Lucid</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                <span>Sleep Quality</span>
                <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                  <Moon className="w-3 h-3" /> {sleepQuality}/10
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Restless</span>
                <span>Restorative</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. flight, ocean, childhood, recurring"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* AES Encryption Toggle */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="rounded accent-purple-600 w-4 h-4"
              />
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Encrypt with AES-GCM 256-bit vault protection
              </span>
            </label>

            {isEncrypted && (
              <div>
                <input
                  type="password"
                  required={isEncrypted}
                  placeholder="Enter encryption passphrase"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-purple-500/50 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Remember this password. Without it, encrypted dreams cannot be decrypted.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Analyzing & Saving...' : 'Save & Interpret'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
