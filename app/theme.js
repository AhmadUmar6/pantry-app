import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: 'var(--font-quicksand), var(--font-poppins), Arial, sans-serif',
  h1: {
    fontFamily: 'var(--font-pacifico), var(--font-poppins), Arial, sans-serif',
  },
  h2: {
    fontFamily: 'var(--font-fredoka), var(--font-poppins), Arial, sans-serif',
  },
  h5: {
    fontFamily: 'var(--font-comic-neue), var(--font-poppins), Arial, sans-serif',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  typography: commonTypography,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  typography: commonTypography,
});