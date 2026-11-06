import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CashflowTrendChart({ trends = [], currency = '₹' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!trends || trends.length === 0) return null;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{label}</p>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Inflow (Income):</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currency}{data.income?.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-rose-600 dark:text-rose-400 font-medium">Outflow (Expenses):</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currency}{data.expenses?.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-100 dark:border-slate-700">
            <span className="text-teal-600 dark:text-teal-400 font-medium">Net Savings:</span>
            <span className={`font-bold ${data.savings >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
              {currency}{data.savings?.toLocaleString('en-IN')} ({data.savings_rate}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Monthly Cashflow Trends
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparison of monthly inflows (income) versus outflows (expenses)
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Income</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis
              dataKey="month"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${currency}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              name="Inflow (Income)"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="expenses"
              name="Outflow (Expenses)"
              fill="#F43F5E"
              radius={[6, 6, 0, 0]}
              barSize={24}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
