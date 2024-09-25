import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ConfirmProvider } from "./confirm/components/Provider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
            MuiPopover: { defaultProps: { elevation: 1 } },
            MuiCard: { defaultProps: { elevation: 0 } },
          },
          shape: { borderRadius: 16 },
        })}
      >
        <CssBaseline />
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
