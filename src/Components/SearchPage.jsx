import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../Components/MovieCard"; // Path ensure kar lena bhai

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🚨 TRACK PREVIOUS QUERY: Yeh track karega ki query change hui hai ya nahi
  const prevQueryRef = useRef(query);

  useEffect(() => {
    if (!query) return;

    // 🚨 SMART CHECK: Agar user ne nayi cheez search ki hai, toh page wapas 1 kar do bina synchronous crash ke
    let activePage = page;
    if (prevQueryRef.current !== query) {
      prevQueryRef.current = query;
      setPage(1);
      activePage = 1; // local variable ko turant 1 set kiya taaki naya fetch sahi page se ho
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        
        const BASE_URL = import.meta.env.DEV 
          ? "https://api.themoviedb.org/3" 
          : "/api/tmdb";
        
        // activePage variable ka use kiya bina react ko stack update loop mein fasaaye
        const targetUrl = `${BASE_URL}/search/multi?api_key=${apiKey}&query=${query}&page=${activePage}`;

        const response = await fetch(targetUrl);
        const data = await response.json();

        const filteredResults = data.results?.filter((item) => item.media_type !== "person") || [];
        
        setMovies(filteredResults);
        setTotalPages(data.total_pages > 500 ? 500 : (data.total_pages || 1));
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]); // Only trigger when query or page state changes safely

  // Pagination Handlers
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () => setPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans p-6 md:p-12 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-slate-800/60 pb-4 gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Search Results for <span className="text-purple-500">"{query}"</span>
          </h1>
          
          {movies.length > 0 && (
            <div className="text-sm font-semibold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 w-fit">
              Page <span className="text-purple-400">{page}</span> of {totalPages}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-purple-500 font-bold text-xl animate-pulse">
              Searching...
            </p>
          </div>
        ) : movies.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-[40vh] border border-dashed border-slate-800 rounded-3xl p-8 bg-[#12121a]/30">
            <h2 className="text-xl font-bold text-white mb-2">
              No results found
            </h2>
            <p className="text-slate-400 text-center max-w-sm">
              We couldn't find any movies or shows matching "{query}". Try
              checking your spelling or using different keywords.
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-16">
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
        )}
      </div>
    </div>
  );
};

export default SearchPage;