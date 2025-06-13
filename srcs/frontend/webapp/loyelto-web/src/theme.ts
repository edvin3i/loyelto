import { createTheme, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    custom: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    custom?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 
      "Inter",
  },
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          // Override color for selected state (icon and label)
          color: '#000', // default color
          '&.Mui-selected': {
            color: '#0082ff', // selected color
          },
        },
        label: {
          '&.Mui-selected': {
            color: '#0082ff',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#a3d5ff', //Join LoyelTo button
      light: '#fff', //the background of the navbar
      dark: '#7ac0fa', //the main button when hovered
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',// I think 'secondary' should be the color of the navbars
      light: '#e3fbf7', //bg of the business slogans
      dark: 'rgb(200, 20, 80)',
      contrastText: '#000',
    },
    success: {
      main: '#abe7b2', //green add button in business main
      light: '#d7ffce', //now it's the green in the waitlist and landing's main section background
      dark: '',
      contrastText: "#000"
    },
    error: {
      main: '#f6ccca', //pink delete button in business main
      contrastText: "#000"
    },
    neutral: {
      main: '#bee2ff', //think this wil just be the edit promo button
      light: '#dff1ff', //light blue in business main
      dark: '#8dbce2', //border of the coupon in the client's page
      contrastText: '#000',
    },
    info: {
      main: '#8ecdff', //blue in the business signup buttons
      light: '#f3f3f3', //grey in the business main
      dark: '#0082ff', //blue in the business main
      contrastText: '#000',
    },
    custom: {
      main: '#f6ccca',
      light: 'rgb(179, 229, 252)',
      dark: 'rgb(1, 87, 155)',
      contrastText: '#000',
    },
  } as PaletteOptions,
});

export default theme;
