import { createTheme, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      contrastText: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 
      "Inter",
  },
  palette: {
    primary: {
      main: '#a3d5ff',
      light: '#fff',
      dark: 'rgb(20, 100, 200)',
      contrastText: '#000',
    },
    secondary: {
      main: '#d7ffce',
      light: '#e3fbf7',
      dark: 'rgb(200, 20, 80)',
      contrastText: '#000',
    },
    neutral: {
      main: '#f0ffda',
      // light: '#A0AEC0',
      // dark: '#1A202C',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    custom: {
      light: 'rgb(179, 229, 252)',
      main: 'rgb(2, 136, 209)',
      dark: 'rgb(1, 87, 155)',
      contrastText: '#fff',
    },
  } as PaletteOptions,
});

export default theme;
