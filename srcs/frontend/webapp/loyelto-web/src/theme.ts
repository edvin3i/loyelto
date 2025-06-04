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
      main: '#a3d5ff', //Join LoyelTo button
      light: '#fff', //the background of the navbar
      dark: 'rgb(20, 100, 200)',
      contrastText: '#000',
    },
    secondary: {
      main: '#d7ffce', //at the moment it's our green background for the divs
      light: '#e3fbf7', //bg of the business slogans
      dark: 'rgb(200, 20, 80)',
      contrastText: '#000',
    },
    success: {
      main: '#abe7b2', //green add button in business main
      contrastText: "#000"
    },
    error: {
      main: '#f6ccca', //pink delete button in business main
      contrastText: "#000"
    },
    neutral: {
      main: '#f0ffda',
      light: '#dff1ff', //light blue in business main
      dark: '#bee2ff', //light blue button in business main
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
