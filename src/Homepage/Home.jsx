import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../Components/MovieCard"; // ⚠️ Check your path!

const HomePage = () => {
  const navigate = useNavigate();

  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [oscarMovies, setOscarMovies] = useState([]); // 🚨 Added state for Oscars

  const [activeGenre, setActiveGenre] = useState("All");

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "/api/tmdb"; 

  const genres = [
    { name: "Action", id: 28 },
    { name: "Adventure", id: 12 },
    { name: "Sci-Fi", id: 878 },
    { name: "Drama", id: 18 },
    { name: "Thriller", id: 53 },
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const fetchData = async (endpoint) => {
          const res = await fetch(`${BASE_URL}${endpoint}`);
          const data = await res.json();
          return data.results;
        };

        const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
          fetchData(`/trending/movie/day?api_key=${apiKey}`),
          fetchData(`/movie/popular?api_key=${apiKey}`),
          fetchData(`/movie/top_rated?api_key=${apiKey}`),
          fetchData(`/movie/upcoming?api_key=${apiKey}`)
        ]);

        // Fetching Oscar Data smoothly
        const oscarRes = await fetch(`${BASE_URL}/list/28?api_key=${apiKey}`);
        const oscarData = await oscarRes.json();

        // Fetching Hero Details smoothly
        const heroId = trendingData[0].id;
        const heroDetailsRes = await fetch(`${BASE_URL}/movie/${heroId}?api_key=${apiKey}&append_to_response=videos`);
        const heroDetails = await heroDetailsRes.json();

        setHeroMovie(heroDetails);
        
        setTrending(trendingData.slice(1, 4)); 
        setPopular(popularData.slice(0, 4)); 
        setUpcoming(upcomingData.slice(4, 8)); 
        setTopRated(topRatedData.slice(0, 5));
        setOscarMovies(oscarData.items?.slice(0, 10) || []); 

      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      }
    };

    fetchHomeData();
  }, [apiKey]);

  const handleGenreClick = async (genreName, genreId) => {
    setActiveGenre(genreName);
    try {
      const endpoint = genreName === "All" 
        ? `/movie/popular?api_key=${apiKey}`
        : `/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
        
      const res = await fetch(`${BASE_URL}${endpoint}`);
      const data = await res.json();
      
      setPopular(data.results.slice(0, 8));
    } catch (error) {
      console.error("Error fetching genre:", error);
    }
  };

  if (!heroMovie)
    return (
      <div className="bg-[#0b0b13] min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const heroTrailer = heroMovie.videos?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube",
  );

  return (
    <div className="bg-[#0b0b13] min-h-screen text-slate-200 font-sans p-4 md:p-8">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-125 md:h-150 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-10 bg-black max-w-[1600px] mx-auto">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {heroTrailer ? (
            <iframe
              className="w-full h-full object-cover scale-125 opacity-70"
              src={`https://www.youtube.com/embed/${heroTrailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${heroTrailer.key}`}
              title="Trailer"
              allow="autoplay; encrypted-media"
            ></iframe>
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-[#0b0b13] via-[#0b0b13]/50 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#0b0b13] via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col justify-center h-full max-w-2xl px-8 md:px-16 pointer-events-auto">
          <p className="text-purple-500 font-bold tracking-widest text-sm mb-2 uppercase">
            Now Playing
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            {heroMovie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-300 mb-6">
            <span>{heroMovie.release_date?.slice(0, 4)}</span>
            <span>⭐ {heroMovie.vote_average?.toFixed(1)}</span>
          </div>

          <p className="text-slate-300 text-lg mb-8 line-clamp-3">
            {heroMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/details/movie/${heroMovie.id}`)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-900/50"
            >
              ▶ Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* 🚨 FIX: Replaced custom layout tag with valid div wrapper */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
        <div className="xl:col-span-8 flex flex-col gap-10">
          <SectionTemplate
            title="Trending Now"
            viewAllLink="/view-all/trending"
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SectionTemplate>

          <SectionTemplate
            title="Popular Movies"
            viewAllLink="/view-all/popular"
          >
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleGenreClick("All", null)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${activeGenre === "All" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30" : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700"}`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.name, genre.id)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${activeGenre === genre.name ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30" : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700"}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popular.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SectionTemplate>

          <SectionTemplate
            title="Upcoming Movies"
            viewAllLink="/view-all/upcoming"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {upcoming.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SectionTemplate>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="bg-[#12121a] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ⭐ Top Rated
              </h2>
              <Link
                to="/view-all/top_rated"
                className="text-purple-500 text-sm hover:text-purple-400"
              >
                View all
              </Link>
            </div>
            <div className="md:grid grid-cols-2 xl:flex flex-col gap-3">
              {topRated.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/details/movie/${movie.id}`)}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-purple-400">
                    {index + 1}
                  </div>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-12 h-16 rounded object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {movie.release_date?.slice(0, 4)} • ⭐{" "}
                      {movie.vote_average?.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEW OSCAR WINNERS LIST */}
          <div className="bg-[#12121a] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🏆 Oscar Winners
              </h2>
              <Link
                to="/view-all/oscars"
                className="text-purple-500 text-sm hover:text-purple-400"
              >
                View all
              </Link>
            </div>
            <div className="md:grid grid-cols-2 xl:flex flex-col gap-3">
              {oscarMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/details/movie/${movie.id}`)}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-yellow-500">
                    {index + 1}
                  </div>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Poster"
                    }
                    alt={movie.title}
                    className="w-12 h-16 rounded object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-yellow-500 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {movie.release_date?.slice(0, 4)} • ⭐{" "}
                      {movie.vote_average?.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTemplate = ({ title, viewAllLink, children }) => (
  <div className="w-full">
    <div className="flex w-full justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <Link
        to={viewAllLink}
        className="text-slate-400 hover:text-purple-400 text-sm font-semibold flex items-center gap-1 transition-colors"
      >
        View all <span className="text-lg">›</span>
      </Link>
    </div>
    {children}
  </div>
);

export default HomePage;