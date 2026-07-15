import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../Components/MovieCard"; 

const ViewAll = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🚨 FIX 1: Added "oscars" to the category configuration!
  const categoryConfig = {
    trending: { endpoint: "/trending/movie/day", title: "Trending Now" },
    popular: { endpoint: "/movie/popular", title: "Popular Movies" },
    upcoming: { endpoint: "/movie/upcoming", title: "Upcoming Movies" },
    top_rated: { endpoint: "/movie/top_rated", title: "Top Rated Movies" },
    oscars: { endpoint: "/list/28", title: "🏆 Oscar Winners" }, 
  };

  // If the category is not found, it defaults to popular.
  const currentCategory = categoryConfig[category] || categoryConfig.popular;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const BASE_URL = "/api/tmdb"; 
        
        // Clean target URL creation
        const targetUrl = `${BASE_URL}${currentCategory.endpoint}?api_key=${apiKey}&page=${page}`;
        const response = await fetch(targetUrl);
        const data = await response.json();
        
        setMovies(data.results || data.items || []);
        setTotalPages(data.total_pages > 500 ? 500 : (data.total_pages || 1)); 
      } catch (error) {
        console.error("Error fetching paginated data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, page, currentCategory.endpoint]);

  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () => setPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans pb-16">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b border-slate-800/60 flex items-center justify-between sticky top-0 bg-[#0b0b13]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            ←
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            {currentCategory.title}
          </h1>
        </div>
        
        <div className="text-sm font-semibold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          Page <span className="text-purple-400">{page}</span> of {totalPages}
        </div>
      </div>

      {/* --- MOVIE GRID (USING SHARED MOVIECARD) --- */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-purple-500 font-bold text-xl animate-pulse">Loading Movies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

          </div>
        )}
      </div>

      {/* --- PAGINATION --- */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 mt-16 px-6">
        <button 
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center font-bold transition-all shadow-lg ${
            page === 1 
              ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800" 
              : "bg-slate-800 text-white hover:bg-purple-600 border border-slate-700 hover:border-purple-500"
          }`}
        >
          −
        </button>
        
        <span className="text-lg font-bold text-slate-300">
          Page <span className="text-white">{page}</span> of {totalPages}
        </span>

        <button 
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`w-14 h-14 rounded-full text-2xl flex items-center justify-center font-bold transition-all shadow-lg ${
            page === totalPages 
              ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800" 
              : "bg-slate-800 text-white hover:bg-purple-600 border border-slate-700 hover:border-purple-500"
          }`}
        >
          +
        </button>
      </div>

    </div>
  );
};

export default ViewAll;