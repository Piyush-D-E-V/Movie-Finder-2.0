import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  // 1. Initialize state directly from localStorage so data persists on refresh
  const [watchlist, setWatchlist] = useState(() => {
    const savedItems = localStorage.getItem("movie_watchlist");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // 2. Automatically update localStorage whenever the watchlist changes
  useEffect(() => {
    localStorage.setItem("movie_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // 3. Add movie if it doesn't already exist in the list
  const addToWatchlist = (movie) => {
    if (!watchlist.some((item) => item.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  // 4. Remove movie by its ID
  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  };

  // 5. Helper function to check if a movie is already added
  const isAdded = (id) => watchlist.some((item) => item.id === id);
// ... rest of your provider code above ...
  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isAdded }}>
      {children}
    </WatchlistContext.Provider>
  );
};

// ADD THIS EXACT LINE TO FIX THE ERROR:
// eslint-disable-next-line react-refresh/only-export-components
export const useWatchlist = () => useContext(WatchlistContext);