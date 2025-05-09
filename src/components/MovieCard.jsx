import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  IconButton,
  Chip,
  Box,
  Rating,
  Grow
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getImageUrl } from '../api/movieApi';
import { useMovies } from '../contexts/MovieContext';

const MovieCard = ({ movie, index, genresList }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const truncatedTitle = movie.title.length > 25 
    ? `${movie.title.substring(0, 25)}...` 
    : movie.title;
  
  const favorite = isFavorite(movie.id);
  
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  // Get genre names for display
  const movieGenres = genresList && movie.genre_ids 
    ? movie.genre_ids
        .slice(0, 2) // Limit to first 2 genres
        .map(genreId => genresList.find(g => g.id === genreId))
        .filter(Boolean)
    : [];

  return (
    <Grow
      in={true}
      style={{ transformOrigin: '0 0 0' }}
      timeout={300 + (index % 10) * 100}
    >
      <Card 
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 8,
          }
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={getImageUrl(movie.poster_path)}
          alt={movie.title}
          sx={{
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '50%',
            padding: '4px',
          }}
        >
          <IconButton 
            size="small"
            onClick={handleFavoriteToggle}
            sx={{ 
              color: favorite ? 'error.main' : 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              mb: 0.5, 
              fontWeight: 600,
              height: '3rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {truncatedTitle}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {releaseYear}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.5} 
                readOnly 
                size="small"
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {movieGenres.map(genre => (
              <Chip 
                key={genre.id} 
                label={genre.name} 
                size="small" 
                color="secondary"
                sx={{ 
                  height: 20, 
                  fontSize: '0.7rem',
                  '& .MuiChip-label': { px: 1 }
                }} 
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default MovieCard;