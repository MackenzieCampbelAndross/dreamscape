import { DreamEntry, DreamAnalytics, DreamMood, SymbolCategory } from '../types';

export class AnalyticsEngine {
  static computeAnalytics(dreams: DreamEntry[]): DreamAnalytics {
    if (dreams.length === 0) {
      return {
        totalDreams: 0,
        averageLucidity: 0,
        averageSleepQuality: 0,
        moodCounts: {
          EUPHORIC: 0,
          PEACEFUL: 0,
          ANXIOUS: 0,
          MYSTICAL: 0,
          NIGHTMARISH: 0,
          CONFUSED: 0,
        },
        topSymbols: [],
        lucidityCorrelation: 0,
      };
    }

    const totalDreams = dreams.length;
    let totalLucidity = 0;
    let totalSleep = 0;

    const moodCounts: Record<DreamMood, number> = {
      EUPHORIC: 0,
      PEACEFUL: 0,
      ANXIOUS: 0,
      MYSTICAL: 0,
      NIGHTMARISH: 0,
      CONFUSED: 0,
    };

    const symbolCountMap = new Map<string, { count: number; category: SymbolCategory }>();

    for (const d of dreams) {
      totalLucidity += d.lucidity;
      totalSleep += d.sleepQuality;
      moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;

      for (const s of d.symbols) {
        const existing = symbolCountMap.get(s.symbol);
        if (existing) {
          existing.count++;
        } else {
          symbolCountMap.set(s.symbol, { count: 1, category: s.category });
        }
      }
    }

    const topSymbols = Array.from(symbolCountMap.entries())
      .map(([symbol, data]) => ({ symbol, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Compute Pearson correlation between Lucidity (X) and Sleep Quality (Y)
    const avgLucidity = totalLucidity / totalDreams;
    const avgSleep = totalSleep / totalDreams;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (const d of dreams) {
      const dx = d.lucidity - avgLucidity;
      const dy = d.sleepQuality - avgSleep;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }

    let correlation = 0;
    if (denomX > 0 && denomY > 0) {
      correlation = parseFloat((numerator / Math.sqrt(denomX * denomY)).toFixed(2));
    }

    return {
      totalDreams,
      averageLucidity: parseFloat(avgLucidity.toFixed(1)),
      averageSleepQuality: parseFloat(avgSleep.toFixed(1)),
      moodCounts,
      topSymbols,
      lucidityCorrelation: correlation,
    };
  }

  static calculateAnalytics(dreams: DreamEntry[]): DreamAnalytics {
    return this.computeAnalytics(dreams);
  }
}
