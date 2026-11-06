import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info, Award, X } from 'lucide-react';

export default function HealthScoreGauge({ healthScore }) {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  if (!healthScore) return null;

  const score = healthScore.total || 0;
  const tier = healthScore.tier || 'Good';
  const pillars = healthScore.pillars || [];
  const summaryText = healthScore.summary_text || '';

  // Gauge calculation for semi-circle / arc
  // Radius = 70, Circumference = 2 * PI * 70 = 439.8
  // Semi-circle arc length = PI * 70 = 219.9
  const radius = 70;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (arcLength * Math.min(score, 100)) / 100;

  // Dynamic Tier Colors
  const getTierBadge = () => {
    switch (tier) {
      case 'Excellent':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          stroke: '#10B981',
          text: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'Good':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          stroke: '#3B82F6',
          text: 'text-blue-600 dark:text-blue-400'
        };
      case 'Fair':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          stroke: '#F59E0B',
          text: 'text-amber-600 dark:text-amber-400'
        };
      default:
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          stroke: '#EF4444',
          text: 'text-rose-600 dark:text-rose-400'
        };
    }
  };

  const badgeTheme = getTierBadge();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left: Gauge Arc */}
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="relative w-48 h-28 flex items-end justify-center">
            <svg className="w-48 h-36 overflow-visible" viewBox="0 0 160 100">
              {/* Background Arc */}
              <path
                d="M 10 90 A 70 70 0 0 1 150 90"
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Colored Value Arc */}
              <path
                d="M 10 90 A 70 70 0 0 1 150 90"
                fill="none"
                stroke={badgeTheme.stroke}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {score}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="mt-3">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeTheme.bg}`}>
              <Award className="h-3.5 w-3.5" />
              <span>{tier} Financial Health</span>
            </span>
          </div>
        </div>

        {/* Center: Explanation & Summary */}
        <div className="flex-1 space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Health Overview
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {summaryText}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => setShowFormulaModal(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
              <span>How is this score computed? (5-Pillar Breakdown)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Quick Pillar Mini-Bars */}
        <div className="w-full lg:w-72 shrink-0 space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Key Pillars
          </span>
          {pillars.slice(0, 4).map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300 truncate">{p.name}</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  {p.score}/{p.max_score}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${p.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal: Score Formula & Pillars Breakdown */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
            
            <button
              type="button"
              onClick={() => setShowFormulaModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Financial Health Score Formula
                </h3>
                <p className="text-xs text-slate-500">
                  Deterministic 5-pillar mathematical model scaled to 100 points
                </p>
              </div>
            </div>

            <div className="space-y-4 my-6 text-sm text-slate-600 dark:text-slate-300">
              {pillars.map((pillar, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {pillar.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {pillar.score} / {pillar.max_score} pts ({pillar.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${pillar.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {pillar.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFormulaModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Close Explanation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
