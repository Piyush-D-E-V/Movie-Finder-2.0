import { Link } from "react-router-dom";

export default function MovieRow({ title, movies, categoryPath }) {
  // Only take the first 4 movies for the Home Page
  const displayMovies = movies?.slice(0, 4) || [];

  return (
    <div className="mb-10">
      {/* Header section with Title and "View all" */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {/* A small purple icon accent like in the image */}
          <span className="text-violet-500">❖</span> {title}
        </h2>
        
        {/* This link will take them to the page with pagination (+ / -) */}
        <Link 
          to={`/category/${categoryPath}`} 
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all ❯
        </Link>
      </div>

      {/* The 4-Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayMovies.map((movie) => (
          <Link 
            to={`/details/${movie.media_type || 'movie'}/${movie.id}`} 
            key={movie.id} 
            className="group relative flex flex-col gap-2 rounded-xl bg-[#13151a] p-2 hover:bg-[#1c1f26] transition-colors border border-gray-800/50"
          >
            <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title || movie.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Movie Info */}
            <div className="px-1 pb-1">
              <h3 className="text-sm font-bold text-white truncate">
                {movie.title || movie.name}
              </h3>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span>{movie.release_date?.slice(0,4) || "N/A"}</span>
                <span className="text-yellow-500 font-bold">⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}