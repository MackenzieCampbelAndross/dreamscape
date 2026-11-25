import { SymbolicEntity, SymbolCategory } from '../types';

interface SymbolRule {
  keywords: string[];
  symbol: string;
  category: SymbolCategory;
  interpretation: string;
  sentiment: number;
}

const SYMBOL_RULES: SymbolRule[] = [
  {
    keywords: ['water', 'ocean', 'sea', 'river', 'drowning', 'swim', 'lake'],
    symbol: 'water',
    category: 'ELEMENT',
    interpretation: 'Represents the depths of the unconscious mind, emotional immersion, and intuitive cleansing.',
    sentiment: 0.2,
  },
  {
    keywords: ['fall', 'falling', 'cliff', 'abyss', 'drop', 'void'],
    symbol: 'the abyss',
    category: 'ACTION',
    interpretation: 'Signifies feeling a loss of control, vulnerability in waking life, or surrender of the conscious ego.',
    sentiment: -0.6,
  },
  {
    keywords: ['fly', 'flying', 'soar', 'sky', 'wings', 'levitate'],
    symbol: 'flying',
    category: 'ACTION',
    interpretation: 'A potent symbol of psychological liberation, perspective shifts, and rising above terrestrial anxieties.',
    sentiment: 0.8,
  },
  {
    keywords: ['mirror', 'reflection', 'glass', 'double', 'twin'],
    symbol: 'mirror',
    category: 'ARCHETYPE',
    interpretation: 'Indicates deep introspection, confrontation with the Jungian Shadow, and self-evaluation.',
    sentiment: 0.1,
  },
  {
    keywords: ['shadow', 'dark figure', 'monster', 'beast', 'stalker', 'demon'],
    symbol: 'shadow',
    category: 'ARCHETYPE',
    interpretation: 'Represents repressed desires, instinctual drives, and unacknowledged aspects of your personality.',
    sentiment: -0.4,
  },
  {
    keywords: ['wise old man', 'elder', 'mentor', 'guru', 'wizard', 'sage'],
    symbol: 'wise old man',
    category: 'ARCHETYPE',
    interpretation: 'The archetype of wisdom, guidance, deep intuition, and spiritual alignment.',
    sentiment: 0.85,
  },
  {
    keywords: ['clock', 'watch', 'time', 'hourglass', 'late', 'hurry'],
    symbol: 'time',
    category: 'ELEMENT',
    interpretation: 'Reflects deadline pressure, aging consciousness, or an imperative to seize waking opportunities.',
    sentiment: -0.3,
  },
  {
    keywords: ['forest', 'woods', 'trees', 'jungle', 'labyrinth', 'maze'],
    symbol: 'forest',
    category: 'SETTING',
    interpretation: 'Symbolizes the journey of individuation, exploration of unknown potential, and finding life purpose.',
    sentiment: 0.3,
  },
  {
    keywords: ['castle', 'palace', 'temple', 'tower', 'shrine'],
    symbol: 'sacred tower',
    category: 'SETTING',
    interpretation: 'Denotes spiritual structure, aspiration for greatness, and core values of the conscious self.',
    sentiment: 0.7,
  },
  {
    keywords: ['fire', 'flame', 'burning', 'inferno', 'ash'],
    symbol: 'fire',
    category: 'ELEMENT',
    interpretation: 'Represents catalytic transformation, passion, creative purification, or destructive wrath.',
    sentiment: 0.0,
  },
  {
    keywords: ['chase', 'pursued', 'running from', 'hunted'],
    symbol: 'chase',
    category: 'ACTION',
    interpretation: 'Avoidance of unresolved conflict, fear of failure, or running from confronting reality.',
    sentiment: -0.6,
  },
  {
    keywords: ['bird', 'eagle', 'raven', 'phoenix', 'owl'],
    symbol: 'bird',
    category: 'ARCHETYPE',
    interpretation: 'Messenger of the unconscious, elevated perspective, and spiritual aspiration.',
    sentiment: 0.8,
  }
];

export class SymbolicAnalyzer {
  static analyzeText(content: string): { symbols: SymbolicEntity[]; overallSentiment: number } {
    const analyzer = new SymbolicAnalyzer();
    const symbols = analyzer.extractSymbols(content);
    const overallSentiment = analyzer.calculateOverallSentiment(content);
    return { symbols, overallSentiment };
  }

  extractSymbols(content: string): SymbolicEntity[] {
    const lower = content.toLowerCase();
    const matchedSymbols: SymbolicEntity[] = [];

    for (const rule of SYMBOL_RULES) {
      const hasMatch = rule.keywords.some((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(lower);
      });

      if (hasMatch) {
        matchedSymbols.push({
          symbol: rule.symbol,
          category: rule.category,
          interpretation: rule.interpretation,
          sentiment: rule.sentiment,
        });
      }
    }

    return matchedSymbols;
  }

  calculateOverallSentiment(content: string): number {
    const lower = content.toLowerCase();
    const positiveWords = ['peaceful', 'glorious', 'divine', 'blissful', 'joy', 'serene', 'calm', 'liberating', 'golden', 'light'];
    const negativeWords = ['horrifying', 'nightmare', 'terrifying', 'monster', 'despair', 'drowning', 'falling', 'death', 'dark', 'fear'];

    let score = 0;
    for (const w of positiveWords) {
      if (lower.includes(w)) score += 0.3;
    }
    for (const w of negativeWords) {
      if (lower.includes(w)) score -= 0.3;
    }

    // Blend with detected symbol sentiments
    const symbols = this.extractSymbols(content);
    if (symbols.length > 0) {
      const symAvg = symbols.reduce((acc, s) => acc + s.sentiment, 0) / symbols.length;
      score = (score + symAvg) / 2;
    }

    return parseFloat(Math.max(-1.0, Math.min(1.0, score)).toFixed(2));
  }
}
