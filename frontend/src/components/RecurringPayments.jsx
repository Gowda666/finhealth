import React from 'react';
import { RefreshCw, Repeat, Calendar, CheckCircle } from 'lucide-react';

export default function RecurringPayments({ recurring = [], currency = '₹' }) {
  if (!recurring || recurring.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
        <div className="flex items-center space-x-2 mb-3">
          <Repeat className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recurring Payments & Subscriptions
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No recurring subscriptions or periodic bills detected in this statement period.
        </p>
      </div>
    );
  }

  const totalMonthlyCommitment = recurring.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Repeat className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recurring Payments & Subscriptions
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detected repeating obligations, streaming memberships, and loan EMIs
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300">
          Est. {currency}{totalMonthlyCommitment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo total
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {recurring.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[170px]">
                  {item.name}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {item.frequency}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{item.category}</span>
                <span>&bull;</span>
                <span>Observed {item.count}x</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                {currency}{item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-slate-400">
                Last: {item.last_date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
