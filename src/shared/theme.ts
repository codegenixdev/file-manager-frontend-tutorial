import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
    MuiPopover: { defaultProps: { elevation: 1 } },
    MuiCard: { defaultProps: { elevation: 0 } },
  },
  shape: { borderRadius: 16 },
  colorSchemes: {
    dark: true,
  },
});
