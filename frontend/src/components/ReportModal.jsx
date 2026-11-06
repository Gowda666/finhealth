import React from 'react';
import { Printer, Download, X, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ data, onClose }) {
  if (!data) return null;

  const {
    summary = {},
    health_score = {},
    categories = [],
    recurring_payments = [],
    anomalies = [],
    recommendations = [],
    currency = '₹',
    account_number_masked = 'XXXX-XXXX-4589',
    filename = 'statement.csv'
  } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 relative">
        
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 no-print">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Health Executive Report
            </h2>
            <p className="text-xs text-slate-500">
              Print-ready summary and PDF downloadable report
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-8 text-slate-800 dark:text-slate-200">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                FinHealth
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Financial Health & Statement Analysis Report
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Account:</span> {account_number_masked}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">File:</span> {filename}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Period:</span> {summary.date_range_start} to {summary.date_range_end}</p>
              <p><span className="font-semibold text-slate-700 dark:text-slate-300">Report Date:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Health Score Callout */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Overall Health Score
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {health_score.tier}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {health_score.summary_text}
              </p>
            </div>

            <div className="text-center shrink-0">
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {health_score.total}
                <span className="text-xl text-slate-400 font-semibold">/100</span>
              </div>
            </div>
          </div>

          {/* Score Pillars Table */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              5-Pillar Score Breakdown
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Pillar Name</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Max</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {health_score.pillars?.map((p, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-semibold">{p.name}</td>
                      <td className="py-2 px-3 font-bold text-emerald-600">{p.score}</td>
                      <td className="py-2 px-3 text-slate-400">{p.max_score}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{p.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Cashflow Summary Grid */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Cashflow & Runway Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Total Inflows</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {currency}{summary.total_income?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Total Outflows</span>
                <span className="font-bold text-rose-600 text-base">
                  {currency}{summary.total_expenses?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Net Savings</span>
                <span className="font-bold text-emerald-600 text-base">
                  {currency}{summary.net_savings?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({summary.savings_rate}%)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Avg Daily Balance</span>
                <span className="font-bold text-blue-600 text-base">
                  {currency}{summary.avg_daily_balance?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Top Spending Categories Table */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Top Spending Categories
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3 text-right">% of Total</th>
                    <th className="py-2 px-3 text-right">Transactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.slice(0, 6).map((c, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-semibold">{c.category}</td>
                      <td className="py-2 px-3 text-right font-bold">{currency}{c.amount.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 text-right">{c.percentage}%</td>
                      <td className="py-2 px-3 text-right text-slate-400">{c.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Personalized Recommendations
            </h4>
            <div className="space-y-2 text-xs">
              {recommendations.slice(0, 4).map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                    <span>{r.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{r.impact} Impact</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 text-center leading-relaxed">
            <p>
              Generated by FinHealth &bull; Privacy Guaranteed: Processed 100% in memory &bull; Zero Statement Retention
            </p>
            <p className="mt-0.5">
              Disclaimer: This report is generated automatically for budgeting purposes and does not constitute certified financial, legal, or investment advice.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
