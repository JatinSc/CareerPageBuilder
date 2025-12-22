import { useEffect, useState } from "react";
import api from "../api/axios";
import Sections from "../components/sections/Sections";
import Branding from "../components/branding/Branding";
import PublishToggle from "../components/PublishToggle/PublishToggle";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Palette, Layers, Settings, LogOut, ExternalLink, Eye, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import PageLoader from "../components/ui/PageLoader";

export default function Editor() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("editorActiveTab") || "branding");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("editorActiveTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyRes = await api.get("/api/company/me");
        const sectionsRes = await api.get("/api/sections");
        setCompany(companyRes.data);
        setSections(sectionsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Failed to load data");
        // If 401, redirect to login might be handled by axios interceptor or here
        if (err.response?.status === 401) navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  if (!company) {
    return <PageLoader text="Loading Editor..." />;
  }

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id
          ? "bg-blue-600/10 text-blue-400 shadow-sm font-medium border border-blue-600/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 relative overflow-hidden">
      {/* Fixed Background Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-40 transform transition-transform duration-300 md:transform-none md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xl">
            <LayoutDashboard />
            <span>CareerBuilder</span>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem id="branding" icon={Palette} label="Branding" />
          <NavItem id="sections" icon={Layers} label="Content Sections" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="font-medium truncate text-slate-200">{company.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 overflow-y-auto h-screen relative z-10">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white capitalize">
                {activeTab.replace("-", " ")}
              </h1>
              <p className="hidden md:block text-slate-400 mt-1">Manage your career page content</p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3">
             <button
              onClick={() => navigate("/preview")}
              className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-full hover:bg-slate-800 hover:text-white transition-all"
            >
              <Eye size={18} />
              <span className="hidden md:inline">Preview</span>
            </button>
            <a
              href={`/${company.slug}/careers`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all"
            >
              <ExternalLink size={18} />
              <span className="hidden md:inline">View Live Page</span>
            </a>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {activeTab === "branding" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Branding company={company} setCompany={setCompany} />
            </div>
          )}

          {activeTab === "sections" && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <Sections sections={sections} setSections={setSections} branding={company.branding} />
             </div>
          )}

          {activeTab === "settings" && (
             <div className="bg-slate-900/50 backdrop-blur-md rounded-xl shadow-sm border border-slate-800 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white">Page Status</h3>
               <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                 <div>
                   <p className="font-medium text-slate-200 text-sm md:text-base">
                     {company.published ? "Your page is live" : "Your page is unpublished"}
                   </p>
                   <p className="text-xs md:text-sm text-slate-500 mt-1">
                     {company.published
                       ? "Visitors can access your career page."
                       : "Only you can see the preview."}
                   </p>
                 </div>
                 <div className="flex justify-center md:block">
                    <PublishToggle company={company} setCompany={setCompany} />
                 </div>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
