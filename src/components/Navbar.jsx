import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography,
  IconButton, 
  InputBase,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Movie as MovieIcon,
  Favorite as FavoriteIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useMovies } from '../contexts/MovieContext';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: theme.transitions.create('width'),
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const { searchForMovies, clearSearch } = useMovies();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      searchForMovies(searchValue);
      navigate('/');
    } else {
      clearSearch();
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (!e.target.value.trim()) {
      clearSearch();
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Container maxWidth="xl">
        <Toolbar>
          {/* Logo & Title */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            <MovieIcon sx={{ mr: 1 }} />
            Movie Explorer
          </Typography>

          {/* Search Bar */}
          {currentUser && (
            <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <SearchContainer>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search for movies..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </SearchContainer>
            </Box>
          )}

          {/* Navigation Items */}
          {currentUser ? (
            <>
              {isMobile ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="open menu"
                    onClick={handleMobileMenuOpen}
                    edge="end"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={Boolean(mobileMenuAnchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem component={RouterLink} to="/" onClick={handleMenuClose}>
                      <MovieIcon sx={{ mr: 1 }} /> Home
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/favorites" onClick={handleMenuClose}>
                      <FavoriteIcon sx={{ mr: 1 }} /> Favorites
                    </MenuItem>
                    <MenuItem onClick={toggleDarkMode}>
                      {darkMode ? <LightModeIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/"
                    sx={{ mr: 1 }}
                  >
                    Home
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/favorites"
                    startIcon={<FavoriteIcon />}
                    sx={{ mr: 2 }}
                  >
                    Favorites
                  </Button>
                  <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                    <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 2 }}>
                      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={currentUser.name || currentUser.username}>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      edge="end"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
              >
                Login
              </Button>
              <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton onClick={toggleDarkMode} color="inherit" sx={{ ml: 1 }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;