import React, { useMemo } from 'react';
import { useJournalStore } from '../core/journal_store';
import { AnalyticsEngine } from '../core/analytics_engine';
import { BarChart3, Moon, Zap, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { entries } = useJournalStore();

  const analytics = useMemo(() => {
    return AnalyticsEngine.calculateAnalytics(entries);
  }, [entries]);

  const moodColors: Record<string, string> = {
    EUPHORIC: 'bg-amber-400',
    PEACEFUL: 'bg-emerald-400',
    ANXIOUS: 'bg-rose-400',
    MYSTICAL: 'bg-purple-400',
    NIGHTMARISH: 'bg-red-500',
    CONFUSED: 'bg-indigo-400'
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Dream Psychology & Sleep Analytics</h2>
          <p className="text-sm text-slate-400">
            Jungian archetype patterns, lucidity metrics, and sleep quality correlation
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Recorded Dreams</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{analytics.totalDreams}</div>
          <div className="text-xs text-slate-500 mt-1">Reflecting unconscious psyche</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average Lucidity</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {analytics.averageLucidity} <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Conscious awareness within dream state</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Sleep Quality</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-400">
            {analytics.averageSleepQuality} <span className="text-sm text-slate-400 font-normal">/ 10.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Restorative somatic recovery score</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Lucidity Correlation</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {analytics.lucidityCorrelation >= 0 ? '+' : ''}
            {analytics.lucidityCorrelation.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Pearson coefficient (Lucidity ↔ Sleep)</div>
        </div>
      </div>

      {/* Mood Distribution & Archetype Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            Emotional Mood Distribution
          </h3>
          <div className="space-y-3 pt-2">
            {Object.entries(analytics.moodCounts).map(([mood, count]) => {
              const percent = analytics.totalDreams > 0 ? (count / analytics.totalDreams) * 100 : 0;
              return (
                <div key={mood} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{mood}</span>
                    <span className="text-slate-400">
                      {count} ({percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${moodColors[mood] || 'bg-purple-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Jungian Archetypes & Symbols */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Recurring Jungian Archetypes
          </h3>
          {analytics.topSymbols.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No recurring symbols identified yet.</p>
          ) : (
            <div className="space-y-2.5 pt-2">
              {analytics.topSymbols.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-purple-900/50 text-purple-300 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-slate-200 capitalize">
                        {item.symbol}
                      </span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                        {item.category.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-indigo-300">
                    {item.count} {item.count === 1 ? 'occurrence' : 'occurrences'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
