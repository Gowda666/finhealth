import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, FileText, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Download, CheckCircle2 } from 'lucide-react';

export default function HeroUpload({ onUpload, onLoadSample, isAnalyzing, progress, error, selectedCurrency }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const validExts = ['.pdf', '.csv', '.xlsx', '.xls'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExts.some(ext => lowerName.endsWith(ext));

    if (!isValid) {
      alert("Please upload a supported format: PDF, CSV, XLSX, or XLS.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit. Please upload a smaller statement file.");
      return;
    }

    setSelectedFile(file);
    onUpload(file);
  };

  const triggerUploadClick = () => {
    if (!isAnalyzing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-5 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Zero-Storage Bank Statement Analytics</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Understand where your money goes. <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
            Monitor your financial health.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload any bank statement (PDF, CSV, or Excel). In seconds, FinHealth auto-categorizes your transactions, 
          computes a transparent <span className="font-semibold text-slate-800 dark:text-slate-100">0–100 Financial Health Score</span>, 
          detects recurring subscriptions, and reveals spending anomalies.
        </p>
      </div>

      {/* Upload Box */}
      <div className="max-w-2xl mx-auto">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerUploadClick}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-emerald-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 shadow-xl shadow-slate-200/50 dark:shadow-none'
          } ${isAnalyzing ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950 dark:to-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform mb-5 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            ) : (
              <Upload className="h-8 w-8 stroke-[2]" />
            )}
          </div>

          {/* Upload Text */}
          {isAnalyzing ? (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Analyzing Bank Statement...
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Parsing transactions, running ML classification, and calculating score ({progress}%)
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Drag and drop your statement here, or <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4">browse</span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Supports PDF, CSV, or Excel (.xlsx, .xls) statements up to 15MB
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-red-500" />
                  <span>PDF Statement</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                  <span>CSV File</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-blue-500" />
                  <span>Excel (.xlsx/.xls)</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start space-x-3 text-sm">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to process statement</p>
              <p className="mt-0.5 text-rose-700 dark:text-rose-300 text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* Try with Sample Data CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={onLoadSample}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Try with Sample 6-Month Statement ({selectedCurrency})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Privacy & Security Guarantee */}
        <div className="mt-10 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-800 dark:text-white block text-sm mb-0.5">
                Privacy First: Zero-Storage Guarantee
              </span>
              Your statement is processed strictly in memory and discarded upon analysis. 
              We do not use a database, we do not store files, and account numbers are masked.
              <span className="block mt-1 text-slate-400 dark:text-slate-500 italic">
                Disclaimer: FinHealth provides automated budgeting insights and does not constitute certified financial or investment advice.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
