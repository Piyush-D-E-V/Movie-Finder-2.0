import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 1. Added Link here

const Navbar = () => {
  const [textval, setTextval] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (!textval.trim()) return;
    navigate(`/search?query=${textval}`);
    setTextval('');
  }

  return (
    <nav className="w-full bg-[#0b0b13]">
      <div className="w-full  grid grid-rows-2 justify-center sm:flex justify-between items-center py-3 max-w-[1600px] mx-auto gap-2">
      <div className="gap-6 w-full flex justify-between items-center sm:justify-start">
        <Link to="/" className="text-2xl font-bold tracking-wider text-yellow-400">
          🎬 MovieApp
        </Link>
        <Link to="/watchlist" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-900/50">
          Watchlist
        </Link>
      </div>

      <div className="w-[90VW] flex justify-end">
        <form onSubmit={handleSearch} className="w-full flex justify-end gap-2">
          <input 
            className="text-purple-100 bg-purple-400/10 px-3 py-1 rounded-sm focus:outline-none w-full max-w-150 border-2 border-purple-600 flex self-end" 
            type="text"
            value={textval}
            onChange={(e) => setTextval(e.target.value)} 
            placeholder="Search for a movie..."
          />
          <button 
            type="submit" 
            className="bg-yellow-500 text-slate-900 font-semibold px-4 py-1 rounded-sm hover:bg-yellow-400 transition-colors flex"
          >
            Search
          </button>
        </form>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;