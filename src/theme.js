import { createTheme } from '@mui/material/styles';

// Custom color palette
const colors = {
  primary: {
    main: '#0d253f',
    light: '#344966',
    dark: '#071120',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#01b4e4',
    light: '#4dd6ff',
    dark: '#0082a5',
    contrastText: '#000000',
  },
  accent: {
    main: '#f5c518',
    light: '#ffda5b',
    dark: '#c39700',
    contrastText: '#000000',
  },
  success: {
    main: '#4caf50',
    light: '#80e27e',
    dark: '#087f23',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffc947',
    dark: '#c66900',
    contrastText: '#000000',
  },
  error: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
    contrastText: '#ffffff',
  },
};

// Common theme properties
const commonThemeProps = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      lineHeight: 1.5,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonThemeProps,
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonThemeProps,
  palette: {
    mode: 'dark',
    ...colors,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});