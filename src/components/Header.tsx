import React from 'react';
import { useJournalStore } from '../core/journal_store';
import { DreamMood } from '../types';
import { Moon, Sparkles, BarChart3, Lock, Unlock, Plus, Search } from 'lucide-react';

interface HeaderProps {
  onOpenNewDream: () => void;
  onOpenVault: () => void;
}

const MOODS: Array<{ label: string; value: DreamMood | 'ALL' }> = [
  { label: 'All Moods', value: 'ALL' },
  { label: 'Euphoric', value: 'EUPHORIC' },
  { label: 'Peaceful', value: 'PEACEFUL' },
  { label: 'Anxious', value: 'ANXIOUS' },
  { label: 'Mystical', value: 'MYSTICAL' },
  { label: 'Nightmarish', value: 'NIGHTMARISH' },
  { label: 'Confused', value: 'CONFUSED' }
];

export const Header: React.FC<HeaderProps> = ({ onOpenNewDream, onOpenVault }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMood,
    setSelectedMood,
    isVaultLocked,
    activeView,
    setActiveView
  } = useJournalStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('journal')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Dreamscape
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">AI Dream Journal & Symbolic Interpreter</p>
          </div>
        </div>

        {/* Search & Mood Filter */}
        <div className="flex items-center flex-1 max-w-md w-full gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbols, themes, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value as DreamMood | 'ALL')}
            aria-label="Filter dreams by mood"
            className="px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            {MOODS.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-900 text-slate-100">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Switchers & Primary Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveView('journal')}
            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-1.5 transition-all ${
              activeView === 'journal'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Journal</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-1.5 transition-all ${
              activeView === 'analytics'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={onOpenVault}
            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center space-x-1.5 border transition-all ${
              isVaultLocked
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300'
            }`}
            title={isVaultLocked ? 'Vault is Locked' : 'Vault is Unlocked'}
          >
            {isVaultLocked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{isVaultLocked ? 'Locked' : 'Unlocked'}</span>
          </button>

          <button
            onClick={onOpenNewDream}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Dream</span>
          </button>
        </div>
      </div>
    </header>
  );
};
