import React from 'react';
import { ShieldCheck, Moon, Sun, RefreshCw, FileText, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useRouter } from '../context/RouterContext';

export default function Navbar({ onReset, onLoadSample, isLoaded, selectedCurrency, onCurrencyChange, isAnalyzing }) {
  const { theme, toggleTheme } = useTheme();
  const { currentPath, navigate } = useRouter();

  const handleBrandClick = () => {
    navigate('/');
  };

  const handleTryDemoClick = () => {
    if (currentPath !== '/analyze') {
      navigate('/analyze');
    }
    if (onLoadSample) onLoadSample();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand + Nav Links */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleBrandClick}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                  FinHealth
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
                Bank Statement &amp; Financial Health Intelligence
              </p>
            </div>
          </div>

          {/* Navigation links (Home and Analyze) */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-sm font-semibold">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentPath === '/'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentPath === '/analyze'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Analyze
            </Link>
          </nav>
        </div>

        {/* Center / Privacy indicator on desktop */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>100% In-Memory Processing &bull; Never Stored</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onCurrencyChange('₹')}
              className={`px-2 py-1 rounded-lg transition-all ${
                selectedCurrency === '₹'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Indian Rupee"
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => onCurrencyChange('$')}
              className={`px-2 py-1 rounded-lg transition-all ${
                selectedCurrency === '$'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="US Dollar"
            >
              $ USD
            </button>
          </div>

          {/* Quick Sample Demo Button or Upload New */}
          {!isLoaded ? (
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleTryDemoClick}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Try Demo</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Upload New</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
