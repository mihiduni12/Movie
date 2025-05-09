import { createContext, useState, useContext, useEffect } from 'react';
import { 
  getTrendingMovies, 
  searchMovies, 
  getGenres 
} from '../api/movieApi';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState(() => {
    return localStorage.getItem('lastSearchQuery') || '';
  });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Load trending movies initially
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await getTrendingMovies();
        setTrendingMovies(data.results);
      } catch (error) {
        setError('Failed to fetch trending movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Load genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresList = await getGenres();
        setGenres(genresList);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save last search query to localStorage
  useEffect(() => {
    if (lastSearchQuery) {
      localStorage.setItem('lastSearchQuery', lastSearchQuery);
    }
  }, [lastSearchQuery]);

  const fetchMovies = async (query, page = 1, resetResults = false) => {
    try {
      setLoading(true);
      setError('');
      
      if (query) {
        const data = await searchMovies(query, page);
        
        if (resetResults) {
          setSearchResults(data.results);
        } else {
          setSearchResults(prev => [...prev, ...data.results]);
        }
        
        setTotalPages(data.total_pages);
        setLastSearchQuery(query);
        return data;
      } else {
        const data = await getTrendingMovies(page);
        
        if (resetResults) {
          setSearchResults([]);
        }
        
        return data;
      }
    } catch (error) {
      setError('Failed to fetch movies. Please try again later.');
      return { results: [] };
    } finally {
      setLoading(false);
    }
  };

  const searchForMovies = async (query, page = 1) => {
    setSearchQuery(query);
    setCurrentPage(page);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    await fetchMovies(query, page, true);
  };

  const loadMoreMovies = async () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
      await fetchMovies(searchQuery, nextPage, false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
  };

  const addToFavorites = (movie) => {
    setFavorites(prev => {
      if (prev.some(m => m.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const value = {
    trendingMovies,
    searchResults,
    searchQuery,
    lastSearchQuery,
    genres,
    loading,
    error,
    currentPage,
    totalPages,
    favorites,
    searchForMovies,
    loadMoreMovies,
    clearSearch,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;