import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  EyeOff, 
  Cpu, 
  Layers, 
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';

export default function LandingPage({ onLoadSample, selectedCurrency = '₹' }) {
  const { navigate } = useRouter();

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-cyan-500/15 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero-Storage Bank Statement Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Understand your financial health in <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">seconds</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Upload your bank statement in PDF, CSV, or Excel to get instant categorization, spending trends, and a transparent 0–100 Financial Health Score—processed 100% in memory.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Analyze My Statement</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleScrollToSection('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
            >
              <span>See how it works</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          {/* Supported formats preview */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <FileText className="h-3 w-3 text-red-500" />
              <span>PDF Statements</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <FileSpreadsheet className="h-3 w-3 text-emerald-500" />
              <span>CSV Spreadsheets</span>
            </span>
            <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <FileSpreadsheet className="h-3 w-3 text-blue-500" />
              <span>Excel (.xlsx, .xls)</span>
            </span>
          </div>
        </div>

        {/* Hero Dashboard Mockup / Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl shadow-slate-300/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
            <div className="rounded-[22px] bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
              
              {/* Mockup Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Sample Executive Summary</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Live Preview
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">HDFC_Bank_6Month_Statement.pdf &bull; Account: XXXX-XXXX-4589</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span>Score: 84 / 100 &bull; Excellent</span>
                  </span>
                </div>
              </div>

              {/* Mockup Body: 3-column stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Total Inflow</span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">₹3,90,000</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Salary & direct deposits</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Total Outflow</span>
                    <PieChart className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">₹2,63,250</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Expenses & monthly obligations</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Savings Rate</span>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">32.5%</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Exceeds 20% benchmark</p>
                </div>
              </div>

              {/* Mockup Mini Category Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Automated Category Breakdown</span>
                  <span className="text-[11px] text-slate-400">14 Categories Detected</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: '30%' }} className="bg-emerald-500" title="Housing & Rent 30%" />
                  <div style={{ width: '22%' }} className="bg-teal-500" title="Groceries & Food 22%" />
                  <div style={{ width: '18%' }} className="bg-cyan-500" title="EMI & Loans 18%" />
                  <div style={{ width: '15%' }} className="bg-blue-500" title="Investments 15%" />
                  <div style={{ width: '15%' }} className="bg-indigo-400" title="Other 15%" />
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span>Rent 30%</span></span>
                  <span className="inline-flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" /><span>Food 22%</span></span>
                  <span className="inline-flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-cyan-500" /><span>EMI 18%</span></span>
                  <span className="inline-flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /><span>Investments 15%</span></span>
                  <span className="inline-flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /><span>Other 15%</span></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <section id="problem-solution" className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              The Problem & The Solution
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why manual bank statement analysis fails—and how FinHealth fixes it.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* The Problem */}
            <div className="rounded-3xl p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-4 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  The Frustration with Raw Statements
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  Raw statements from banks are cluttered with cryptic merchant strings, multi-line UPI IDs (<code className="text-xs bg-rose-100 dark:bg-rose-900/60 px-1 py-0.5 rounded">UPI-509283-OKHDFC</code>), and fragmented debit rows.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold shrink-0">&times;</span>
                    <span>No straightforward way to know your true savings rate or cash buffer.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold shrink-0">&times;</span>
                    <span>Recurring subscriptions and hidden fees drain balances silently.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold shrink-0">&times;</span>
                    <span>Traditional fintech aggregators demand net-banking logins and retain your records permanently on cloud servers.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
                Result: Users stay in the dark or compromise their financial privacy.
              </div>
            </div>

            {/* The Solution */}
            <div className="rounded-3xl p-8 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-4 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  The FinHealth In-Memory Engine
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  FinHealth provides instantaneous, zero-storage intelligence. You simply drop an exported PDF, CSV, or Excel file without linking accounts or signing up.
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>In-memory parsers normalize messy columns and dates in volatile RAM.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Hybrid rule-engine and ML classifier sort transactions across 14 categories.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Computes a transparent 0–100 score, detects anomalies, and immediately discards data from memory.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                Result: Clear financial clarity in seconds with zero privacy exposure.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. KEY FEATURES (Card Grid) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Powerful Analytics
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Everything you need to audit and master your finances
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered with high-precision parsers, statistical anomaly detection, and automated categorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Feature 1 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 border border-emerald-200/50 dark:border-emerald-800/50 group-hover:scale-105 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Multi-Format Statement Ingestion
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload bank statements in PDF, CSV, or Excel (.xlsx/.xls) up to 15MB. Automatically detects delimiters, date formats, and column configurations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5 border border-teal-200/50 dark:border-teal-800/50 group-hover:scale-105 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Automatic Categorization
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Decomposes cryptic merchant handles and UPI VPA IDs into 14 distinct categories (Housing, Food, EMI, Utilities, Investments, and more).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5 border border-cyan-200/50 dark:border-cyan-800/50 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Spending Patterns & Trends
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track month-over-month cashflow velocity, savings surplus, and compare discretionary living expenses against baseline earnings.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 border border-blue-200/50 dark:border-blue-800/50 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Financial Health Score (0–100)
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent, deterministic score evaluated across 5 mathematical pillars: Savings Rate, Expense Ratio, Debt Burden, Runway Buffer, and Volatility.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 border border-amber-200/50 dark:border-amber-800/50 group-hover:scale-105 transition-transform">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Insights & Recommendations
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Personalized, rule-based suggestions highlighting potential savings opportunities, subscription audits, and 50/30/20 budget realignments.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-3xl p-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 border border-indigo-200/50 dark:border-indigo-800/50 group-hover:scale-105 transition-transform">
              <PieChart className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Visual Charts & PDF Export
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive Recharts cashflow graphs, category donuts, subscription detection tables, anomaly flags, and a one-click printable executive report.
            </p>
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Effortless Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How FinHealth works in 3 simple steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-emerald-500/20 dark:text-emerald-400/20">01</span>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Upload className="h-5 w-5" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload Statement
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Drag and drop your bank statement file (PDF, CSV, or Excel). No account registration or bank login credentials required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-emerald-500/20 dark:text-emerald-400/20">02</span>
                <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
                  <Cpu className="h-5 w-5" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Automatic Analysis
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The engine normalizes statement tables in volatile RAM, redacts sensitive account numbers, auto-categorizes transactions, and evaluates health metrics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-emerald-500/20 dark:text-emerald-400/20">03</span>
                <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Score & Insights
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Review your 0–100 Financial Health Score, examine category breakdowns, explore detected recurring subscriptions, and export an executive PDF report.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRIVACY FIRST SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
          
          {/* Background pattern */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Strict Privacy Architecture</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Your financial data never touches a database or disk.
            </h3>

            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
              Unlike commercial financial platforms that retain customer transaction archives indefinitely, FinHealth follows an uncompromising zero-storage protocol:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">100% Volatile RAM</h5>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Uploaded file streams are parsed exclusively in memory buffers (<code className="text-[10px] bg-black/40 px-1 py-0.5 rounded">io.BytesIO</code>) and never saved to disk.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <EyeOff className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Automated PII Redaction</h5>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Bank account digits, card numbers, and phone numbers are automatically sanitized and masked (<code className="text-[10px] bg-black/40 px-1 py-0.5 rounded">XXXX-XXXX-4589</code>).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Zero Cloud Persistence</h5>
                  <p className="text-xs text-emerald-200/70 mt-0.5">No databases, no cloud bucket stores, no third-party telemetry tracking, and zero advertiser sharing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Lock className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Discarded on Session End</h5>
                  <p className="text-xs text-emerald-200/70 mt-0.5">Once your HTTP request completes and your report renders, temporary memory references are purged immediately.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FINANCIAL HEALTH SCORE EXPLAINER */}
      <section className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Scoring Methodology
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Transparent 5-Pillar Health Score
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Unlike subjective or opaque credit scores, FinHealth uses a transparent mathematical 0–100 framework grounded in personal financial fundamentals.
            </p>
          </div>

          {/* 4 Tiers Visual Bar */}
          <div className="mb-14 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Excellent</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 my-1">80–100</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Optimal savings, low living costs, strong liquidity buffer</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
                <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-300">Good</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 my-1">65–79</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Stable fundamentals with room for minor optimization</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">Fair</span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 my-1">50–64</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Tight cashflow margins or higher debt servicing</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                <span className="text-xs font-bold uppercase text-rose-700 dark:text-rose-300">Needs Attention</span>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400 my-1">&lt; 50</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Expenses exceed income or depleted emergency reserve</p>
              </div>

            </div>
          </div>

          {/* 5 Contributing Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pillar 1</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">25 pts</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Savings Rate</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluates net surplus income against total earnings. Benchmarked against the standard 20%+ healthy savings threshold.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pillar 2</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">25 pts</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Expense-to-Income Ratio</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Measures total outflow burden. Living expenses &le;50% receive optimal points; &gt;90% flags immediate cashflow risk.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pillar 3</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">20 pts</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Debt & EMI Burden</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Assesses loan repayments and EMI servicing obligations against total inflow. DTI &le;15% is optimal; &gt;40% indicates debt stress.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pillar 4</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">15 pts</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Balance Stability & Buffer</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compares Average Daily Balance to monthly burn to determine months of cash runway, penalizing near-zero balance dips.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pillar 5</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">15 pts</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Spending Consistency</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates the statistical coefficient of variation (CV) of monthly outflows to detect irregular spending spikes and volatility.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ready to check your financial health?
        </h3>
        <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload your bank statement for instant analysis, or explore our interactive 6-month demo without uploading any files.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Analyze My Statement</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              navigate('/analyze');
              if (onLoadSample) onLoadSample();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Try 6-Month Demo ({selectedCurrency})</span>
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto space-y-6 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white">FinHealth</span>
                <span className="text-xs text-slate-400 font-medium">(Finsight AI)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Privacy-first, in-memory bank statement analytics &amp; financial health scoring engine.
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
              <Link to="/analyze" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Analyze</Link>
              <button type="button" onClick={() => handleScrollToSection('how-it-works')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How it works</button>
              <button type="button" onClick={() => handleScrollToSection('problem-solution')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Methodology</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Developed by <strong>Gagana M S</strong>, Dept. of AI &amp; ML, Alvas Institute of Engineering and Technology.</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Disclaimer: Provided for budgeting insights only. Does not constitute certified financial or investment advice.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
