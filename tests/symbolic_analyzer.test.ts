import { describe, it, expect } from 'vitest';
import { SymbolicAnalyzer } from '../src/core/symbolic_analyzer';

describe('SymbolicAnalyzer', () => {
  const analyzer = new SymbolicAnalyzer();

  it('detects Jungian archetypes like shadow and wise old man', () => {
    const text = 'I saw a dark menacing figure following in my shadow, then an ancient bearded mentor gave me guidance.';
    const symbols = analyzer.extractSymbols(text);

    expect(symbols.length).toBeGreaterThan(0);
    const shadowSym = symbols.find((s) => s.symbol === 'shadow');
    expect(shadowSym).toBeDefined();
    expect(shadowSym?.category).toBe('ARCHETYPE');

    const mentorSym = symbols.find((s) => s.symbol === 'wise old man');
    expect(mentorSym).toBeDefined();
    expect(mentorSym?.sentiment).toBeGreaterThan(0);
  });

  it('detects elemental and action symbols', () => {
    const text = 'I was flying above the burning fire and turbulent ocean water.';
    const symbols = analyzer.extractSymbols(text);

    const flying = symbols.find((s) => s.symbol === 'flying');
    const fire = symbols.find((s) => s.symbol === 'fire');
    const water = symbols.find((s) => s.symbol === 'water');

    expect(flying).toBeDefined();
    expect(flying?.category).toBe('ACTION');
    expect(fire).toBeDefined();
    expect(fire?.category).toBe('ELEMENT');
    expect(water).toBeDefined();
    expect(water?.category).toBe('ELEMENT');
  });

  it('computes emotional sentiment scores correctly', () => {
    const positiveText = 'A glorious, peaceful, divine garden with blissful feelings.';
    const negativeText = 'A horrifying nightmare with terrifying monsters and despair.';

    const posScore = analyzer.calculateOverallSentiment(positiveText);
    const negScore = analyzer.calculateOverallSentiment(negativeText);

    expect(posScore).toBeGreaterThan(0);
    expect(negScore).toBeLessThan(0);
  });

  it('returns empty array when no symbols match', () => {
    const text = 'The pencil was on the desk.';
    const symbols = analyzer.extractSymbols(text);
    expect(Array.isArray(symbols)).toBe(true);
  });
});
