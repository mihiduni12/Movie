import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Drawer,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
  Chip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const MovieFilter = ({ genres, onFilter, activeFilters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(activeFilters.genreId || '');
  const [selectedYear, setSelectedYear] = useState(activeFilters.year || '');
  const [ratingRange, setRatingRange] = useState(activeFilters.rating || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleApplyFilters = () => {
    onFilter({
      genreId: selectedGenre,
      year: selectedYear,
      rating: ratingRange
    });
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setRatingRange('');
    onFilter({
      genreId: '',
      year: '',
      rating: ''
    });
  };

  const hasActiveFilters = selectedGenre || selectedYear || ratingRange;

  const filterContent = (
    <Box sx={{ p: 3, width: isMobile ? 'auto' : 300 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Filter Movies
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} edge="end">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="genre-select-label">Genre</InputLabel>
        <Select
          labelId="genre-select-label"
          id="genre-select"
          value={selectedGenre}
          label="Genre"
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <MenuItem value="">
            <em>All Genres</em>
          </MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="year-select-label">Release Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          label="Release Year"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <MenuItem value="">
            <em>All Years</em>
          </MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="rating-select-label">Minimum Rating</InputLabel>
          <Select
            labelId="rating-select-label"
            id="rating-select"
            value={ratingRange}
            label="Minimum Rating"
            onChange={(e) => setRatingRange(e.target.value)}
          >
            <MenuItem value="">Any Rating</MenuItem>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}+
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyFilters}
          fullWidth
        >
          Apply Filters
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );

  const mobileFilterButton = (
    <IconButton 
      onClick={handleDrawerToggle} 
      color="primary" 
      sx={{ 
        bgcolor: 'background.paper', 
        boxShadow: 2,
        '&:hover': {
          bgcolor: 'background.paper',
          opacity: 0.9
        } 
      }}
    >
      <FilterIcon />
    </IconButton>
  );

  // Display active filters as chips
  const activeFilterChips = () => {
    const chips = [];
    
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre);
      if (genre) {
        chips.push({
          key: 'genre',
          label: `Genre: ${genre.name}`,
          onDelete: () => {
            setSelectedGenre('');
            onFilter({...activeFilters, genreId: ''});
          }
        });
      }
    }
    
    if (selectedYear) {
      chips.push({
        key: 'year',
        label: `Year: ${selectedYear}`,
        onDelete: () => {
          setSelectedYear('');
          onFilter({...activeFilters, year: ''});
        }
      });
    }
    
    if (ratingRange) {
      chips.push({
        key: 'rating',
        label: `Rating: ${ratingRange}+`,
        onDelete: () => {
          setRatingRange('');
          onFilter({...activeFilters, rating: ''});
        }
      });
    }
    
    return chips;
  };

  return (
    <>
      {isMobile ? (
        <>
          <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {mobileFilterButton}
          </Box>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerToggle}
          >
            {filterContent}
          </Drawer>
        </>
      ) : (
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              {filterContent}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Active filters display */}
      {activeFilterChips().length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: isMobile ? 0 : -2 }}>
          <Typography variant="body2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            Active filters:
          </Typography>
          {activeFilterChips().map(chip => (
            <Chip
              key={chip.key}
              label={chip.label}
              onDelete={chip.onDelete}
              color="primary"
              size="small"
              variant="outlined"
            />
          ))}
          {activeFilterChips().length > 1 && (
            <Chip
              label="Clear all"
              onClick={handleClearFilters}
              size="small"
              color="secondary"
            />
          )}
        </Box>
      )}
    </>
  );
};

export default MovieFilter;