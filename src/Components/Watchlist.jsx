import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";

const Watchlist = () => {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-10 border-b border-slate-800/60 pb-4">
          My Watchlist <span className="text-purple-500 text-xl ml-2">({watchlist.length})</span>
        </h1>

        {/* --- EMPTY STATE HANDLING --- */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] border border-dashed border-slate-800 rounded-3xl p-8 bg-[#12121a]/30">
            <div className="w-16 h-16 bg-slate-800/60 text-purple-400 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4">
              🔖
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Your Watchlist is empty</h2>
            <p className="text-slate-400 text-center max-w-sm mb-6 text-sm">
              Explore your home dashboard and save trending movies or shows to watch them later.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-purple-900/40"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          
          /* --- LIST RENDERING --- */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <div 
                key={movie.id} 
                onClick={() => navigate(`/details/movie/${movie.id}`)}
                className="flex flex-col gap-2 group cursor-pointer relative"
              >
                <div className="relative overflow-hidden rounded-xl aspect-2/3 border border-slate-800 group-hover:border-purple-500 transition-colors bg-slate-900">
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
                    alt={movie.title || movie.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Delete Button inside the Watchlist page grid */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(movie.id);
                    }}
                    className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center font-bold z-20 border border-red-500/50 shadow-md transition-colors"
                    title="Remove item"
                  >
                    ✕
                  </button>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                      Details
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-white mt-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {movie.title || movie.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "N/A"} 
                  <span className="text-purple-500 ml-2">⭐ {movie.vote_average?.toFixed(1)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;