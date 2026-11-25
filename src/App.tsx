import React, { useState, useMemo } from 'react';
import { useJournalStore } from './core/journal_store';
import { Header } from './components/Header';
import { DreamCard } from './components/DreamCard';
import { DreamEditor } from './components/DreamEditor';
import { AnalyticsView } from './components/AnalyticsView';
import { VaultModal } from './components/VaultModal';
import { Sparkles, Moon, Filter, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const { entries, searchQuery, selectedMood, activeView } = useJournalStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  // Filter entries based on search & mood
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Mood filter
      if (selectedMood !== 'ALL' && entry.mood !== selectedMood) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = entry.title.toLowerCase().includes(q);
        const matchesContent = entry.content.toLowerCase().includes(q);
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSymbols = entry.symbols.some((s) => s.symbol.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags && !matchesSymbols) {
          return false;
        }
      }
      return true;
    });
  }, [entries, searchQuery, selectedMood]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navbar Header */}
      <Header
        onOpenNewDream={() => setIsEditorOpen(true)}
        onOpenVault={() => setIsVaultModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeView === 'analytics' ? (
          <AnalyticsView />
        ) : (
          <div className="space-y-6">
            {/* Hero / Filter Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100">
                    Dream Journal Entries
                    <span className="ml-2 text-xs font-normal text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'dream' : 'dreams'}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400">
                    Chronological tapestry of the subconscious mind
                  </p>
                </div>
              </div>

              {selectedMood !== 'ALL' && (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Filter className="w-3.5 h-3.5 text-purple-400" />
                  <span>Filtering mood: <strong className="text-purple-300">{selectedMood}</strong></span>
                </div>
              )}
            </div>

            {/* Dream Grid */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-20 px-4 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400">
                  <Moon className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-slate-200">No dreams match your criteria</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Try adjusting your search query, clearing your mood filter, or record your latest nocturnal experience.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Record Dream
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((dream) => (
                  <DreamCard key={dream.id} dream={dream} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 bg-slate-950/80">
        <p>Dreamscape • AI-Powered Dream Journal & Symbolic Psychology Platform • Autonomous Software Production Pipeline</p>
      </footer>

      {/* Modals */}
      <DreamEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
      <VaultModal isOpen={isVaultModalOpen} onClose={() => setIsVaultModalOpen(false)} />
    </div>
  );
};

export default App;
