import { useState } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, Paper } from '@mui/material';

const YouTubeTrailer = ({ videoKey, title }) => {
  const [error, setError] = useState(false);
  
  if (!videoKey) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No trailer available for this movie.
        </Typography>
      </Paper>
    );
  }
  
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };
  
  const onError = () => {
    setError(true);
  };
  
  if (error) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Error loading trailer. Please try again later.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 aspect ratio
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <YouTube videoId={videoKey} opts={opts} onError={onError} />
      </Box>
    </Box>
  );
};

export default YouTubeTrailer;