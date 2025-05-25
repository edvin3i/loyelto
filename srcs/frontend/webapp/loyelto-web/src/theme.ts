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
      main: '#abe7b2', //green in the business main page
      light: '#f3f3f3', //grey in the business main
      dark: '#0082ff', //blue in the business main
      contrastText: '#000',
    },
    custom: {
      light: 'rgb(179, 229, 252)',
      main: '#f6ccca',
      dark: 'rgb(1, 87, 155)',
      contrastText: '#000',
    },
  } as PaletteOptions,
});

export default theme;
