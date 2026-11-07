import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Calendar, 
  FileCheck, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HeroUpload from './components/HeroUpload';
import HealthScoreGauge from './components/HealthScoreGauge';
import SummaryCards from './components/SummaryCards';
import CashflowTrendChart from './components/CashflowTrendChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import RecurringPayments from './components/RecurringPayments';
import AnomalyAlerts from './components/AnomalyAlerts';
import TransactionsTable from './components/TransactionsTable';
import Recommendations from './components/Recommendations';
import ReportModal from './components/ReportModal';
import { Link, useRouter } from './context/RouterContext';

import { uploadStatementFile, fetchSampleStatement } from './services/api';

export default function App() {
  const { currentPath, navigate } = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('₹');
  const [showReportModal, setShowReportModal] = useState(false);

  // Update dynamic page title based on current route
  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'FinHealth - Bank Statement Analysis & Financial Health Monitoring';
    } else {
      document.title = 'FinHealth Analyzer - Bank Statement Intelligence';
    }
  }, [currentPath]);

  // Trigger celebratory confetti if score is high
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleUpload = async (file) => {
    setIsAnalyzing(true);
    setUploadProgress(10);
    setError(null);
    if (currentPath !== '/analyze') {
      navigate('/analyze');
    }

    try {
      const data = await uploadStatementFile(file, (progress) => {
        setUploadProgress(Math.min(90, Math.max(15, progress)));
      });

      setUploadProgress(100);
      setAnalysisData(data);
      if (data.currency) {
        setSelectedCurrency(data.currency);
      }
      if (data.health_score?.total >= 75) {
        setTimeout(triggerConfetti, 400);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze statement. Please check file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = async () => {
    setIsAnalyzing(true);
    setUploadProgress(30);
    setError(null);
    if (currentPath !== '/analyze') {
      navigate('/analyze');
    }

    try {
      setUploadProgress(65);
      const data = await fetchSampleStatement(selectedCurrency);
      setUploadProgress(100);
      setAnalysisData(data);
      if (data.currency) {
        setSelectedCurrency(data.currency);
      }
      if (data.health_score?.total >= 75) {
        setTimeout(triggerConfetti, 400);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load sample demo. Please verify backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCurrencyChange = (newCurr) => {
    setSelectedCurrency(newCurr);
    if (analysisData) {
      // Reload sample with the new currency for demo consistency
      handleLoadSample();
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setUploadProgress(0);
    if (currentPath !== '/analyze') {
      navigate('/analyze');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        isLoaded={!!analysisData}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPath === '/' ? (
          /* Route: "/" -> Introduction / Landing Page */
          <LandingPage
            onLoadSample={handleLoadSample}
            selectedCurrency={selectedCurrency}
          />
        ) : (
          /* Route: "/analyze" -> Statement Analyzer & Live Dashboard */
          <div className="pb-16">
            {!analysisData ? (
              /* Upload / Dropzone Screen */
              <HeroUpload
                onUpload={handleUpload}
                onLoadSample={handleLoadSample}
                isAnalyzing={isAnalyzing}
                progress={uploadProgress}
                error={error}
                selectedCurrency={selectedCurrency}
              />
            ) : (
              /* Executive Analysis Dashboard */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in duration-500">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Financial Health Report
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Live Analysis
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span>File: {analysisData.filename}</span>
                      </span>
                      <span>&bull;</span>
                      <span>Account: {analysisData.account_number_masked}</span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span>
                          {analysisData.summary?.date_range_start} to {analysisData.summary?.date_range_end}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download / Print Report</span>
                    </button>
                  </div>
                </div>

                {/* Health Score Gauge */}
                <HealthScoreGauge
                  healthScore={analysisData.health_score}
                />

                {/* Inflow / Outflow / Savings Summary Cards */}
                <SummaryCards
                  summary={analysisData.summary}
                  currency={analysisData.currency || selectedCurrency}
                />

                {/* 2-Column Grid: Cashflow Chart & Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7">
                    <CashflowTrendChart
                      trends={analysisData.monthly_trends}
                      currency={analysisData.currency || selectedCurrency}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <CategoryBreakdown
                      categories={analysisData.categories}
                      currency={analysisData.currency || selectedCurrency}
                    />
                  </div>
                </div>

                {/* 2-Column Grid: Recurring Payments & Anomaly Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RecurringPayments
                    recurring={analysisData.recurring_payments}
                    currency={analysisData.currency || selectedCurrency}
                  />
                  <AnomalyAlerts
                    anomalies={analysisData.anomalies}
                    currency={analysisData.currency || selectedCurrency}
                  />
                </div>

                {/* Personalized Recommendations */}
                <Recommendations
                  recommendations={analysisData.recommendations}
                  currency={analysisData.currency || selectedCurrency}
                />

                {/* Full Transactions Ledger */}
                <TransactionsTable
                  transactions={analysisData.transactions}
                  currency={analysisData.currency || selectedCurrency}
                />

              </div>
            )}

            {/* Footer for /analyze route */}
            <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 mt-16 text-center text-xs text-slate-500 dark:text-slate-400 space-y-4 no-print bg-white/50 dark:bg-slate-900/40">
              <div className="max-w-7xl mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">FinHealth (Finsight AI)</span>
                    <span>&bull;</span>
                    <span className="text-[11px] text-slate-400">Zero Persistent Storage Architecture</span>
                  </div>
                  <div className="flex items-center space-x-4 font-medium">
                    <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
                    <Link to="/analyze" className="text-emerald-600 dark:text-emerald-400 font-bold">Analyze</Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Developed by <strong>Gagana M S</strong>, Dept. of AI &amp; ML, Alvas Institute of Engineering and Technology.</span>
                  </div>
                  <p className="text-slate-400 dark:text-slate-500">
                    Disclaimer: FinHealth provides automated budgeting insights and does not constitute certified financial or investment advice.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Executive Report Modal */}
      {showReportModal && (
        <ReportModal
          data={analysisData}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
}
