import { useState } from "react";
import api from "../../services/axios";
import { Palette, Image as ImageIcon, Save, Check, Type, Upload, Edit, X, Video, Plus, Loader2 } from "lucide-react";
import { patterns } from "./BannerPatterns";
import toast from "react-hot-toast";

const ColorInput = ({ label, value, onChange, placeholder, disabled }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className={`flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-2 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : 'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 hover:bg-slate-900'}`}>
      <div className="relative w-10 h-10 rounded-md overflow-hidden border border-slate-700 shadow-sm flex-shrink-0 ring-1 ring-white/10">
        <input
          type="color"
          value={value || placeholder}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        />
      </div>
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-200 uppercase font-mono disabled:cursor-not-allowed placeholder-slate-600"
      />
    </div>
  </div>
);

const defaultBranding = {
  primaryColor: "#000000",
  primaryBackground: "#ffffff",
  secondaryBackground: "#f3f4f6",
  primaryText: "#000000",
  secondaryText: "#4b5563",
  logoUrl: "",
  bannerUrl: "",
  selectedBannerPattern: "bg1",
  cultureVideoUrl: "",
  headline: ""
};

import { uploadImage } from "../../utils/uploadImage";

export default function Branding({ company, setCompany }) {
  const [form, setForm] = useState({ ...defaultBranding, ...company.branding });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);

  const handleEdit = () => {
    setOriginalForm({ ...form });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
    setOriginalForm(null);
    toast("Changes discarded", { icon: "↩️" });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/company/branding", form);
      setCompany(res.data);
      setSaved(true);
      toast.success("Branding saved successfully");
      setTimeout(() => {
        setSaved(false);
        setIsEditing(false);
        setOriginalForm(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save branding");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setUploading(true);
      const toastId = toast.loading("Uploading logo...");
      
      const url = await uploadImage(file);
      
      if (url) {
        setForm(prev => ({ ...prev, logoUrl: url }));
        toast.success("Logo uploaded successfully", { id: toastId });
      } else {
        toast.error("Failed to upload logo", { id: toastId });
      }
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setUploading(true);
      const toastId = toast.loading("Uploading banner...");
      
      const url = await uploadImage(file);
      
      if (url) {
        setForm(prev => ({ ...prev, bannerUrl: url }));
        toast.success("Banner uploaded successfully", { id: toastId });
      } else {
        toast.error("Failed to upload banner", { id: toastId });
      }
      setUploading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return {
          type: 'youtube',
          id: youtubeMatch[1],
          url: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      };
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return {
          type: 'vimeo',
          id: vimeoMatch[1],
          url: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      };
    }

    // Google Drive
    const driveRegex = /(?:drive\.google\.com\/)(?:file\/d\/|open\?id=)([^"&?\/\s]+)/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch) {
        return {
            type: 'google_drive',
            id: driveMatch[1],
            url: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
        };
    }

    // Direct MP4/WebM etc.
    return {
        type: 'direct',
        url: url
    };
  };

  return (
    <div className="space-y-6">
       {/* Main Container */}
      <div className="bg-slate-900/40 backdrop-blur-md rounded-xl shadow-sm border border-slate-800 p-4 md:p-6 relative overflow-hidden">
         {/* Subtle inner gradient for the card */}
         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
         
         <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                <Palette size={24} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">Visual Identity</h2>
                <p className="text-xs md:text-sm text-slate-400">Customize your career page colors and assets</p>
              </div>
            </div>
             
             {isEditing ? (
                <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                   <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all"
                   >
                      <X size={18} />
                      Cancel
                   </button>
                    <button
                      onClick={save}
                      disabled={saving || saved || uploading}
                      className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        saved 
                         ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                         : (saving || uploading)
                           ? "bg-slate-800 cursor-not-allowed text-slate-400" 
                           : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:transform active:scale-95"
                      }`}
                    >
                      {saved ? <Check size={18} /> : <Save size={18} />}
                      {saved ? "Saved Changes" : saving ? "Saving..." : uploading ? "Uploading..." : "Save"}
                    </button>
                </div>
            ) : (
                <button
                   onClick={handleEdit}
                   className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                >
                   <Edit size={18} />
                   Edit Branding
                </button>
            )}
         </div>

         <div className={`space-y-6 md:space-y-8 transition-opacity duration-300 ${!isEditing ? "opacity-80" : ""}`}>
             {/* Colors Section */}
             <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <h3 className="text-xs md:text-sm font-bold text-white mb-4 md:mb-5 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                 Color Palette
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 <ColorInput 
                   label="Brand Color" 
                   value={form.primaryColor} 
                   onChange={(val) => setForm({ ...form, primaryColor: val })} 
                   placeholder="#000000" 
                   disabled={!isEditing}
                 />
                 <ColorInput 
                   label="Primary Background" 
                   value={form.primaryBackground} 
                   onChange={(val) => setForm({ ...form, primaryBackground: val })} 
                   placeholder="#ffffff" 
                   disabled={!isEditing}
                 />
                 <ColorInput 
                   label="Secondary Background" 
                   value={form.secondaryBackground} 
                   onChange={(val) => setForm({ ...form, secondaryBackground: val })} 
                   placeholder="#f3f4f6" 
                   disabled={!isEditing}
                 />
                 <ColorInput 
                   label="Primary Text" 
                   value={form.primaryText} 
                   onChange={(val) => setForm({ ...form, primaryText: val })} 
                   placeholder="#000000" 
                   disabled={!isEditing}
                 />
                 <ColorInput 
                   label="Secondary Text" 
                   value={form.secondaryText} 
                   onChange={(val) => setForm({ ...form, secondaryText: val })} 
                   placeholder="#4b5563" 
                   disabled={!isEditing}
                 />
               </div>
             </section>

             <div className="border-t border-slate-800"></div>

             {/* Assets Section */}
             <section className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
               <h3 className="text-xs md:text-sm font-bold text-white mb-4 md:mb-5 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                 Brand Assets
               </h3>

               <div className="space-y-6 md:space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                   {/* Headline Input */}
                   <div className="space-y-3">
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                       Company Headline
                     </label>
                     <div className={`flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-2.5 md:p-3 transition-all ${isEditing ? 'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 hover:bg-slate-900' : 'opacity-70'}`}>
                       <Type size={18} className="text-slate-500" />
                       <input
                          type="text"
                          value={form.headline || ""}
                          onChange={(e) => setForm({ ...form, headline: e.target.value })}
                          placeholder="e.g. Building the future of tech"
                          disabled={!isEditing}
                          className="flex-1 bg-transparent border-none focus:ring-0 text-xs md:text-sm text-slate-200 disabled:cursor-not-allowed placeholder-slate-600"
                       />
                     </div>
                     <p className="text-xs text-slate-500">
                       A short tagline displayed below your company name.
                     </p>
                   </div>

                   {/* Logo Input */}
                   <div className="space-y-3">
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                       Company Logo
                     </label>
                     <div className="flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                            <label className={`flex items-center gap-2 px-3 py-2 md:px-4 bg-slate-950/50 border border-slate-800 rounded-lg shadow-sm transition-colors w-full md:w-auto ${isEditing && !uploading ? 'cursor-pointer hover:bg-slate-900' : 'cursor-not-allowed opacity-60'}`}>
                                {uploading ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Upload size={16} className="text-slate-400" />}
                                <span className="text-xs md:text-sm font-medium text-slate-300 truncate">{uploading ? "Uploading..." : "Upload Image"}</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={!isEditing || uploading}
                                />
                            </label>
                            <span className="hidden md:inline text-sm text-slate-600 font-medium">OR</span>
                            <div className={`md:flex-1 w-full min-w-0 flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-2 transition-all overflow-hidden ${isEditing ? 'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 hover:bg-slate-900' : 'opacity-70'}`}>
                                <ImageIcon size={18} className="text-slate-500" />
                                <input
                                    type="text"
                                    value={form.logoUrl || ""}
                                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                                    placeholder="Paste image URL..."
                                    disabled={!isEditing}
                                    className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm text-slate-200 disabled:cursor-not-allowed placeholder-slate-600"
                                />
                            </div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500">
                       Recommended: Transparent PNG, min height 40px. Max 5MB.
                     </p>
                   </div>
                 </div>

                 {form.logoUrl && (
                      <div className="bg-slate-950/30 rounded-lg p-3 md:p-4 border border-slate-800 flex flex-col items-center justify-center gap-2">
                         <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Logo Preview</span>
                         <div className="p-4 bg-white/5 rounded-lg shadow-sm border border-slate-700/50">
                           <img src={form.logoUrl} alt="Logo Preview" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                         </div>
                      </div>
                   )}

                 {/* Culture Videos Input */}
                 <div className="space-y-3 col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Company Culture Videos
                    </label>
                    
                    {/* List of Videos */}
                    <div className="space-y-3 mb-4">
                        {(form.companyVideos || []).map((video, index) => {
                            const embed = getEmbedUrl(video.url);
                            return (
                                <div key={index} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                            <input
                                                type="text"
                                                value={video.title || ""}
                                                onChange={(e) => {
                                                    const newVideos = [...(form.companyVideos || [])];
                                                    newVideos[index] = { ...video, title: e.target.value };
                                                    setForm({ ...form, companyVideos: newVideos });
                                                }}
                                                placeholder="Video Title (e.g. Office Tour)"
                                                disabled={!isEditing}
                                                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200 placeholder-slate-600"
                                            />
                                            <input
                                                type="text"
                                                value={video.url || ""}
                                                onChange={(e) => {
                                                    const newVideos = [...(form.companyVideos || [])];
                                                    newVideos[index] = { ...video, url: e.target.value };
                                                    setForm({ ...form, companyVideos: newVideos });
                                                }}
                                                placeholder="Video URL (YouTube, Vimeo, MP4)"
                                                disabled={!isEditing}
                                                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200 placeholder-slate-600"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input 
                                                    type="checkbox"
                                                    checked={video.showPreview ?? false} // Default to false if undefined
                                                    onChange={(e) => {
                                                        const newVideos = [...(form.companyVideos || [])];
                                                        newVideos[index] = { ...video, showPreview: e.target.checked };
                                                        setForm({ ...form, companyVideos: newVideos });
                                                    }}
                                                    disabled={!isEditing}
                                                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50 w-4 h-4"
                                                />
                                                <span className="text-xs text-slate-400 font-medium">Preview</span>
                                            </label>
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newVideos = (form.companyVideos || []).filter((_, i) => i !== index);
                                                        setForm({ ...form, companyVideos: newVideos });
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Remove Video"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Preview */}
                                    {(video.showPreview ?? false) && video.url && embed && (
                                        <div className="w-full bg-black rounded-lg overflow-hidden aspect-video relative">
                                            {embed.type === 'direct' ? (
                                                <video src={embed.url} controls className="w-full h-full object-cover" />
                                            ) : (
                                                <iframe 
                                                    src={embed.url} 
                                                    className="w-full h-full" 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                ></iframe>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Video Button */}
                    {isEditing && (
                        <button
                            onClick={() => {
                                const newVideos = [...(form.companyVideos || []), { url: "", title: "" }];
                                setForm({ ...form, companyVideos: newVideos });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add Video
                        </button>
                    )}

                    <p className="text-xs text-slate-500">
                      Add multiple videos to use in different sections. Supports YouTube, Vimeo, and direct MP4 links.
                    </p>
                 </div>

                 <div className="border-t border-slate-800"></div>

                 {/* Banner Input */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                       Banner Image
                     </label>
                     <div className="flex flex-col gap-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                            <label className={`flex items-center gap-2 px-3 py-2 md:px-4 bg-slate-950/50 border border-slate-800 rounded-lg shadow-sm transition-colors w-full md:w-auto ${isEditing && !uploading ? 'cursor-pointer hover:bg-slate-900' : 'cursor-not-allowed opacity-60'}`}>
                                {uploading ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Upload size={16} className="text-slate-400" />}
                                <span className="text-xs md:text-sm font-medium text-slate-300 truncate">{uploading ? "Uploading..." : "Upload Image"}</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleBannerUpload}
                                    disabled={!isEditing || uploading}
                                />
                            </label>
                            <span className="hidden md:inline text-sm text-slate-600 font-medium">OR</span>
                            <div className={`md:flex-1 w-full min-w-0 flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-lg p-2 transition-all overflow-hidden ${isEditing ? 'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 hover:bg-slate-900' : 'opacity-70'}`}>
                                <ImageIcon size={18} className="text-slate-500" />
                                <input
                                    type="text"
                                    value={form.bannerUrl || ""}
                                    onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                                    placeholder="Paste image URL..."
                                    disabled={!isEditing}
                                    className="w-full bg-transparent border-none focus:ring-0 text-xs md:text-sm text-slate-200 disabled:cursor-not-allowed placeholder-slate-600"
                                />
                            </div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500">
                       Recommended: 1200x400px JPG or PNG. Max 5MB.
                     </p>
                   </div>

                   {form.bannerUrl && (
                      <div className="bg-slate-950/30 rounded-lg p-4 border border-slate-800 flex flex-col items-center justify-center gap-2">
                         <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Preview</span>
                         <div className="w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative group">
                            <img src={form.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                            {isEditing && (
                              <button 
                                onClick={() => setForm({ ...form, bannerUrl: "" })}
                                className="absolute top-2 right-2 bg-slate-900/80 p-1.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500 shadow-sm transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                title="Remove Banner Image"
                              >
                                <X size={16} />
                              </button>
                            )}
                         </div>
                      </div>
                   )}

                   {!form.bannerUrl && (
                      <div className="col-span-1 md:col-span-2 mt-4 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Or Choose a Background Pattern
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {patterns.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => isEditing && setForm({ ...form, selectedBannerPattern: p.id })}
                              disabled={!isEditing}
                              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                                form.selectedBannerPattern === p.id
                                  ? "border-blue-500 ring-2 ring-blue-500/20 ring-offset-1 ring-offset-slate-900"
                                  : "border-slate-800"
                              } ${isEditing ? 'hover:border-slate-600 cursor-pointer' : 'cursor-default opacity-80'}`}
                            >
                              <div className="w-full h-full">
                                <p.Component
                                  primaryColor={form.primaryColor || "#0e2a47"}
                                  secondaryColor={form.secondaryBackground || "#ffffff"}
                                />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                 {form.selectedBannerPattern === p.id && (
                                   <div className="bg-blue-500 text-white p-1 rounded-full shadow-sm">
                                     <Check size={14} />
                                   </div>
                                 )}
                              </div>
                              <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white/80 drop-shadow-md">
                                {p.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                   )}
                 </div>
               </div>
             </section>
          </div>
       </div>
       {isEditing && (
         <div className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900/95 backdrop-blur border-t border-slate-800 p-3 flex items-center justify-between z-50">
           <button
             onClick={handleCancel}
             disabled={saving}
             className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 bg-slate-900 hover:bg-slate-800"
           >
             Cancel
           </button>
           <button
             onClick={save}
             disabled={saving || saved}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${saved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-white bg-blue-600"}`}
           >
             {saved ? <Check size={18} /> : <Save size={18} />}
             {saved ? "Saved" : saving ? "Saving..." : "Save"}
           </button>
         </div>
       )}
    </div>
  );
}
