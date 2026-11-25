import { describe, it, expect } from 'vitest';
import { PromptGenerator } from '../src/core/prompt_generator';
import { SymbolicEntity } from '../src/types';

describe('PromptGenerator', () => {
  const sampleSymbols: SymbolicEntity[] = [
    {
      symbol: 'water',
      category: 'ELEMENT',
      interpretation: 'Subconscious depth',
      sentiment: 0.5
    },
    {
      symbol: 'flying',
      category: 'ACTION',
      interpretation: 'Transcendence',
      sentiment: 0.9
    }
  ];

  it('generates rich visual generative art prompts', () => {
    const prompt = PromptGenerator.generateVisualPrompt(
      'I flew across the endless sea at dawn.',
      'MYSTICAL',
      sampleSymbols
    );

    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(30);
    expect(prompt).toContain('water');
    expect(prompt).toContain('flying');
  });

  it('provides distinct palettes for each mood', () => {
    const euphoric = PromptGenerator.getProceduralPalette('EUPHORIC');
    const nightmarish = PromptGenerator.getProceduralPalette('NIGHTMARISH');
    const peaceful = PromptGenerator.getProceduralPalette('PEACEFUL');

    expect(euphoric.background).toBeDefined();
    expect(nightmarish.background).toBeDefined();
    expect(peaceful.colors.length).toBeGreaterThan(0);
    expect(euphoric.accent).not.toEqual(nightmarish.accent);
  });
});
