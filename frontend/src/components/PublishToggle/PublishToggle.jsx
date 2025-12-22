import { useState } from "react";
import api from "../../services/axios";
import { Globe, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PublishToggle({ company, setCompany }) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await api.put("/api/company/publish", {
        published: !company.published
      });
      setCompany(res.data.company);
      toast.success(company.published ? "Site unpublished" : "Site published successfully");
    } catch (err) {
        console.error("Failed to toggle publish state", err);
        toast.error("Failed to update publish state");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
        company.published 
          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 shadow-red-900/10" 
          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20 hover:shadow-emerald-900/30 active:transform active:scale-95"
      } ${loading ? "opacity-70 cursor-wait" : ""}`}
      onClick={toggle}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : company.published ? (
        <Lock size={18} />
      ) : (
        <Globe size={18} />
      )}
      <span>
        {loading 
          ? (company.published ? "Unpublishing..." : "Publishing...") 
          : (company.published ? "Unpublish Page" : "Publish Page")
        }
      </span>
    </button>
  );
}
