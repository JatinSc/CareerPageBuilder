import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, MapPin, Briefcase, Clock, Calendar, Users } from "lucide-react";
export default function JobBoard({ jobs, branding }) {
  const primaryColor = branding.primaryColor || "#004d40";
  const primaryText = branding.primaryText || "#111827";
  const secondaryText = branding.secondaryText || "#6b7280";

  // Filters State
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    workPolicy: "",
    location: "",
    department: "",
    employmentType: ""
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Derived unique values for filters
  const options = useMemo(() => {
    if (!jobs) return { workPolicy: [], location: [], department: [], employmentType: [] };
    return {
      workPolicy: [...new Set(jobs.map(j => j.workPolicy).filter(Boolean))],
      location: [...new Set(jobs.map(j => j.location).filter(Boolean))],
      department: [...new Set(jobs.map(j => j.department).filter(Boolean))],
      employmentType: [...new Set(jobs.map(j => j.employmentType).filter(Boolean))]
    };
  }, [jobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  // Filter Logic
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
      const matchWorkPolicy = !filters.workPolicy || job.workPolicy === filters.workPolicy;
      const matchLocation = !filters.location || job.location === filters.location;
      const matchDepartment = !filters.department || job.department === filters.department;
      const matchEmploymentType = !filters.employmentType || job.employmentType === filters.employmentType;
      return matchSearch && matchWorkPolicy && matchLocation && matchDepartment && matchEmploymentType;
    });
  }, [jobs, search, filters]);

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
    // You might want to scroll to top of the job board instead of fixed 500
    const jobBoardElement = document.getElementById('job-board');
    if (jobBoardElement) {
        jobBoardElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div id="job-board">
        <div className="text-center mb-16 pt-10">
          <h1 className="text-4xl font-bold mb-4" style={{ color: primaryColor }}>Join the team, we're hiring! </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: secondaryText }}>
            Enough about us. We’re more interested in you. Hiring is in our blood, so if you’re bright, bold and after more than just a job, get in touch. We look forward to meeting you.
          </p>
        </div>
        {/* Filters Section */}
        <div className="space-y-4 mb-12">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none transition-all text-gray-700 bg-white"
              style={{ focusRingColor: primaryColor }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Dropdowns Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'workPolicy', label: 'Workplace', icon: Briefcase, opts: options.workPolicy },
              { key: 'location', label: 'Location', icon: MapPin, opts: options.location },
              { key: 'department', label: 'Department', icon: Users, opts: options.department },
              { key: 'employmentType', label: 'Type', icon: Clock, opts: options.employmentType }
            ].map(({ key, label, icon: Icon, opts }) => (
              <div key={key} className="relative group">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" size={16} />
                <select
                  className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 text-gray-700 py-2.5 pl-10 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-400 transition-all cursor-pointer text-sm truncate shadow-sm"
                  value={filters[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                >
                  <option value="">{label}</option>
                  {opts.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4 md:space-y-0">
          {currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <div
                key={job._id}
                className={`group relative flex flex-col md:flex-row md:items-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 md:bg-transparent md:p-0 md:rounded-none md:border-0 md:shadow-none md:py-6 md:px-2 md:hover:bg-gray-50 transition-all cursor-pointer ${index !== 0 ? 'md:border-t md:border-gray-100' : ''}`}
              >
                {/* Mobile Arrow */}
                <div className="absolute top-5 right-5 md:hidden text-gray-300 group-hover:text-gray-500 transition-colors">
                  <ChevronRight size={20} />
                </div>

                {/* Title & Date */}
                <div className="md:w-1/3 mb-4 md:mb-0 pr-8 md:pr-0">
                  <h3
                    className="text-lg md:text-lg font-bold mb-2 group-hover:text-opacity-80 transition-colors"
                    style={{ color: primaryColor }}
                  >
                    {job.title}
                  </h3>
                  
                  {/* Mobile Location & Date */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 md:hidden">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{job.location}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{job.postedDaysAgo || "New"}</span>
                    </div>
                  </div>

                  {/* Desktop Date */}
                  <p className="hidden md:block text-sm text-gray-500">
                    {job.postedDaysAgo || "Posted recently"}
                  </p>
                </div>

                {/* Meta Data Wrapper - Flex wrap on mobile, Contents on desktop */}
                <div className="flex flex-wrap gap-2 md:contents">
                    {/* Workplace Type */}
                    <div className="md:w-1/6 md:mb-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-purple-100 md:border-0 md:bg-transparent md:text-gray-500 md:p-0 md:text-base md:font-bold">
                        <Briefcase size={12} className="md:hidden text-emerald-400" />
                        {job.workPolicy}
                      </span>
                    </div>

                    {/* Location (Desktop Column) */}
                    <div className="hidden md:block md:w-1/4 text-gray-500">
                      {job.location}
                    </div>

                    {/* Department */}
                    <div className="md:w-1/6 md:mb-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100 md:border-0 md:bg-transparent md:text-gray-500 md:p-0 md:text-base">
                        <Users size={12} className="md:hidden text-amber-500" />
                        {job.department}
                      </span>
                    </div>

                    {/* Work Type */}
                    <div className="md:w-1/6 md:text-right">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 md:border-0 md:bg-transparent md:text-gray-500 md:p-0 md:text-base">
                        <Clock size={12} className="md:hidden text-blue-400" />
                        {job.employmentType}
                      </span>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No open positions matching your filters.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilters({ workPolicy: "", location: "", department: "", employmentType: "" });
                }}
                className="mt-4 text-sm font-medium hover:underline"
                style={{ color: primaryColor }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 md:mt-12 gap-3 md:gap-2 select-none">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center gap-1 w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
              <span className="hidden md:inline">Previous</span>
            </button>

            {/* Mobile Page Indicator */}
            <span className="text-sm text-gray-600 font-medium md:hidden">
              Page {currentPage} of {totalPages}
            </span>

            {/* Desktop Page Numbers */}
            <div className="hidden md:flex items-center gap-2">
              {getPageNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(number)}
                  disabled={number === '...'}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${number === '...'
                    ? 'border-transparent text-gray-400 cursor-default'
                    : currentPage === number
                      ? 'text-white shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  style={
                    currentPage === number
                      ? { backgroundColor: primaryColor, borderColor: primaryColor }
                      : {}
                  }
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center gap-1 w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              aria-label="Next Page"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
    </div>
  );
}
