import { Palette, PaletteOptions } from '@mui/material/styles';
import { ButtonPropsColorOverrides } from "@mui/material/Button";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']; // Same structure as primary
    info: Palette['primary'];
    custom: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    info?: PaletteOptions['primary'];
    custom?: PaletteOptions['primary'];
  }
}
