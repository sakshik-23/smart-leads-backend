import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  LogOut, Plus, Search, Filter, RefreshCw, Download, Trash2, Edit,
  User, Sun, Moon, Database, ChevronLeft, ChevronRight, Phone, CheckCircle,
  XCircle, TrendingUp, Compass, Award, ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('DESC');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  
  // Metrics State
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    status: 'NEW',
    source: 'WEBSITE'
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Theme & User
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Load theme preference
  useEffect(() => {
    const isDark = localStorage.getItem('theme') !== 'light';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme
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

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0); // Reset page on new search
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Fetch leads and update metrics
  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;

      const response = await api.get('/leads', { params });
      setLeads(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);

      // Fetch all for local metrics computation (only admin sees aggregate metrics)
      const allRes = await api.get('/leads', { 
        params: { page: 0, size: 1000 } 
      });
      const allLeads = allRes.data.content || [];
      computeMetrics(allLeads);
    } catch (err) {
      setError('Failed to fetch leads from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [debouncedSearch, statusFilter, sourceFilter, sortBy, sortDir, currentPage]);

  const computeMetrics = (leadsList) => {
    const stats = { total: leadsList.length, new: 0, contacted: 0, qualified: 0, lost: 0 };
    leadsList.forEach(l => {
      if (l.status === 'NEW') stats.new++;
      if (l.status === 'CONTACTED') stats.contacted++;
      if (l.status === 'QUALIFIED') stats.qualified++;
      if (l.status === 'LOST') stats.lost++;
    });
    setMetrics(stats);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    let url = 'http://localhost:8080/api/leads/export?';
    if (debouncedSearch) url += `search=${encodeURIComponent(debouncedSearch)}&`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (sourceFilter) url += `source=${sourceFilter}&`;
    
    // Add Token in Query parameter or trigger file download
    // Since our backend endpoint validates Bearer token, we can fetch it via api and trigger download in JS
    api.get(`/leads/export`, {
      params: {
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined
      },
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'leads_export.csv';
      link.click();
    }).catch(() => {
      alert('Failed to export leads.');
    });
  };

  // Save or Update Lead
  const handleSaveLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingLeadId) {
        await api.put(`/leads/${editingLeadId}`, leadForm);
      } else {
        await api.post('/leads', leadForm);
      }
      setModalOpen(false);
      resetForm();
      fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while saving lead.');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Lead
  const handleEditClick = (lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source
    });
    setModalOpen(true);
  };

  // Delete Lead
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete lead.');
      }
    }
  };

  const resetForm = () => {
    setLeadForm({ name: '', email: '', status: 'NEW', source: 'WEBSITE' });
    setEditingLeadId(null);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSourceFilter('');
    setSortBy('createdAt');
    setSortDir('DESC');
    setCurrentPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'CONTACTED': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'LOST': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'WEBSITE': return 'bg-indigo-500/10 text-indigo-400';
      case 'INSTAGRAM': return 'bg-pink-500/10 text-pink-400';
      case 'REFERRAL': return 'bg-purple-500/10 text-purple-400';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const conversionRate = metrics.total > 0 
    ? ((metrics.qualified / metrics.total) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 dark:bg-slate-900/50 backdrop-blur sticky top-0 z-10 px-6 py-4 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-650 rounded-lg text-white">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Smart Leads</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lead Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-850 pr-4">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-bold border border-slate-300 dark:border-slate-700">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.name || 'User'}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                  user.role === 'ADMIN' 
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-650 dark:border-rose-500/20 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800/50 dark:text-red-200 p-4 rounded-xl text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-650 hover:text-red-800 dark:text-red-400 dark:hover:text-white font-bold">×</button>
          </div>
        )}

        {/* Analytics Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-lg">
            <div className="absolute top-4 right-4 text-indigo-500/10 dark:text-indigo-500/20"><TrendingUp className="w-8 h-8" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Leads</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{metrics.total}</p>
          </div>
          <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-lg">
            <div className="absolute top-4 right-4 text-blue-500/10 dark:text-blue-500/20"><Phone className="w-8 h-8" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">New Leads</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{metrics.new}</p>
          </div>
          <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-lg">
            <div className="absolute top-4 right-4 text-amber-500/10 dark:text-amber-500/20"><Compass className="w-8 h-8" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Contacted</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{metrics.contacted}</p>
          </div>
          <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-lg">
            <div className="absolute top-4 right-4 text-emerald-500/10 dark:text-emerald-500/20"><CheckCircle className="w-8 h-8" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Qualified</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.qualified}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">({conversionRate}%)</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-5 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-lg col-span-2 lg:col-span-1">
            <div className="absolute top-4 right-4 text-rose-500/10 dark:text-rose-500/20"><XCircle className="w-8 h-8" /></div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Lost Leads</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{metrics.lost}</p>
          </div>
        </section>

        {/* Filters and Actions */}
        <section className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 p-6 rounded-2xl shadow-sm dark:shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto md:flex-grow max-w-4xl">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Source Filter */}
            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(0); }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                <option value="">All Sources</option>
                <option value="WEBSITE">Website</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="REFERRAL">Referral</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleResetFilters}
              className="p-2.5 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-850 transition-all text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl transition-all text-sm font-semibold shadow-sm shadow-indigo-600/10 dark:shadow-indigo-900/30"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </section>

        {/* Lead Table */}
        <section className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading leads data...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
              <div className="p-4 bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 rounded-full mb-4">
                <Database className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No leads found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Try adjusting your filters, searching for another keyword, or adding a new lead record to the list.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:bg-slate-950/20 text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Source</th>
                    <th className="py-4 px-6">Assigned To</th>
                    <th className="py-4 px-6 cursor-pointer hover:text-slate-800 dark:hover:text-white" onClick={() => {
                      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                      setSortBy('createdAt');
                    }}>
                      Created At {sortBy === 'createdAt' && (sortDir === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-sm text-slate-650 dark:text-slate-300">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="py-4 px-6 text-slate-900 dark:text-white font-medium">{lead.name}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{lead.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getSourceColor(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-550 dark:text-slate-400">{lead.assignedToName || 'Unassigned'}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditClick(lead)}
                            className="p-1.5 text-slate-500 hover:text-indigo-650 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-indigo-400 dark:bg-slate-800/30 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Edit Lead"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {user.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteClick(lead.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-650 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-rose-400 dark:bg-slate-800/30 dark:hover:bg-slate-800 rounded transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {leads.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 text-sm text-slate-500 dark:text-slate-400">
              <div>
                Showing <span className="text-slate-900 dark:text-white font-medium">{currentPage * pageSize + 1}</span> to{' '}
                <span className="text-slate-900 dark:text-white font-medium">
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span>{' '}
                of <span className="text-slate-900 dark:text-white font-medium">{totalElements}</span> records
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* CRUD Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingLeadId ? 'Edit Lead Record' : 'Add New Lead'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-white text-2xl font-bold font-sans"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Lead Name</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="e.g. Rahul Kumar"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Status</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm"
                  >
                    <option value="WEBSITE">Website</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:hover:text-white rounded-xl text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-650/10 dark:shadow-indigo-900/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
