import api from "../../api/axios";
import { useState } from "react";
import { Plus, Trash2, AlignLeft, Edit2, X, Save, Image as ImageIcon, Upload, ArrowUp, ArrowDown, Eye, EyeOff, LayoutTemplate, Video, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImage } from "../../utils/uploadImage";

export default function Sections({ sections, setSections, branding = {} }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("About");
  const [image, setImage] = useState("");
  const [layout, setLayout] = useState("image_left");
  const [videoUrl, setVideoUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: "", content: "", image: "", layout: "", videoUrl: "" });
  const [expanded, setExpanded] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageChange = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setUploading(true);
      const toastId = toast.loading("Uploading image...");

      const url = await uploadImage(file);

      if (url) {
        if (isEdit) {
          setEditForm(prev => ({ ...prev, image: url }));
        } else {
          setImage(url);
        }
        toast.success("Image uploaded successfully", { id: toastId });
      } else {
        toast.error("Failed to upload image", { id: toastId });
      }
      setUploading(false);
    }
  };

  const addSection = async () => {
    if (!content.trim() || !type.trim()) return;

    setSaving(true);
    try {
      const res = await api.post("/api/sections", {
        type,
        content,
        image,
        layout,
        videoUrl
      });
      setSections([...sections, res.data]);
      setContent("");
      setType("About");
      setImage("");
      setLayout("image_left");
      setVideoUrl("");
      setIsAdding(false);
      toast.success("Section added successfully");
    } catch (err) {
      console.error("Failed to add section", err);
      toast.error("Failed to add section");
    } finally {
      setSaving(false);
    }
  };

  const [showPreview, setShowPreview] = useState(true);

  // Helper for video embed
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

  const startEditing = (section) => {
    setEditingId(section._id);
    setEditForm({
      type: section.type,
      content: section.content,
      image: section.image || "",
      layout: section.layout || "image_left",
      videoUrl: section.videoUrl || ""
    });
    setShowPreview(true);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ type: "", content: "", image: "", layout: "", videoUrl: "" });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/api/sections/${editingId}`, editForm);
      setSections(sections.map(s => s._id === editingId ? res.data : s));
      setEditingId(null);
      toast.success("Section updated successfully");
    } catch (err) {
      console.error("Failed to update section", err);
      toast.error("Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/api/sections/${id}`);
      setSections(sections.filter(s => s._id !== id));
      toast.success("Section deleted successfully");
    } catch (err) {
      console.error("Failed to delete section", err);
      toast.error("Failed to delete section");
    }
  };

  const moveSection = async (index, direction) => {
    const newSections = [...sections];
    if (index + direction < 0 || index + direction >= newSections.length) return;

    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;

    setSections(newSections);

    try {
      const orderedIds = newSections.map(s => s._id);
      await api.put("/api/sections/reorder", { orderedIds });
      toast.success("Sections reordered");
    } catch (err) {
      console.error("Failed to reorder sections", err);
      // Revert on failure
      setSections(sections);
      toast.error("Failed to reorder sections");
    }
  };

  const toggleVisibility = async (section) => {
    try {
      const newVisible = !section.visible;
      const res = await api.put(`/api/sections/${section._id}`, { visible: newVisible });
      setSections(sections.map(s => s._id === section._id ? { ...s, visible: newVisible } : s));
      toast.success(`Section ${newVisible ? 'visible' : 'hidden'}`);
    } catch (err) {
      console.error("Failed to toggle visibility", err);
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-md rounded-xl shadow-sm border border-slate-800 p-4 md:p-6 relative overflow-hidden">
        {/* Subtle inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <LayoutTemplate size={24} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Content Sections</h2>
              <p className="text-xs md:text-sm text-slate-400">Manage your page content and layout</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 ${isAdding ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? "Cancel Adding" : "Add New Section"}
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {sections.length === 0 && !isAdding && (
            <div className="text-center py-16 bg-slate-950/30 rounded-xl border-2 border-dashed border-slate-800/50 hover:border-slate-700 transition-colors">
              <div className="mx-auto w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-slate-800 shadow-inner">
                <LayoutTemplate className="text-slate-600" size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Start Building Your Page</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Add sections to showcase your company culture, values, and open positions.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20"
              >
                <Plus size={18} />
                Add First Section
              </button>
            </div>
          )}

          {isAdding && (
            <div className="bg-slate-950/50 border border-blue-500/20 rounded-lg p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Layout Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "image_left", label: "Image Left" },
                    { id: "image_right", label: "Image Right" },
                    { id: "full_width", label: "Full Width" },
                    { id: "text_only", label: "Text Only" },
                    { id: "cards", label: "Cards Grid" },
                    { id: "video_bg", label: "Video BG", isVideo: true },
                    { id: "video_split_left", label: "Video Left", isVideo: true },
                    { id: "video_split_right", label: "Video Right", isVideo: true }
                  ].map(opt => {
                    const isDisabled = opt.isVideo && (!branding.companyVideos || branding.companyVideos.length === 0);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => !isDisabled && setLayout(opt.id)}
                        disabled={isDisabled}
                        className={`text-xs p-2 rounded border transition-all ${
                          layout === opt.id 
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-medium' 
                            : isDisabled
                              ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                        title={isDisabled ? "Add videos in Branding tab to enable" : ""}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {(!branding.companyVideos || branding.companyVideos.length === 0) && (
                  <p className="text-xs text-amber-500/80 mt-2 flex items-center gap-1.5">
                    <Video size={12} />
                    Add videos in the Branding tab to use video layouts.
                  </p>
                )}
              </div>

              {/* Video Selection for Video Layouts - Add Section */}
              {['video_bg', 'video_split_left', 'video_split_right'].includes(layout) && (
                <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20 mb-3">
                  <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Select Video</label>
                  <div className="flex flex-col gap-2">
                    {(branding.companyVideos || []).length > 0 ? (
                      <select
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full border border-purple-500/30 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-900 text-slate-200"
                      >
                        <option value="">-- Select a Video --</option>
                        {(branding.companyVideos || []).map((v, i) => (
                          <option key={i} value={v.url}>
                            {v.title || `Video ${i + 1}`} ({v.url.slice(0, 30)}...)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-purple-400/80 italic">
                        No videos found in Branding. Please add videos in the Branding tab first.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Section Type
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm text-slate-200 placeholder-slate-600"
                  placeholder="e.g. About, Culture, Values, Testimonials"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Content
                </label>
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none h-48 resize-none text-slate-200 placeholder-slate-600"
                  placeholder="Write something about your company, culture, or values..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Image (Optional)
                </label>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <div className="relative w-full md:flex-1">
                    <input
                      type="text"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 pl-9 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm text-slate-200 placeholder-slate-600"
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  </div>
                  <span className="text-slate-500 text-sm hidden md:block">OR</span>
                  <label className={`cursor-pointer bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg px-3 py-2 flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploading ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Upload size={16} className="text-slate-400" />}
                    <span className="text-sm text-slate-300">{uploading ? "Uploading..." : "Upload"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e)} disabled={uploading} />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setImage("")} className="absolute top-1 right-1 bg-slate-950/80 p-1 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 ${
                    saving || !content.trim() || !type.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-blue-600 text-white hover:bg-blue-500 active:transform active:scale-95'
                  }`}
                  onClick={addSection}
                  disabled={saving || !content.trim() || !type.trim()}
                >
                  {saving ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Section"}
                </button>
              </div>
            </div>
          )}

          {sections.map((s, index) => (
            <div key={s._id} className="group relative z-10 bg-slate-900/40 border border-slate-800 rounded-lg p-5 hover:border-blue-500/30 hover:shadow-md transition-all">
              {editingId === s._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Layout Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "image_left", label: "Image Left" },
                        { id: "image_right", label: "Image Right" },
                        { id: "full_width", label: "Full Width" },
                        { id: "text_only", label: "Text Only" },
                        { id: "cards", label: "Cards Grid" },
                        { id: "video_bg", label: "Video BG", isVideo: true },
                        { id: "video_split_left", label: "Video Left", isVideo: true },
                        { id: "video_split_right", label: "Video Right", isVideo: true }
                      ].map(opt => {
                        const isDisabled = opt.isVideo && (!branding.companyVideos || branding.companyVideos.length === 0);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => !isDisabled && setEditForm({ ...editForm, layout: opt.id })}
                            disabled={isDisabled}
                            className={`text-xs p-2 rounded border transition-all ${
                              editForm.layout === opt.id 
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-medium' 
                                : isDisabled
                                  ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                            }`}
                            title={isDisabled ? "Add videos in Branding tab to enable" : ""}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    {(!branding.companyVideos || branding.companyVideos.length === 0) && (
                      <p className="text-xs text-amber-500/80 mt-2 flex items-center gap-1.5">
                        <Video size={12} />
                        Add videos in the Branding tab to use video layouts.
                      </p>
                    )}
                  </div>

                  {/* Video Selection for Video Layouts */}
                  {['video_bg', 'video_split_left', 'video_split_right'].includes(editForm.layout) && (
                    <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
                      <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Select Video</label>
                      <div className="flex flex-col gap-2">
                        {(branding.companyVideos || []).length > 0 ? (
                          <select
                            value={editForm.videoUrl || ""}
                            onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                            className="w-full border border-purple-500/30 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-900 text-slate-200"
                          >
                            <option value="">-- Select a Video --</option>
                            {(branding.companyVideos || []).map((v, i) => (
                              <option key={i} value={v.url}>
                                {v.title || `Video ${i + 1}`} ({v.url.slice(0, 30)}...)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-purple-400/80 italic">
                            No videos found in Branding. Please add videos in the Branding tab first.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                    <input
                      type="text"
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Content</label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none min-h-[100px] text-sm text-slate-200"
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Media Preview
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showPreview}
                        onChange={(e) => setShowPreview(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs text-slate-400 font-medium">Show Preview</span>
                    </label>
                  </div>

                  {showPreview && (
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 mb-4">
                      {['video_bg', 'video_split_left', 'video_split_right'].includes(editForm.layout) ? (
                        // Video Preview
                        editForm.videoUrl ? (
                          (() => {
                            const embed = getEmbedUrl(editForm.videoUrl);
                            return embed ? (
                              <div className="w-full bg-black rounded-lg overflow-hidden aspect-video relative mx-auto">
                                {embed.type === 'direct' ? (
                                  <video 
                                    src={embed.url} 
                                    className="w-full h-full object-cover pointer-events-none"
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                  />
                                ) : (
                                  <iframe
                                    src={(() => {
                                      if (embed.type === 'youtube') return `${embed.url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.id}`;
                                      if (embed.type === 'vimeo') return `${embed.url}?background=1&autoplay=1&muted=1&loop=1`;
                                      return embed.url;
                                    })()}
                                    className="w-full h-full pointer-events-none"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    tabIndex="-1"
                                  ></iframe>
                                )}
                              </div>
                            ) : <div className="text-sm text-red-500 text-center py-8">Invalid Video URL</div>;
                          })()
                        ) : (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                              <Video size={20} />
                            </div>
                            No video selected
                          </div>
                        )
                      ) : (
                        // Image Preview
                        editForm.image ? (
                          <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                            <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setEditForm({ ...editForm, image: "" })}
                              className="absolute top-2 right-2 bg-slate-950/80 p-1.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors shadow-sm"
                              title="Remove Image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500 text-sm">
                            <div className="mx-auto w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center mb-2 border border-slate-800">
                              <ImageIcon size={20} />
                            </div>
                            No image selected
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Image (Optional)</label>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                      <div className="relative w-full md:flex-1">
                        <input
                          type="text"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 pl-9 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-sm text-slate-200 placeholder-slate-600"
                          placeholder="Image URL"
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        />
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      </div>
                      <span className="text-slate-500 text-sm hidden md:block">OR</span>
                      <label className={`cursor-pointer bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg px-3 py-2 flex items-center justify-center gap-2 transition-colors w-full md:w-auto ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {uploading ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Upload size={16} className="text-slate-400" />}
                        <span className="text-sm text-slate-300">{uploading ? "Uploading..." : "Upload"}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, true)} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
                    <button 
                      onClick={cancelEditing} 
                      className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveEdit} 
                      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 ${
                        saving || uploading || !editForm.content.trim() || !editForm.type.trim()
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-blue-600 text-white hover:bg-blue-500 active:transform active:scale-95'
                      }`} 
                      disabled={saving || uploading || !editForm.content.trim() || !editForm.type.trim()}
                    >
                      {saving ? <Loader2 size={16} className="text-slate-400 animate-spin" /> : <Save size={16} />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="w-full">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-800 rounded mb-2 uppercase tracking-wide">
                      {s.type}
                    </span>
                    {['video_bg', 'video_split_left', 'video_split_right'].includes(s.layout) && s.videoUrl ? (
                      (() => {
                        const embed = getEmbedUrl(s.videoUrl);
                        return embed ? (
                          <div className="mb-4 w-full md:max-w-[240px] h-48 md:h-32 bg-black rounded-lg overflow-hidden relative">
                            {embed.type === 'direct' ? (
                              <video
                                src={embed.url}
                                className="w-full h-full object-cover pointer-events-none"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <iframe
                                src={(() => {
                                  if (embed.type === 'youtube') return `${embed.url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.id}`;
                                  if (embed.type === 'vimeo') return `${embed.url}?background=1&autoplay=1&muted=1&loop=1`;
                                  return embed.url;
                                })()}
                                className="w-full h-full pointer-events-none"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                tabIndex="-1"
                              ></iframe>
                            )}
                          </div>
                        ) : null;
                      })()
                    ) : (
                      s.image && (
                        <div className="mb-4 h-48 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                          <img src={s.image} alt={s.type} className="w-full h-full object-cover" />
                        </div>
                      )
                    )}
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {expanded[s._id] || s.content.length <= 300 && !s.content.includes('\n')
                        ? s.content
                        : (s.content.split('\n')[0].length > 300
                          ? s.content.slice(0, 300) + "..."
                          : s.content.split('\n')[0] + "...")
                      }
                    </div>
                    {(s.content.length > 300 || s.content.includes('\n')) && (
                      <button
                        onClick={() => toggleExpand(s._id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2 inline-flex items-center gap-1"
                      >
                        {expanded[s._id] ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="flex flex-row md:flex-col gap-2 md:gap-1 md:mr-2 border-r md:border-r-0 md:border-none pr-3 md:pr-0 border-slate-700">
                      <button
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        className={`p-1 rounded-md transition-colors ${index === 0
                            ? 'text-slate-700 cursor-not-allowed'
                            : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'
                          }`}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSection(index, 1)}
                        disabled={index === sections.length - 1}
                        className={`p-1 rounded-md transition-colors ${index === sections.length - 1
                            ? 'text-slate-700 cursor-not-allowed'
                            : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'
                          }`}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVisibility(s)}
                        className={`p-1.5 rounded-lg transition-colors self-start ${s.visible ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'}`}
                        title={s.visible ? "Hide Section" : "Show Section"}
                      >
                        {s.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => startEditing(s)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors self-start"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteSection(s._id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}


        </div>
      </div>
    </div>
  );
}
