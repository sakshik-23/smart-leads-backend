import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  LogOut, Plus, Search, RefreshCw, Download, Trash2, Edit,
  Database, ChevronLeft, ChevronRight, Phone, CheckCircle,
  XCircle, TrendingUp, Compass, Sun, Moon, GraduationCap, LayoutDashboard
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
      case 'NEW': return 'bg-blue-50 dark:bg-blue-950/40 text-blue-750 dark:text-blue-450 border-blue-200 dark:border-blue-800/40';
      case 'CONTACTED': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-750 dark:text-amber-450 border-amber-200 dark:border-amber-800/40';
      case 'QUALIFIED': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-750 dark:text-emerald-450 border-emerald-200 dark:border-emerald-800/40';
      case 'LOST': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-750 dark:text-rose-450 border-rose-200 dark:border-rose-800/40';
      default: return 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'WEBSITE': return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400';
      case 'INSTAGRAM': return 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400';
      case 'REFERRAL': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400';
      default: return 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400';
    }
  };

  const conversionRate = metrics.total > 0 
    ? ((metrics.qualified / metrics.total) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white dark:bg-slate-900 sticky top-0 z-40 px-6 py-3.5 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold border border-slate-200 dark:border-slate-800">
              SL
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Smart Lead CRM
                <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded text-[9px] font-semibold text-slate-500 font-mono">
                  STUDENT PORTAL
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">MCA CAPSTONE PROJECT</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-2.5 border-r border-slate-200 dark:border-slate-800 pr-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-350 font-bold border border-slate-200 dark:border-slate-700 text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name || 'User'}</p>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-1 rounded font-bold font-mono">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-white rounded-lg transition-all text-xs font-semibold cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/40 dark:text-red-300 p-3.5 rounded-lg text-xs flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-800 dark:text-red-400 font-bold text-lg select-none cursor-pointer">×</button>
          </div>
        )}

        {/* Bento Grid Analytics (21st.dev design spec) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Main Bento Hero Card: Overview & Conversion Rate */}
          <div className="md:col-span-2 border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1 font-mono">
                Pipeline Efficiency
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sales Conversion Ratio</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Ratio of qualified leads against total sourcing volume.</p>
            </div>
            
            <div className="text-right border-l border-slate-150 dark:border-slate-800 pl-6 shrink-0">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{conversionRate}%</span>
              <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-450 mt-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-1.5 py-0.5 rounded">
                ↑ 2.4% this week
              </span>
            </div>
          </div>

          {/* Bento Card 2: Total Leads */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Volume
              </span>
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total}</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-1">Total leads registered</span>
            </div>
          </div>

          {/* Bento Card 3: Status Breakdown mini summary */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Pipeline Stages
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
              <div className="border border-slate-100 dark:border-slate-850 p-1.5 rounded">
                <span className="block text-slate-400 uppercase text-[9px]">NEW</span>
                <span className="font-bold text-slate-800 dark:text-white">{metrics.new}</span>
              </div>
              <div className="border border-slate-100 dark:border-slate-850 p-1.5 rounded">
                <span className="block text-slate-400 uppercase text-[9px]">ACTIVE</span>
                <span className="font-bold text-slate-800 dark:text-white">{metrics.contacted}</span>
              </div>
            </div>
          </div>

        </section>

        {/* Action Panel: Filters & Buttons */}
        <section className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:flex-grow max-w-4xl">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 transition-all"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-xs text-slate-650 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Source Dropdown */}
            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(0); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-xs text-slate-655 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 cursor-pointer"
              >
                <option value="">All Sources</option>
                <option value="WEBSITE">Website</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="REFERRAL">Referral</option>
              </select>
            </div>
          </div>

          {/* Action trigger group */}
          <div className="flex gap-2 w-full lg:w-auto shrink-0 justify-end">
            <button
              onClick={handleResetFilters}
              className="p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 transition-all text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            
            <button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-white rounded-lg transition-all text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Lead
            </button>
          </div>

        </section>

        {/* Lead Grid/Table Section */}
        <section className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <svg className="animate-spin h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs">Loading leads from MySQL...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="p-3 bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-550 rounded-full mb-3 border border-slate-200 dark:border-slate-700">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No lead records found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">No matching lead rows resolved. Update filters or register a new record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-450 uppercase font-semibold">
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Source</th>
                    <th className="py-3 px-5">Assigned Agent</th>
                    <th className="py-3 px-5 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => {
                      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                      setSortBy('createdAt');
                    }}>
                      Created At {sortBy === 'createdAt' && (sortDir === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-655 dark:text-slate-350 font-sans">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                      <td className="py-3 px-5 text-slate-900 dark:text-white font-medium">{lead.name}</td>
                      <td className="py-3 px-5">{lead.email}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSourceColor(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-mono text-[11px] text-slate-500 dark:text-slate-450">
                        {lead.assignedToName || 'Unassigned'}
                      </td>
                      <td className="py-3 px-5 text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleEditClick(lead)}
                            className="p-1 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Edit Lead"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {user.role === 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteClick(lead.id)}
                              className="p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* Pagination */}
          {leads.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 text-xs text-slate-500 dark:text-slate-400">
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
                  className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Modal dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-lg p-6 relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150 dark:border-slate-850">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                {editingLeadId ? 'Modify Lead Record' : 'Record New Sourced Lead'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-655 dark:hover:text-white text-xl font-bold cursor-pointer select-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Lead Name</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Rahul Kumar"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="rahul@gmail.com"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 cursor-pointer text-xs"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-450 dark:focus:ring-slate-700 cursor-pointer text-xs"
                  >
                    <option value="WEBSITE">Website</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 mt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 dark:hover:text-white rounded-lg text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-850 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-white rounded-lg text-xs font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
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
