import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Rating,
  Avatar,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { getMovieDetails, getImageUrl, getYoutubeTrailerKey } from '../api/movieApi';
import { useMovies } from '../contexts/MovieContext';
import Loading from '../components/Loading';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        setError('Failed to fetch movie details. Please try again later.');
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleFavoriteToggle = () => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleTrailerToggle = () => setShowTrailer(prev => !prev);

  if (loading) return <Loading message="Loading movie details..." />;
  if (error) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h5" gutterBottom>Error</Typography>
          <Typography>{error}</Typography>
          <Button variant="contained" color="secondary" onClick={handleBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!movie) return null;

  const trailerKey = getYoutubeTrailerKey(movie.videos);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const directors = movie.credits?.crew.filter(p => p.job === 'Director') || [];
  const cast = movie.credits?.cast.slice(0, 6) || [];

  return (
    <Fade in timeout={500}>
      <Box>
        <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }} color="inherit">
            Back
          </Button>

          <Grid container spacing={4}>
            {/* Poster */}
            <Grid item xs={12} sm={4} md={3}>
              <Grow in timeout={500}>
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    minHeight: 400,
                    '&:hover': { transform: 'scale(1.02)' },
                    transition: 'transform 0.3s',
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Paper>
              </Grow>
            </Grid>

            {/* Info */}
            <Grid item xs={12} sm={8} md={9}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="h3" component="h1" fontWeight="700" sx={{ mr: 2 }}>
                    {movie.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    ({releaseYear})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {movie.genres?.map(genre => (
                    <Chip key={genre.id} label={genre.name} color="secondary" size="medium" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={movie.vote_average / 2}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                    />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {movie.vote_average.toFixed(1)}/10
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant={isFavorite(movie.id) ? 'contained' : 'outlined'}
                      color={isFavorite(movie.id) ? 'error' : 'primary'}
                      startIcon={isFavorite(movie.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      onClick={handleFavoriteToggle}
                    >
                      {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>

                    {trailerKey && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PlayIcon />}
                        onClick={handleTrailerToggle}
                      >
                        {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Trailer */}
                {showTrailer && (
                  <Box sx={{ mb: 4, position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title={movie.title}
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                        borderRadius: '10px',
                      }}
                    />
                  </Box>
                )}

                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {movie.overview || 'No overview available.'}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {movie.runtime && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle1" fontWeight="600">Runtime</Typography>
                      <Typography variant="body1">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</Typography>
                    </Grid>
                  )}
                  {movie.release_date && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle1" fontWeight="600">Release Date</Typography>
                      <Typography variant="body1">
                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Grid>
                  )}
                  {movie.original_language && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle1" fontWeight="600">Language</Typography>
                      <Typography variant="body1" textTransform="uppercase">
                        {movie.original_language}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Director */}
                {directors.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {directors.length > 1 ? 'Directors' : 'Director'}
                    </Typography>
                    <Typography variant="body1">{directors.map(d => d.name).join(', ')}</Typography>
                  </Box>
                )}

                {/* Cast */}
                {cast.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Cast</Typography>
                    <Grid container spacing={2}>
                      {cast.map(person => (
                        <Grid item xs={6} sm={4} md={2} key={person.id}>
                          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Avatar
                                src={person.profile_path ? getImageUrl(person.profile_path, 'w200') : null}
                                alt={person.name}
                                sx={{ width: 80, height: 80, mb: 1 }}
                              >
                                {person.name.charAt(0)}
                              </Avatar>
                              <Typography variant="subtitle1" fontWeight="600" noWrap>{person.name}</Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>{person.character}</Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default MovieDetails;
