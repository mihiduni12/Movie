import axios from 'axios';

const API_KEY = '0cd32f56a41aeb2d87a00247f593da5a';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwY2QzMmY1NmE0MWFlYjJkODdhMDAyNDdmNTkzZGE1YSIsIm5iZiI6MTc0NjY5MTk5NS4wODUsInN1YiI6IjY4MWM2NzliZjY3ZmY2Zjg3Mjg4YzE2ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.raliiv7YkuduQgHX7ipvwyRbh5qqgp-VIGjGVfI0lPo';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await api.get('/trending/movie/day', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const getMoviesByYear = async (year, page = 1) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        primary_release_year: year,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by year:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getYoutubeTrailerKey = (videos) => {
  if (!videos || !videos.results || videos.results.length === 0) {
    return null;
  }
  
  // Find the official trailer first
  const officialTrailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube' && video.name.includes('Official')
  );
  
  // If no official trailer, find any trailer
  const anyTrailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  // If no trailer, find any video from YouTube
  const anyYoutubeVideo = videos.results.find(
    video => video.site === 'YouTube'
  );
  
  return officialTrailer?.key || anyTrailer?.key || anyYoutubeVideo?.key || null;
};

export default api;