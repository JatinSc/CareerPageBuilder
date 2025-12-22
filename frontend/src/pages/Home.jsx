import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Search, Briefcase, Building2, ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCompanies = async (searchQuery, pageNum) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/companies?page=${pageNum}&limit=9&search=${searchQuery}`);
      // Add random rating between 4.0 and 5.0
      const companiesWithRatings = res.data.companies.map(c => ({
        ...c,
        rating: (Math.random() * (5 - 4) + 4).toFixed(1)
      }));
      setCompanies(companiesWithRatings);
      setTotalPages(res.data.pagination.totalPages);
      setTotalCount(res.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch companies", err);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCompanies(search, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page > 1) { // Skip first render as search effect handles it
        fetchCompanies(search, page);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 relative overflow-hidden">
      {/* Fixed Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CareerBuilder</span>
          </div>
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all shadow-lg shadow-black/20"
          >
            For Companies
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 border-b border-slate-800/50 bg-slate-950/50">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TrendingUp size={14} />
            <span>Discover Top Opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-500 delay-100">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Dream Company</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200 leading-relaxed">
            Explore companies hiring right now. Dive into their culture, values, and open positions to find the perfect fit.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 bg-slate-900/80 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none text-lg text-white placeholder-slate-500 shadow-xl shadow-black/20"
              placeholder="Search companies by name or headline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-white">Featured Companies</h2>
           <div className="text-sm text-slate-400">
             Showing {companies.length} of {totalCount} result{totalCount !== 1 ? 's' : ''}
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 h-72 animate-pulse">
                <div className="flex justify-between mb-6">
                   <div className="h-16 w-16 bg-slate-800 rounded-xl"></div>
                   <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-7 w-3/4 bg-slate-800 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-800 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-slate-800 rounded mb-8"></div>
                <div className="h-10 w-full bg-slate-800 rounded-xl mt-auto"></div>
              </div>
            ))}
          </div>
        ) : companies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                <a
                    key={company._id}
                    href={`/${company.slug}/careers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-6">
                    <div className="h-16 w-16 rounded-xl border border-slate-700/50 p-2 flex items-center justify-center bg-slate-950 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {company.branding?.logoUrl ? (
                        <img 
                            src={company.branding.logoUrl} 
                            alt={company.name} 
                            className="w-full h-full object-contain"
                        />
                        ) : (
                        <Building2 className="text-slate-600" size={32} />
                        )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                        <Briefcase size={12} />
                        {company.jobCount} Openings
                    </span>
                    </div>

                    <div className="flex-1 mb-6">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {company.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-amber-500">{company.rating}</span>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2 h-10 leading-relaxed">
                        {company.branding?.headline || "Building the future of technology."}
                    </p>
                    </div>

                    <div className="mt-auto pt-5 border-t border-slate-800 flex items-center justify-between text-blue-400 font-medium text-sm">
                    <span className="group-hover:text-blue-300 transition-colors">View Career Page</span>
                    <div className="bg-blue-500/10 p-1.5 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                    </div>
                </a>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <span className="text-slate-400 font-medium">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
             <div className="mx-auto w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                <Search className="text-slate-600" size={40} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No companies found</h3>
             <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any companies matching "{search}". Try searching for a different name or keyword.</p>
             <button 
                onClick={() => setSearch("")}
                className="mt-6 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
             >
               Clear Search
             </button>
          </div>
        )}
      </div>
      
      {/* Footer Simple */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-slate-600 text-sm">© {new Date().getFullYear()} CareerBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
