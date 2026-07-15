import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext"; 

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isAdded } = useWatchlist();

  // 🚨 THE BULLETPROOF CHECK 🚨
  // 1. Try to get media_type directly.
  // 2. If missing, check if 'name' exists (which means it's a TV show).
  // 3. Otherwise, assume it's a movie.
  const actualMediaType = movie.media_type || (movie.name ? "tv" : "movie");

  const handleWatchlistToggle = (e) => {
    e.stopPropagation(); 
    if (isAdded(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div 
      // 🚨 NOW USING OUR BULLETPROOF VARIABLE HERE
      onClick={() => navigate(`/details/${actualMediaType}/${movie.id}`)}
      className="flex flex-col gap-2 group cursor-pointer relative"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-2/3 border-2 border-slate-800 group-hover:border-purple-500 transition-colors bg-slate-900">
        <img 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
          alt={movie.title || movie.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <button 
          onClick={handleWatchlistToggle}
          className={`absolute top-3 right-3 rounded-full w-8 h-8 flex items-center justify-center font-bold z-20 border transition-all ${
            isAdded(movie.id)
              ? "bg-green-600 text-white border-green-400 shadow-md shadow-green-900/40"
              : "bg-black/60 hover:bg-purple-600 text-white border-slate-500/50 hover:border-purple-400"
          }`}
          title={isAdded(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {isAdded(movie.id) ? "✓" : "+"}
        </button>

        <div className="absolute bottom-1 left-1 rounded-xl  bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg cursor-pointer">
            View Details
          </button>
        </div>
      </div>
      <h3 className="font-bold text-white mt-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
        {movie.title || movie.name}
      </h3>
      <p className="text-sm text-slate-400 font-semibold">
        {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "N/A"} 
        <span className="text-purple-500 ml-2">⭐ {movie.vote_average?.toFixed(1)}</span>
      </p>
    </div>
  );
};

export default MovieCard;