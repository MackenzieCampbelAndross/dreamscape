import { describe, it, expect } from 'vitest';
import { AnalyticsEngine } from '../src/core/analytics_engine';
import { DreamEntry } from '../src/types';

describe('AnalyticsEngine', () => {
  const sampleEntries: DreamEntry[] = [
    {
      id: 'd1',
      title: 'Lucid Flying',
      date: '2026-11-20',
      content: 'I flew smoothly.',
      mood: 'MYSTICAL',
      lucidity: 5,
      sleepQuality: 9,
      symbols: [
        { symbol: 'flying', category: 'ACTION', interpretation: '', sentiment: 0.8 },
        { symbol: 'ocean', category: 'SETTING', interpretation: '', sentiment: 0.5 }
      ],
      visualPrompt: '',
      artSeed: 123,
      tags: [],
      createdAt: 1000,
      updatedAt: 1000
    },
    {
      id: 'd2',
      title: 'Restless Maze',
      date: '2026-11-21',
      content: 'I was chased in a maze.',
      mood: 'ANXIOUS',
      lucidity: 2,
      sleepQuality: 4,
      symbols: [
        { symbol: 'chase', category: 'ACTION', interpretation: '', sentiment: -0.6 }
      ],
      visualPrompt: '',
      artSeed: 456,
      tags: [],
      createdAt: 2000,
      updatedAt: 2000
    }
  ];

  it('calculates aggregate metrics accurately', () => {
    const analytics = AnalyticsEngine.calculateAnalytics(sampleEntries);

    expect(analytics.totalDreams).toBe(2);
    expect(analytics.averageLucidity).toBe(3.5);
    expect(analytics.averageSleepQuality).toBe(6.5);
    expect(analytics.moodCounts.MYSTICAL).toBe(1);
    expect(analytics.moodCounts.ANXIOUS).toBe(1);
    expect(analytics.moodCounts.EUPHORIC).toBe(0);
  });

  it('identifies top recurring symbols', () => {
    const analytics = AnalyticsEngine.calculateAnalytics(sampleEntries);
    expect(analytics.topSymbols.length).toBe(3);
    const flying = analytics.topSymbols.find((s) => s.symbol === 'flying');
    expect(flying?.count).toBe(1);
  });

  it('handles empty entries safely', () => {
    const analytics = AnalyticsEngine.calculateAnalytics([]);
    expect(analytics.totalDreams).toBe(0);
    expect(analytics.averageLucidity).toBe(0);
    expect(analytics.averageSleepQuality).toBe(0);
    expect(analytics.lucidityCorrelation).toBe(0);
  });
});
