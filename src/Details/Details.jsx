import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext"; // ⚠️ IMPORTANT: Check this path!

const Details = () => {
  const { mediaType = "movie", id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isAdded } = useWatchlist();

  // 🚨 NEW: Reference for the cast scrollable container
  const castContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    const fetchDetails = async () => {
      setLoading(true);
      setHasError(false);
      
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        // SMART URL: Localhost pe direct TMDB, Vercel pe Proxy rewrite
        const BASE_URL = import.meta.env.DEV 
          ? "https://api.themoviedb.org/3" 
          : "/api/tmdb";
        
        const targetUrl = `${BASE_URL}/${mediaType}/${id}?api_key=${apiKey}&append_to_response=videos,credits,watch/providers`;
        const response = await fetch(targetUrl);
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const result = await response.json();
        
        if (result.success === false) throw new Error("Movie not found");
        
        result.media_type = mediaType;
        setData(result);
      } catch (error) {
        console.error("Error fetching details:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [mediaType, id]);

  // 🚨 NEW: Scroll handlers for Cast Section Buttons
  const scrollCast = (direction) => {
    if (castContainerRef.current) {
      const scrollAmount = 300; // Ek baar mein kitna scroll hona chahiye
      castContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#0b0b13] text-purple-500 font-bold text-2xl animate-pulse">Loading Details...</div>;
  if (hasError || !data) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0b0b13] text-white gap-4">
      <p className="text-xl font-bold">Something went wrong or the movie wasn't found.</p>
      <button onClick={() => navigate(-1)} className="bg-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-500 transition-colors">Go Back</button>
    </div>
  );

  const trailer = data.videos?.results?.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
  const releaseYear = data.release_date?.slice(0, 4) || data.first_air_date?.slice(0, 4) || "N/A";
  const isMovieAdded = isAdded(data.id);

  const watchData = data["watch/providers"]?.results;
  const regionData = watchData?.IN || watchData?.US; 

  const allPlatforms = [
    ...(regionData?.flatrate || []),
    ...(regionData?.free || []),
    ...(regionData?.ads || []),
    ...(regionData?.rent || []),
    ...(regionData?.buy || [])
  ];

  const streamingPlatforms = Array.from(new Map(allPlatforms.map(p => [p.provider_id, p])).values());

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans pb-16">
      
      {/* --- TOP BACKDROP FADE --- */}
      <div className="relative w-full h-[40vh] md:h-[55vh] hidden md:block">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-8 z-20 w-12 h-12 bg-black/50 hover:bg-purple-600 text-white rounded-full flex items-center justify-center font-bold border border-slate-600 backdrop-blur-md transition-colors"
        >
          ←
        </button>
        <img 
          src={data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : "https://via.placeholder.com/1920x1080?text=No+Backdrop"} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b13] via-[#0b0b13]/60 to-transparent"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 md:-mt-48 pt-8 md:pt-0">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14">
          
          {/* Left: Poster & OTT Platforms */}
          <div className="w-56 sm:w-64 md:w-80 shrink-0 mx-auto md:mx-0 flex flex-col gap-6">
            <img 
              src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
              alt={data.title || data.name} 
              className="w-full rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-slate-700"
            />
            
            {/* OTT PLATFORM SECTION */}
            {streamingPlatforms.length > 0 && (
              <div className="bg-[#12121a] border border-slate-800 rounded-2xl p-4 shadow-lg">
                <p className="text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider">Available to Watch</p>
                <div className="flex flex-wrap gap-3">
                  {streamingPlatforms.map(platform => {
                    const smartSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`Watch ${data.title || data.name} on ${platform.provider_name}`)}`;

                    return (
                      <a 
                        key={platform.provider_id} 
                        href={smartSearchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl overflow-hidden shadow-md hover:scale-110 hover:shadow-purple-500/50 transition-all border border-slate-700 bg-white"
                        title={`Find ${data.title || data.name} on ${platform.provider_name}`}
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/original${platform.logo_path}`} 
                          alt={platform.provider_name} 
                          className="w-full h-full object-cover"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info & Buttons */}
          <div className="flex flex-col justify-end pt-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
              {data.title || data.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-semibold text-slate-300 mb-6">
              <span className="text-purple-400 font-bold bg-slate-900 px-3 py-1 rounded-md border border-slate-700">⭐ {data.vote_average?.toFixed(1)} Rating</span>
              <span>{releaseYear}</span>
              <span className="uppercase border border-slate-600 px-2 py-0.5 rounded-sm">{data.original_language}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {data.genres?.map(genre => (
                <span key={genre.id} className="bg-slate-800 text-slate-200 px-4 py-1.5 rounded-full text-sm font-semibold border border-slate-700">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-8">
              {data.overview || "No description available."}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4">
              {trailer && (
                <a 
                  href="#trailer-section"
                  className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg"
                >
                  ▶ Watch Trailer
                </a>
              )}
              
              <button 
                onClick={() => isMovieAdded ? removeFromWatchlist(data.id) : addToWatchlist(data)}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all border shadow-lg ${
                  isMovieAdded
                    ? "bg-green-600 text-white border-green-500 hover:bg-green-700 shadow-green-900/30"
                    : "bg-slate-800 text-white border-slate-600 hover:bg-purple-600 hover:border-purple-500 shadow-purple-900/20"
                }`}
              >
                {isMovieAdded ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-800/60 my-16 max-w-7xl mx-auto" />

      {/* --- 🚨 UPGRADED CAST SECTION WITH SCROLL BUTTONS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white border-l-4 border-purple-500 pl-3">Top Cast</h2>
          
          {/* Action Buttons for Left/Right Scroll */}
          {data.credits?.cast?.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCast("left")} 
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all shadow-md active:scale-95"
              >
                ‹
              </button>
              <button 
                onClick={() => scrollCast("right")} 
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all shadow-md active:scale-95"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Cast list with forwardRef */}
        <div 
          ref={castContainerRef}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
        >
          {data.credits?.cast?.slice(0, 15).map(actor => (
            <div key={actor.id} className="w-28 md:w-32 shrink-0">
              <img 
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/200?text=No+Image"}
                alt={actor.name}
                className="w-full h-36 md:h-40 object-cover rounded-xl shadow-md bg-slate-800 border border-slate-700"
              />
              <p className="text-sm font-bold text-white mt-3 truncate">{actor.name}</p>
              <p className="text-xs text-slate-400 truncate">{actor.character}</p>
            </div>
          ))}
          {(!data.credits?.cast || data.credits.cast.length === 0) && (
            <p className="text-slate-500">No cast info available.</p>
          )}
        </div>
      </div>

      <hr className="border-slate-800/60 my-16 max-w-7xl mx-auto" />

      {/* --- TRAILER SECTION --- */}
      <div id="trailer-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-3">Official Trailer</h2>
        {trailer ? (
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-black">
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?controls=1`} 
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="w-full max-w-4xl aspect-video bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700 border-dashed">
            <p className="text-slate-400 text-lg font-semibold">No YouTube Trailer Available</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Details;