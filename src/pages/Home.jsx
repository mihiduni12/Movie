import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Paper
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import MovieFilter from '../components/MovieFilter';
import { getMoviesByGenre, getMoviesByYear } from '../api/movieApi';

const Home = () => {
  const { 
    trendingMovies, 
    searchResults, 
    searchQuery, 
    genres,
    loading, 
    error, 
    clearSearch,
    loadMoreMovies,
    currentPage,
    totalPages
  } = useMovies();
  
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genreId: '',
    year: '',
    rating: ''
  });
  const [filterCollapsed, setFilterCollapsed] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const applyFilters = async () => {
      if (!searchQuery && (activeFilters.genreId || activeFilters.year || activeFilters.rating)) {
        setFilterLoading(true);
        try {
          let results = [];

          if (activeFilters.genreId) {
            const data = await getMoviesByGenre(activeFilters.genreId);
            results = data.results;
          } else if (activeFilters.year) {
            const data = await getMoviesByYear(activeFilters.year);
            results = data.results;
          } else {
            results = [...trendingMovies];
          }

          if (activeFilters.rating) {
            results = results.filter(movie => movie.vote_average >= Number(activeFilters.rating));
          }

          setFilteredMovies(results);
        } catch (error) {
          console.error('Error applying filters:', error);
        } finally {
          setFilterLoading(false);
        }
      } else if (!searchQuery) {
        setFilteredMovies(trendingMovies);
      }
    };
    
    applyFilters();
  }, [activeFilters, trendingMovies, searchQuery]);
  
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const toggleFilterCollapse = () => {
    setFilterCollapsed(prev => !prev);
  };

  const showFilters = !searchQuery;
  const showTrending = !searchQuery && !activeFilters.genreId && !activeFilters.year && !activeFilters.rating;
  const showFiltered = !searchQuery && (activeFilters.genreId || activeFilters.year || activeFilters.rating);
  const showSearchResults = searchQuery;
  
  const displayedMovies = showSearchResults 
    ? searchResults 
    : showFiltered 
      ? filteredMovies 
      : trendingMovies;
  
  const getTitle = () => {
    if (showSearchResults) {
      return `Search Results for "${searchQuery}"`;
    } else if (showFiltered) {
      let title = "Filtered Movies";
      if (activeFilters.genreId) {
        const genre = genres.find(g => g.id === activeFilters.genreId);
        title = genre ? `${genre.name} Movies` : title;
      } else if (activeFilters.year) {
        title = `Movies from ${activeFilters.year}`;
      }
      return title;
    } else {
      return "Trending Movies";
    }
  };
  
  if (loading && displayedMovies.length === 0) {
    return <Loading message="Loading movies..." />;
  }
  
  return (
    <Fade in timeout={500}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Filter Section */}
        {showFilters && genres.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Button 
              onClick={toggleFilterCollapse}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              {filterCollapsed ? 'Show Filters' : 'Hide Filters'}
            </Button>

            {!filterCollapsed && (
              <MovieFilter 
                genres={genres} 
                onFilter={handleFilterChange}
                activeFilters={activeFilters}
              />
            )}
          </Box>
        )}

        {/* Back to trending button */}
        {showSearchResults && (
          <Box sx={{ mb: 4 }}>
            <Button 
              onClick={clearSearch}
              startIcon={<RefreshIcon />}
              variant="outlined" 
              color="secondary"
            >
              Back to Trending
            </Button>
          </Box>
        )}
        
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {showTrending && (
            <TrendingIcon color="secondary" sx={{ mr: 1, fontSize: 30 }} />
          )}
          <Typography variant="h4" component="h1" fontWeight="700">
            {getTitle()}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Error message */}
        {error && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: 'error.light', 
              color: 'error.contrastText' 
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Paper>
        )}
        
        {/* Loading overlay for filtered content */}
        {filterLoading && <Loading message="Applying filters..." />}
        
        {/* No results */}
        {!loading && !filterLoading && displayedMovies.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No movies found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
        
        {/* Movie grid */}
        {!filterLoading && displayedMovies.length > 0 && (
          <Grid container spacing={3}>
            {displayedMovies.map((movie, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                <MovieCard movie={movie} index={index} genresList={genres} />
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Load more button */}
      {currentPage < totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={loadMoreMovies}
            disabled={loading}
            size="large"
          >
            Load More
          </Button>
        </Box>
      )}

      </Container>
    </Fade>
  );
};

export default Home;
