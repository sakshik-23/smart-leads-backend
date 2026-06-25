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
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Layers 
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      
      {/* Background decoration gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-violet-600/5 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-650 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20">
              SL
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Smart Lead CRM
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/10 transition-all text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-slate-650 hover:text-slate-900 dark:text-slate-355 dark:hover:text-white font-semibold transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/10 transition-all text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 max-w-7xl mx-auto text-center sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 rounded-full text-xs font-semibold text-indigo-750 dark:text-indigo-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Designed for Modern Sales & Marketing Pipelines
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Transform Your Lead Pipeline with{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Smart Lead CRM
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            An enterprise-level full-stack dashboard designed to help sales reps and administrators manage, analyze, and export sales leads. Driven by Spring Boot JWT security, Hibernate MySQL database, and dynamic React components.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-transform flex items-center gap-2 text-base"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-transform flex items-center gap-2 text-base"
                >
                  Get Started For Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-[1.02] transition-all text-base"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Preview / UI Mockup */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl dark:shadow-indigo-500/5 transition-colors duration-200">
          
          {/* Mockup Header Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 select-none">
                http://localhost:5173/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md font-mono select-none">
                Demo Preview
              </span>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Leads</span>
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-3xl font-black text-slate-850 dark:text-white">1,248</span>
              <span className="block text-xs text-indigo-650 dark:text-indigo-400 mt-2 font-medium">↑ 12% increase this month</span>
            </div>

            <div className="bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Conversion Rate</span>
                <TrendingUp className="w-5 h-5 text-violet-500" />
              </div>
              <span className="text-3xl font-black text-slate-850 dark:text-white">24.6%</span>
              <span className="block text-xs text-violet-650 dark:text-violet-400 mt-2 font-medium">↑ 2.1% from last week</span>
            </div>

            <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Active Projects</span>
                <Layers className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-3xl font-black text-slate-850 dark:text-white">4 Active</span>
              <span className="block text-xs text-purple-650 dark:text-purple-400 mt-2 font-medium">Distributed via 3 channels</span>
            </div>
          </div>

          <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">Search leads by name, email...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-500">Status: All</span>
                <span className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-500">Source: All</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 uppercase tracking-wider font-semibold">
                    <th className="pb-3 pt-1 pl-2">Name</th>
                    <th className="pb-3 pt-1">Email</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-650 dark:text-slate-350">
                  <tr>
                    <td className="py-3 pl-2 font-medium text-slate-800 dark:text-white">Sarah Jenkins</td>
                    <td className="py-3">sarah.j@company.com</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 font-semibold text-[10px]">QUALIFIED</span></td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">WEBSITE</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-medium text-slate-800 dark:text-white">David Miller</td>
                    <td className="py-3">d.miller@gmail.com</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold text-[10px]">NEW</span></td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">INSTAGRAM</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 pl-2 font-medium text-slate-800 dark:text-white">Elena Rostova</td>
                    <td className="py-3">elena.rostova@yandex.com</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 font-semibold text-[10px]">CONTACTED</span></td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">REFERRAL</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-850 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Powerful Features Under the Hood
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              Explore the advanced features implemented in this MCA Capstone project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-650 dark:text-indigo-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Metrics Dashboard</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Instantly view high-level metrics like conversion ratios, pipeline totals, and source distribution charts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-650 dark:text-violet-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Advanced Filtering</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Search leads dynamically via Spring Data JPA Specifications. Filter combined criteria with full pagination support.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-650 dark:text-purple-400 flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">CSV Data Export</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Export lead information directly to `.csv` format. Built with Apache Commons CSV backend generation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-650 dark:text-pink-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Role Security & JWT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Stateless JWT security with Role-Based Access Control (RBAC). Restricts admin controls from standard sales reps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Technical Implementation Architecture</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Full stack MCA capstone architecture configuration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900/50">
            <h4 className="font-bold text-indigo-650 dark:text-indigo-400 mb-2">Frontend Client</h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1.5">
              <li>• React 19 Single Page App</li>
              <li>• Tailwind CSS v4 Styling</li>
              <li>• React Router v7 & Axios</li>
              <li>• Lucide Responsive Icons</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900/50">
            <h4 className="font-bold text-violet-650 dark:text-violet-400 mb-2">Java Backend</h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1.5">
              <li>• Spring Boot 4 Enterprise</li>
              <li>• Spring Security & Stateless JWT</li>
              <li>• JPA Specifications & Hibernate</li>
              <li>• Maven Builder Setup</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900/50">
            <h4 className="font-bold text-purple-655 dark:text-purple-400 mb-2">Database & Infrastructure</h4>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1.5">
              <li>• MySQL Relational DB</li>
              <li>• Entity Relationship Mapping</li>
              <li>• Docker Multi-container Dev</li>
              <li>• Dynamic Port Mappings</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 text-center text-sm text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-950 transition-colors duration-200">
        <p className="font-semibold text-slate-550 dark:text-slate-400 mb-1">Smart Lead CRM — Capstone Project</p>
        <p className="text-xs text-slate-400">Built using React & Spring Boot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
