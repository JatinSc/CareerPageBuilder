import api from "../../api/axios";
import { Globe, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function PublishToggle({ company, setCompany }) {
  const toggle = async () => {
    try {
      const res = await api.put("/api/company/publish", {
        published: !company.published
      });
      setCompany(res.data.company);
      toast.success(company.published ? "Site unpublished" : "Site published successfully");
    } catch (err) {
        console.error("Failed to toggle publish state", err);
        toast.error("Failed to update publish state");
    }
  };

  return (
    <button
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 shadow-sm ${
        company.published 
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
      }`}
      onClick={toggle}
    >
      {company.published ? (
        <>
          <Lock size={18} />
          <span>Unpublish Page</span>
        </>
      ) : (
        <>
          <Globe size={18} />
          <span>Publish Page</span>
        </>
      )}
    </button>
  );
}
