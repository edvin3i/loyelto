import { Palette, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']; // Same structure as primary
    info: Palette['primary'];
    custom: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    info?: PaletteOptions['primary'];
    custom?: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
  }
}
