import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Button,
  Paper,
  Fade
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useMovies } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const { favorites, removeFromFavorites, genres } = useMovies();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleClearAll = () => {
    setIsDeleting(true);
    // Simulate a delay for better UX
    setTimeout(() => {
      favorites.forEach(movie => {
        removeFromFavorites(movie.id);
      });
      setIsDeleting(false);
    }, 500);
  };
  
  return (
    <Fade in timeout={500}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FavoriteIcon color="error" sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h4" component="h1" fontWeight="700">
            My Favorites
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {favorites.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', my: 6 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't added any favorites yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Browse through movies and click the heart icon to add them to your favorites
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              href="/"
            >
              Explore Movies
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClearAll}
                disabled={isDeleting}
              >
                {isDeleting ? 'Clearing...' : 'Clear All Favorites'}
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {favorites.map((movie, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie.id}>
                  <MovieCard movie={movie} index={index} genresList={genres} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Fade>
  );
};

export default Favorites;