import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CategoryBreakdown({ categories = [], currency = '₹' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const { theme } = useTheme();

  if (!categories || categories.length === 0) return null;

  const totalExpense = categories.reduce((sum, c) => sum + (c.amount || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{data.category}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {currency}{data.amount?.toLocaleString('en-IN')} ({data.percentage}%)
          </p>
          <p className="text-slate-400 text-[10px]">{data.count} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm dashboard-card">
      <div className="flex items-center space-x-2 mb-6">
        <PieIcon className="h-5 w-5 text-indigo-500" />
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Category Spending Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Auto-categorized expenses distribution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Donut Chart */}
        <div className="md:col-span-5 h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || '#6366F1'}
                    stroke="none"
                    className="transition-all duration-300"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Outflow
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {currency}{Math.round(totalExpense).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Ranked Category List */}
        <div className="md:col-span-7 space-y-3.5 max-h-72 overflow-y-auto pr-1">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || '#6366F1' }}
                  />
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                    {cat.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({cat.count} txns)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 dark:text-white font-bold">
                    {currency}{cat.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-slate-400 ml-1.5 font-normal">
                    ({cat.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color || '#6366F1'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
