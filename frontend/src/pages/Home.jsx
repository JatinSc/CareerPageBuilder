import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Search, Briefcase, Building2, ArrowRight, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/api/companies");
        // Add random rating between 4.0 and 5.0
        const companiesWithRatings = res.data.map(c => ({
          ...c,
          rating: (Math.random() * (5 - 4) + 4).toFixed(1)
        }));
        setCompanies(companiesWithRatings);
      } catch (err) {
        console.error("Failed to fetch companies", err);
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.branding?.headline && c.branding.headline.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-0 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">CareerBuilder</span>
          </div>
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
          >
            For Companies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Header / Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Company
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Discover companies hiring right now. Explore their culture, values, and open positions.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-lg"
              placeholder="Search companies by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-64 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <a
                key={company._id}
                href={`/${company.slug}/careers`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-16 w-16 rounded-lg border border-gray-100 p-2 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {company.branding?.logoUrl ? (
                      <img 
                        src={company.branding.logoUrl} 
                        alt={company.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="text-gray-400" size={32} />
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <Briefcase size={12} />
                    {company.jobCount} Openings
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-gray-700">{company.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                    {company.branding?.headline || "Building the future of technology."}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                  View Career Page <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-400" size={32} />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
             <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
