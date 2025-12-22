import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";
import { patterns } from "../components/branding/BannerPatterns";
import JobBoard from "../components/jobs/JobBoard";
import toast from "react-hot-toast";

export default function Careers() {
  const { companySlug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/${companySlug}/careers`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load career page");
      }
    };
    fetchData();
  }, [companySlug]);

  useEffect(() => {
    if (data?.company?.name) {
      document.title = `${data.company.name} Careers`;
    }
  }, [data]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const { company, sections, jobs } = data;

  const visibleSections = sections.filter(s => s.visible !== false);
  const branding = company.branding || {};

  // Theme Colors
  const primaryColor = branding.primaryColor || "#004d40"; // Dark Green default
  const bannerUrl = branding.bannerUrl || "";
  const logoUrl = branding.logoUrl || "";
  const headline = branding.headline || "";
  const selectedPatternId = branding.selectedBannerPattern;
  const SelectedPattern = patterns.find(p => p.id === selectedPatternId)?.Component;

  const scrollToJobs = () => {
    const element = document.getElementById('job-board');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


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

    // Direct MP4/WebM etc.
    return {
      type: 'direct',
      url: url
    };
  };

  const secondaryBackground = branding.secondaryColor || "#ffffff";

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: secondaryBackground }}>
      {/* Header Section */}
      <div
        className="w-full h-[320px] flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        {bannerUrl ? (
          <div className="absolute inset-0">
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ) : SelectedPattern ? (
          <div className="absolute inset-0 opacity-80">
            <SelectedPattern
              primaryColor={primaryColor}
              secondaryColor="#ffffff"
            />
          </div>
        ) : (
          /* Fallback SVG Pattern */
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center px-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={company.name}
              className="h-24 mb-6 object-contain p-4 rounded-xl "
            />
          )}
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4 drop-shadow-md">{company.name}</h1>
          {headline && (
            <p className="text-lg lg:text-xl text-white font-medium drop-shadow-md max-w-2xl text-center">
              {headline}
            </p>
          )}

          <button
            onClick={scrollToJobs}
            className="mt-8 px-8 py-3 bg-white rounded-full font-bold shadow-lg hover:bg-gray-50 transition-all lg:text-[15px] text-[10px] transform hover:-translate-y-1 hover:shadow-xl"
            style={{ color: primaryColor }}
          >
            View Open Positions
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 pb-24">
        {visibleSections.length > 0 && (
          <div className="mt-20 mb-20">
            <div className="space-y-24">
              {visibleSections.map((s, index) => {
                // Determine layout: use specific layout if set, otherwise fallback to alternating default
                let layout = s.layout;
                if (!layout || layout === 'default') {
                  layout = index % 2 === 0 ? 'image_left' : 'image_right';
                }

                const imageUrl = s.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";

                // Use section-specific video if available, otherwise fallback to branding culture video
                const videoUrl = s.videoUrl || branding.cultureVideoUrl;
                const embed = getEmbedUrl(videoUrl);

                if (layout === 'video_bg') {
                  if (!embed) return null; // Fallback or hide if no video

                  return (
                    <div key={s._id} className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center text-center text-white shadow-2xl">
                      {embed.type === 'direct' ? (
                        <video
                          src={embed.url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <iframe
                          src={`${embed.url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.id}&background=1`}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-150"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
                      <div className="relative z-10 max-w-4xl px-6 py-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">{s.type}</h2>
                        <div className="text-xs lg:text-[1rem] prose prose-lg prose-invert mx-auto whitespace-pre-wrap leading-relaxed">
                          {s.content}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (layout === 'video_split_left' || layout === 'video_split_right' || layout === 'video_split') {
                  if (!embed) return null;
                  const isVideoRight = layout === 'video_split_right';

                  return (
                    <div key={s._id} className={`flex flex-col md:flex-row items-center gap-12 ${isVideoRight ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-300 aspect-video bg-black">
                          {embed.type === 'direct' ? (
                            <video
                              src={embed.url}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={(() => {
                                if (embed.type === 'youtube') return `${embed.url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embed.id}&background=1`;
                                if (embed.type === 'vimeo') return `${embed.url}?background=1&autoplay=1&muted=1&loop=1`;
                                return embed.url;
                              })()}
                              className="w-full h-full pointer-events-none scale-150"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              tabIndex="-1"
                            ></iframe>
                          )}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: primaryColor }}>{s.type}</h2>
                        <div className="text-xs lg:text-[1rem] prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {s.content}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (layout === 'full_width') {
                  return (
                    <div key={s._id} className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center text-center text-white shadow-2xl">
                      <img src={imageUrl} alt={s.type} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60"></div>
                      <div className="relative z-10 max-w-4xl px-6 py-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">{s.type}</h2>
                        <div className="text-xs lg:text-[1rem] prose prose-lg prose-invert mx-auto whitespace-pre-wrap leading-relaxed">
                          {s.content}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (layout === 'text_only') {
                  return (
                    <div key={s._id} className="max-w-4xl mx-auto text-center py-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: primaryColor }}>{s.type}</h2>
                      <div className="text-xs lg:text-[1rem] prose prose-lg text-gray-600 mx-auto whitespace-pre-wrap leading-relaxed">
                        {s.content}
                      </div>
                    </div>
                  );
                }

                if (layout === 'cards') {
                  const cards = s.content.split('\n').filter(c => c.trim());
                  return (
                    <div key={s._id} className="py-4">
                      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: primaryColor }}>{s.type}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cards.map((card, i) => (
                          <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300">
                            <div className="text-lg text-gray-700 leading-relaxed font-medium">
                              {card}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }

                const isImageLeft = layout === 'image_left';

                return (
                  <div key={s._id} className={`flex flex-col md:flex-row items-center gap-12 ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Side */}
                    <div className="w-full md:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-300">
                        <img
                          src={imageUrl}
                          alt={s.type}
                          className="w-full h-full object-cover aspect-[4/3]"
                        />
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: primaryColor }}>{s.type}</h2>
                      <div className="text-xs lg:text-[1rem] prose prose-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {s.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <JobBoard jobs={jobs} branding={branding} />

      </div>
    </div>
  );
}
