import { create } from 'zustand';
import { DreamEntry, DreamMood } from '../types';
import { SymbolicAnalyzer } from './symbolic_analyzer';
import { PromptGenerator } from './prompt_generator';
import { VaultEncryption } from './vault_encryption';

interface JournalState {
  entries: DreamEntry[];
  searchQuery: string;
  selectedMood: DreamMood | 'ALL';
  selectedTag: string | 'ALL';
  isVaultLocked: boolean;
  vaultPasscode: string | null;
  activeView: 'journal' | 'analytics' | 'art';
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedMood: (mood: DreamMood | 'ALL') => void;
  setSelectedTag: (tag: string | 'ALL') => void;
  setActiveView: (view: 'journal' | 'analytics' | 'art') => void;
  
  // Entry Operations
  addEntry: (data: {
    title: string;
    date: string;
    content: string;
    mood: DreamMood;
    lucidity: 1 | 2 | 3 | 4 | 5;
    sleepQuality: number;
    tags: string[];
    isEncrypted?: boolean;
    passcode?: string;
  }) => Promise<DreamEntry>;
  
  updateEntry: (id: string, updates: Partial<DreamEntry>) => void;
  deleteEntry: (id: string) => void;
  
  // Vault Operations
  lockVault: () => void;
  unlockVault: (passcode: string) => Promise<boolean>;
  setVaultPasscode: (passcode: string) => void;
}

const INITIAL_ENTRIES: DreamEntry[] = [
  {
    id: 'dream-1',
    title: 'The Obsidian Tower Above the Silver Ocean',
    date: '2026-11-20',
    content: 'I stood on a cliff facing a vast, calm ocean of liquid silver. In the center rose an immense tower of dark polished obsidian. I felt completely weightless, and as I stepped off the edge, I was flying smoothly toward an open archway where a golden bird watched me silently.',
    mood: 'MYSTICAL',
    lucidity: 4,
    sleepQuality: 8.5,
    symbols: [
      {
        symbol: 'water',
        category: 'ELEMENT',
        interpretation: 'The subconscious ocean, emotions, and hidden psychological depths.',
        sentiment: 0.5
      },
      {
        symbol: 'flying',
        category: 'ACTION',
        interpretation: 'Transcendence, liberation from mundane constraints, and awakening ego consciousness.',
        sentiment: 0.9
      },
      {
        symbol: 'bird',
        category: 'ARCHETYPE',
        interpretation: 'Messenger of the psyche, spiritual aspiration, and higher intuition.',
        sentiment: 0.8
      }
    ],
    visualPrompt: 'A surreal monumental obsidian spire rising from an expanse of shimmering liquid silver mercury sea, a celestial golden phoenix perched in an arched sanctuary, mystical twilight, luminous bioluminescent reflection, intricate matte painting',
    artSeed: 133742,
    tags: ['flying', 'tower', 'ocean', 'lucid'],
    isEncrypted: false,
    createdAt: Date.now() - 400000000,
    updatedAt: Date.now() - 400000000
  },
  {
    id: 'dream-2',
    title: 'Labyrinth of Neon Clocks',
    date: '2026-11-22',
    content: 'I was trapped in an infinite labyrinth where the walls were covered with thousands of antique and digital neon clocks ticking at completely different tempos. I was running desperately to catch a train that was always departing in negative five minutes.',
    mood: 'ANXIOUS',
    lucidity: 2,
    sleepQuality: 4.5,
    symbols: [
      {
        symbol: 'chase',
        category: 'ACTION',
        interpretation: 'Avoidance of unresolved conflict, anxiety regarding impending deadlines or expectations.',
        sentiment: -0.7
      },
      {
        symbol: 'forest',
        category: 'SETTING',
        interpretation: 'The maze of the unconscious, disorientation, and search for personal direction.',
        sentiment: -0.3
      }
    ],
    visualPrompt: 'Cyberpunk endless geometric maze composed of glowing electric neon brass clockwork gears, spinning retrograde watch faces, moody atmospheric fog, high contrast synthwave palette, cinematic lens flare',
    artSeed: 98124,
    tags: ['labyrinth', 'time', 'anxiety'],
    isEncrypted: false,
    createdAt: Date.now() - 250000000,
    updatedAt: Date.now() - 250000000
  },
  {
    id: 'dream-3',
    title: 'Garden of Luminous Glass Blossoms',
    date: '2026-11-24',
    content: 'Walking through a nocturnal garden where delicate flowers made of blown glass chimed musical chords as the gentle breeze moved past them. A feeling of profound harmony and deep inner peace washed over me, as if all questions had dissolved.',
    mood: 'PEACEFUL',
    lucidity: 3,
    sleepQuality: 9.0,
    symbols: [
      {
        symbol: 'forest',
        category: 'SETTING',
        interpretation: 'Sanctuary of spiritual integration, organic growth, and inner tranquility.',
        sentiment: 0.85
      },
      {
        symbol: 'water',
        category: 'ELEMENT',
        interpretation: 'Healing currents, emotional purification, and serene stillness.',
        sentiment: 0.8
      }
    ],
    visualPrompt: 'An enchanted midnight botanical conservatory with crystalline translucent glass blossoms resonating ethereal starlight, gentle ambient pastel cyan and amethyst glows, dew drops refracting cosmic nebulae, hyper-detailed fantasy render',
    artSeed: 554109,
    tags: ['garden', 'glass', 'music', 'peace'],
    isEncrypted: false,
    createdAt: Date.now() - 90000000,
    updatedAt: Date.now() - 90000000
  }
];

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: INITIAL_ENTRIES,
  searchQuery: '',
  selectedMood: 'ALL',
  selectedTag: 'ALL',
  isVaultLocked: true,
  vaultPasscode: '1234', // default passcode
  activeView: 'journal',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedMood: (selectedMood) => set({ selectedMood }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setActiveView: (activeView) => set({ activeView }),

  addEntry: async (data) => {
    const analyzer = new SymbolicAnalyzer();
    const symbols = analyzer.extractSymbols(data.content);
    const prompt = PromptGenerator.generateVisualPrompt(data.content, data.mood, symbols);
    const artSeed = Math.floor(Math.random() * 1000000);

    let contentToStore = data.content;
    let encryptedPayload: string | undefined = undefined;

    if (data.isEncrypted && data.passcode) {
      encryptedPayload = await VaultEncryption.encrypt(data.content, data.passcode);
      contentToStore = '🔒 This dream entry is encrypted in your personal vault.';
    }

    const newEntry: DreamEntry = {
      id: `dream-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      date: data.date,
      content: contentToStore,
      mood: data.mood,
      lucidity: data.lucidity,
      sleepQuality: data.sleepQuality,
      symbols,
      visualPrompt: prompt,
      artSeed,
      isEncrypted: !!data.isEncrypted,
      encryptedPayload,
      tags: data.tags,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    set((state) => ({ entries: [newEntry, ...state.entries] }));
    return newEntry;
  },

  updateEntry: (id, updates) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates, updatedAt: Date.now() } : entry
      )
    }));
  },

  deleteEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id)
    }));
  },

  lockVault: () => {
    set({ isVaultLocked: true });
  },

  unlockVault: async (passcode: string) => {
    const { vaultPasscode } = get();
    if (passcode === vaultPasscode) {
      set({ isVaultLocked: false });
      return true;
    }
    return false;
  },

  setVaultPasscode: (vaultPasscode: string) => {
    set({ vaultPasscode });
  }
}));
