/**
 * Domain types and models for Dreamscape (AI Dream Journal & Symbolic Interpreter).
 */

export type DreamMood =
  | 'EUPHORIC'
  | 'PEACEFUL'
  | 'ANXIOUS'
  | 'MYSTICAL'
  | 'NIGHTMARISH'
  | 'CONFUSED';

export type LucidityLevel = 1 | 2 | 3 | 4 | 5;

export type SymbolCategory = 'ARCHETYPE' | 'EMOTION' | 'ELEMENT' | 'SETTING' | 'ACTION';

export interface SymbolicEntity {
  symbol: string;
  category: SymbolCategory;
  interpretation: string;
  sentiment: number; // -1.0 to +1.0
}

export interface DreamEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  mood: DreamMood;
  lucidity: LucidityLevel;
  sleepQuality: number; // 1 to 10
  symbols: SymbolicEntity[];
  visualPrompt: string;
  artSeed: number;
  isEncrypted?: boolean;
  encryptedPayload?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DreamAnalytics {
  totalDreams: number;
  averageLucidity: number;
  averageSleepQuality: number;
  moodCounts: Record<DreamMood, number>;
  topSymbols: Array<{ symbol: string; count: number; category: SymbolCategory }>;
  lucidityCorrelation: number; // Correlation between lucidity and sleep quality
}
