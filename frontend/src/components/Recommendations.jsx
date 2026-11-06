import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingDown, Sparkles } from 'lucide-react';

export default function Recommendations({ recommendations = [], currency = '₹' }) {
  if (!recommendations || recommendations.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-indigo-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20';
      case 'success':
        return 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20';
      case 'tip':
        return 'border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20';
      default:
        return 'border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Smart Financial Health Recommendations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated rule-based insights and optimizations tailored to your statement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-5 rounded-2xl border ${getBorderColor(rec.type)} flex flex-col justify-between space-y-3 transition-all hover:shadow-sm`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon(rec.type)}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  rec.impact === 'High'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {rec.impact} Impact
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>

            {rec.potential_monthly_savings && (
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Potential Monthly Savings:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{currency}{rec.potential_monthly_savings.toLocaleString('en-IN')}/mo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
