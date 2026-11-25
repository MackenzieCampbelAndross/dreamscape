import React, { useState } from 'react';
import { DreamEntry } from '../types';
import { ArtworkCanvas } from './ArtworkCanvas';
import { useJournalStore } from '../core/journal_store';
import { VaultEncryption } from '../core/vault_encryption';
import { Sparkles, Calendar, Trash2, Eye, EyeOff, Lock, Unlock, Zap, Moon } from 'lucide-react';

interface DreamCardProps {
  dream: DreamEntry;
  onEdit?: (dream: DreamEntry) => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({ dream, onEdit }) => {
  const { deleteEntry, isVaultLocked, vaultPasscode } = useJournalStore();
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const moodColors: Record<string, { bg: string; text: string; border: string }> = {
    EUPHORIC: { bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-700/50' },
    PEACEFUL: { bg: 'bg-emerald-950/40', text: 'text-emerald-300', border: 'border-emerald-700/50' },
    ANXIOUS: { bg: 'bg-rose-950/40', text: 'text-rose-300', border: 'border-rose-700/50' },
    MYSTICAL: { bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-700/50' },
    NIGHTMARISH: { bg: 'bg-red-950/60', text: 'text-red-400', border: 'border-red-800/60' },
    CONFUSED: { bg: 'bg-indigo-950/40', text: 'text-indigo-300', border: 'border-indigo-700/50' }
  };

  const style = moodColors[dream.mood] || moodColors.MYSTICAL;

  const handleDecrypt = async () => {
    if (!dream.encryptedPayload || !vaultPasscode) {
      setErrorMsg('No encrypted payload or passcode available.');
      return;
    }
    try {
      const plaintext = await VaultEncryption.decrypt(dream.encryptedPayload, vaultPasscode);
      setDecryptedText(plaintext);
      setErrorMsg(null);
    } catch {
      setErrorMsg('Decryption failed. Invalid passcode.');
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-purple-900/10 flex flex-col group">
      {/* Visual Generative Canvas */}
      <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
        <ArtworkCanvas
          seed={dream.artSeed}
          mood={dream.mood}
          symbols={dream.symbols}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md ${style.bg} ${style.text} ${style.border}`}
          >
            {dream.mood}
          </span>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-black/60 text-indigo-200 border border-indigo-400/30 backdrop-blur-md flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Lucidity: {dream.lucidity}/5
          </span>
        </div>

        {dream.isEncrypted && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-purple-950/80 border border-purple-500/50 text-purple-300 backdrop-blur-md flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-400" />
            Encrypted
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {dream.date}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Sleep Quality: {dream.sleepQuality}/10
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
            {dream.title}
          </h3>

          <div className="mt-2 text-sm text-slate-300 line-clamp-3 leading-relaxed">
            {dream.isEncrypted && isVaultLocked ? (
              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-xs text-purple-300 flex items-center justify-between">
                <span>🔒 Content encrypted in vault</span>
                <button
                  onClick={handleDecrypt}
                  className="px-2 py-1 bg-purple-800/60 hover:bg-purple-700 rounded text-white flex items-center gap-1 text-xs"
                >
                  <Unlock className="w-3 h-3" /> Decrypt
                </button>
              </div>
            ) : decryptedText ? (
              <p className="text-purple-200 italic">{decryptedText}</p>
            ) : (
              <p>{dream.content}</p>
            )}
          </div>

          {errorMsg && <p className="text-xs text-rose-400 mt-1">{errorMsg}</p>}

          {/* Archetypes & Symbolic Entities */}
          {dream.symbols.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Jungian Symbols Detected
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dream.symbols.slice(0, 4).map((sym, idx) => (
                  <span
                    key={idx}
                    title={sym.interpretation}
                    className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 cursor-help hover:border-purple-500/50 hover:bg-purple-950/30 transition-all"
                  >
                    #{sym.symbol} ({sym.category.toLowerCase()})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Prompt Preview Toggle */}
          {showPrompt && (
            <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-indigo-900/40 text-xs text-indigo-200">
              <div className="font-semibold text-indigo-400 mb-1">Generated Visual Prompt:</div>
              <p className="italic leading-relaxed">{dream.visualPrompt}</p>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {showPrompt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPrompt ? 'Hide Art Prompt' : 'View Art Prompt'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(dream)}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-all"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteEntry(dream.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
              title="Delete Dream Entry"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
