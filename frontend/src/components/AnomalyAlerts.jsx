import React from 'react';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function AnomalyAlerts({ anomalies = [], currency = '₹' }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card flex items-center space-x-3.5">
        <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Zero Spending Anomalies Detected
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            All outflows are within statistical expectation based on your spending history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
      <div className="flex items-center space-x-2.5 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Unusual Outflows & Spending Anomalies ({anomalies.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detected via dynamic interquartile range (IQR) and scikit-learn IsolationForest
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {anomalies.map((anom, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {anom.description}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  anom.severity === 'high'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {anom.severity} Alert
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {anom.reason}
              </p>
              <span className="text-[10px] text-slate-400 block">
                {anom.date} &bull; Category: {anom.category}
              </span>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 block">
                -{currency}{anom.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
