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
  const [activeTab, setActiveTab] = useState("branding");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          ? "bg-blue-50 text-blue-600 shadow-sm font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 md:w-64 bg-white border-r border-gray-200 flex flex-col h-full z-40 transform transition-transform duration-300 md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <LayoutDashboard />
            <span>CareerBuilder</span>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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

        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-medium truncate">{company.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <p className="hidden md:block text-gray-500">Manage your career page content</p>
          </div>

          <div className="flex gap-2 md:gap-3">
             <button
              onClick={() => navigate("/preview")}
              className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all"
            >
              <Eye size={18} />
              <span className="hidden md:inline">Preview</span>
            </button>
            <a
              href={`/${company.slug}/careers`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-md transition-all"
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
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Page Status</h3>
               <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 p-4 bg-gray-50 rounded-lg border border-gray-100">
                 <div>
                   <p className="font-medium text-gray-900 text-sm md:text-base">
                     {company.published ? "Your page is live" : "Your page is unpublished"}
                   </p>
                   <p className="text-xs md:text-sm text-gray-500 mt-1">
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
