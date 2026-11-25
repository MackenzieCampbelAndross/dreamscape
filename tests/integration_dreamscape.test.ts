import { describe, it, expect } from 'vitest';
import { SymbolicAnalyzer } from '../src/core/symbolic_analyzer';
import { PromptGenerator } from '../src/core/prompt_generator';
import { AnalyticsEngine } from '../src/core/analytics_engine';
import { VaultEncryption } from '../src/core/vault_encryption';
import { DreamEntry } from '../src/types';

describe('Dreamscape End-to-End Pipeline Integration', () => {
  it('processes raw dream text through analysis, visual prompt generation, and encryption', async () => {
    const rawNarrative = 'I was walking along an ocean of blue fire and met an ancient wise elder who handed me a golden key.';
    
    // 1. Symbolic extraction
    const analyzer = new SymbolicAnalyzer();
    const symbols = analyzer.extractSymbols(rawNarrative);
    expect(symbols.length).toBeGreaterThan(0);
    const hasElementOrArchetype = symbols.some(
      (s) => s.category === 'ELEMENT' || s.category === 'ARCHETYPE'
    );
    expect(hasElementOrArchetype).toBe(true);

    // 2. Prompt Generation
    const prompt = PromptGenerator.generateVisualPrompt(rawNarrative, 'MYSTICAL', symbols);
    expect(prompt).toContain('blue fire');
    expect(prompt.length).toBeGreaterThan(40);

    // 3. Vault Encryption
    const secretPass = 'lucidPassphrase99';
    const encrypted = await VaultEncryption.encrypt(rawNarrative, secretPass);
    expect(encrypted).not.toEqual(rawNarrative);

    const decrypted = await VaultEncryption.decrypt(encrypted, secretPass);
    expect(decrypted).toEqual(rawNarrative);

    // 4. Analytics Processing
    const entries: DreamEntry[] = [
      {
        id: 'test-1',
        title: 'Elder by the Ocean of Fire',
        date: '2026-11-25',
        content: rawNarrative,
        mood: 'MYSTICAL',
        lucidity: 4,
        sleepQuality: 8.5,
        symbols,
        visualPrompt: prompt,
        artSeed: 4422,
        tags: ['elder', 'ocean', 'fire'],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    const analytics = AnalyticsEngine.calculateAnalytics(entries);
    expect(analytics.totalDreams).toBe(1);
    expect(analytics.averageLucidity).toBe(4);
    expect(analytics.averageSleepQuality).toBe(8.5);
    expect(analytics.moodCounts.MYSTICAL).toBe(1);
  });
});
