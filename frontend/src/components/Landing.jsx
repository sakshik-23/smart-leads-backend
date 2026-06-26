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
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-semibold text-slate-655 dark:text-slate-400 font-mono">
              MCA Project
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            MCA Graduation Capstone Project
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Professional Lead Management &<br />
            <span className="bg-gradient-to-r from-slate-900 via-indigo-650 to-indigo-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Sales Pipeline CRM
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

      {/* College Capstone Dashboard Details (21st.dev Bento Grid style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              Academic Project Configuration
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 select-none font-mono">
              SYSTEM ARCHITECTURE // MYSQL ENTITIES RELATIONSHIPS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bento Block 1: Student & Tech Info */}
            <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-500 block mb-2 font-mono">
                  Project Portfolio Registry
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Full-Stack Architecture Specifications
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-100 dark:border-slate-850 p-3 rounded-lg">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Backend Stack</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">Java 17 / Spring Boot 4.x / Spring Security / JWT Stateless Auth / Hibernate JPA</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-3 rounded-lg">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">Frontend Client</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">React JS / Tailwind CSS v4 / Axios Interceptors / React Router v7</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 mt-6 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] text-slate-550 dark:text-slate-400">Deployed status: Live on Render (Docker container)</span>
                </div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                  DBMS: Aiven Cloud MySQL
                </span>
              </div>
            </div>

            {/* Bento Block 2: Database Schema Specification */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-500 block mb-2 font-mono">
                  Schema Registry
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Entity Relationship Model
                </h3>

                <div className="space-y-3 text-[11px] font-mono">
                  {/* User table mapping */}
                  <div className="border border-slate-150 dark:border-slate-800 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-1">
                      <span>TABLE: user</span>
                      <span className="text-indigo-500">[1]</span>
                    </div>
                    <ul className="text-slate-500 dark:text-slate-400 space-y-0.5">
                      <li>• id : BIGINT (PK)</li>
                      <li>• name : VARCHAR(255)</li>
                      <li>• email : VARCHAR(255) (UQ)</li>
                      <li>• password : VARCHAR(255) (Hashed)</li>
                      <li>• role : ENUM ('ADMIN', 'SALES')</li>
                    </ul>
                  </div>

                  {/* Lead table mapping */}
                  <div className="border border-slate-150 dark:border-slate-800 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-1">
                      <span>TABLE: lead</span>
                      <span className="text-violet-500">[N]</span>
                    </div>
                    <ul className="text-slate-500 dark:text-slate-400 space-y-0.5">
                      <li>• id : BIGINT (PK)</li>
                      <li>• name : VARCHAR(255)</li>
                      <li>• email : VARCHAR(255)</li>
                      <li>• status : ENUM (NEW, CONTACTED...)</li>
                      <li>• source : ENUM (WEBSITE, REFERRAL...)</li>
                      <li>• owner_id : BIGINT (FK ➔ user.id)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 justify-center text-[10px] text-slate-400 select-none">
                <Database className="w-3.5 h-3.5" />
                <span>Hibernate Auto-DDL Mappings Enabled</span>
              </div>
            </div>

          </div>

          {/* Interactive Preview Dashboard Preview (Simulating 21st.dev widgets) */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 mt-6 overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 dark:text-slate-500 block mb-3 font-mono">
              Live Mockup Preview // Render Environment
            </span>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">Smart Lead CRM Dashboard</span>
                <span className="text-xs text-slate-450 dark:text-slate-500 block mt-0.5">Mock lead pipeline metrics view</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-655 dark:text-slate-400 font-mono">
                  PORT: 8080
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-655 dark:text-slate-400 font-mono">
                  HTTPS
                </span>
              </div>
            </div>

            {/* Simulated Bento Metric Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-xs text-slate-450 dark:text-slate-500 block mb-1">Total Sourced Leads</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">1,248</span>
                  <span className="text-[10px] text-emerald-600 font-bold">↑ 12%</span>
                </div>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-xs text-slate-450 dark:text-slate-500 block mb-1">Conversion Ratio</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">24.6%</span>
                  <span className="text-[10px] text-indigo-600 font-bold">↑ 2.1%</span>
                </div>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-xs text-slate-450 dark:text-slate-500 block mb-1">Security Filters</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Active</span>
                  <span className="text-[10px] text-indigo-600 dark:text-slate-400 font-mono">JWT / RBAC</span>
                </div>
              </div>
            </div>

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
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
              MCA Final Year Capstone Project
            </span>
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
