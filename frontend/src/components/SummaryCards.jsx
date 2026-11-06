import React from 'react';
import { ArrowDownRight, ArrowUpRight, PiggyBank, Calendar, Wallet, AlertOctagon } from 'lucide-react';

export default function SummaryCards({ summary, currency = '₹' }) {
  if (!summary) return null;

  const {
    total_income = 0,
    total_expenses = 0,
    net_savings = 0,
    savings_rate = 0,
    avg_monthly_income = 0,
    avg_daily_balance = 0,
    low_balance_days = 0,
    transaction_count = 0,
    date_range_start = '',
    date_range_end = ''
  } = summary;

  const cards = [
    {
      title: 'Total Inflow (Income)',
      amount: total_income,
      subtext: `Avg ${currency}${avg_monthly_income.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo`,
      icon: ArrowUpRight,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200/60 dark:border-emerald-900/60'
    },
    {
      title: 'Total Outflows (Expenses)',
      amount: total_expenses,
      subtext: `${transaction_count} recorded transactions`,
      icon: ArrowDownRight,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/60',
      borderColor: 'border-rose-200/60 dark:border-rose-900/60'
    },
    {
      title: 'Net Savings',
      amount: net_savings,
      badge: `${savings_rate > 0 ? '+' : ''}${savings_rate.toFixed(1)}% savings rate`,
      badgeColor: savings_rate >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      icon: PiggyBank,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950/60',
      borderColor: 'border-teal-200/60 dark:border-teal-900/60'
    },
    {
      title: 'Average Daily Balance',
      amount: avg_daily_balance,
      subtext: low_balance_days > 0 ? `${low_balance_days} low-balance days detected` : 'Safe cushion maintained',
      subtextColor: low_balance_days > 0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-500',
      icon: Wallet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'border-blue-200/60 dark:border-blue-900/60'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`p-2.5 rounded-2xl ${c.bgColor} border ${c.borderColor} ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currency}{c.amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>

              <div className="flex items-center justify-between pt-1">
                {c.badge ? (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                ) : (
                  <span className={`text-xs ${c.subtextColor || 'text-slate-500 dark:text-slate-400'}`}>
                    {c.subtext}
                  </span>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
