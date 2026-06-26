import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Search, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Database, 
  GitBranch, 
  LayoutDashboard 
} from 'lucide-react';

const Landing = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  // Load theme preference on mount
  useEffect(() => {
    const isDark = localStorage.getItem('theme') !== 'light';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden bg-grid-dots font-sans">
      
      {/* Glow highlight elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-lg border border-slate-200 dark:border-slate-800">
              SL
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Smart Lead CRM
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg border border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-xs cursor-pointer"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-1.5 text-slate-650 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white font-medium transition-all text-xs"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg border border-slate-900 dark:border-white hover:bg-slate-850 dark:hover:bg-slate-100 transition-all text-xs cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 max-w-7xl mx-auto text-center sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] pt-6">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-650 to-indigo-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Smart Leads CRM Portal
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            A secure full-stack dashboard demonstrating production-ready concepts in Java Spring Boot REST APIs, Hibernate MySQL structures, stateless JWT filters, and clean React JS interfaces.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg border border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-2 text-sm cursor-pointer shadow-sm"
              >
                Go to Dashboard
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg border border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-2 text-sm cursor-pointer shadow-sm"
                >
                  Create Student Demo Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all text-sm cursor-pointer"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Core Project Features & Implementation
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            Key software modules designed and built during the capstone cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">JWT Security Filters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Stateless authentication mapping. Intercepts incoming requests, decodes Bearer tokens, and loads credentials context safely.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">JPA Specification Queries</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enables dynamic database queries. Combines full-text search parameters with status and source dropdown filters.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">CSV Exports & Pagination</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Supports dataset downloading using Apache Commons CSV and features backend-driven database paging.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center">
          <div className="text-left">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">Smart Lead CRM</span>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right text-xs text-slate-400 dark:text-slate-500 space-y-1">
            <p>Database: MySQL (Aiven) | Host: Render Cloud Containers</p>
            <p>© 2026 Academic Submission. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
