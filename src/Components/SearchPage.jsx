import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../Components/MovieCard"; // Make sure this path points to your shared component!

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const BASE_URL = "/api/tmdb";
        
        // 🚨 FIX: Removed the absolute TMDB URL. Now it perfectly creates "/api/tmdb/search/multi..."
        const targetUrl = `${BASE_URL}/search/multi?api_key=${apiKey}&query=${query}&page=1`;

        const response = await fetch(targetUrl);
        const data = await response.json();

        // Filter out actors/people so we only show movies and TV shows
        const filteredResults =
          data.results?.filter((item) => item.media_type !== "person") || [];
        setMovies(filteredResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-10 border-b border-slate-800/60 pb-4">
          Search Results for <span className="text-purple-500">"{query}"</span>
        </h1>

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
          /* The Grid using the shared MovieCard! */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;