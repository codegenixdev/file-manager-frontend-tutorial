import { App } from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmProvider } from "@/shared/confirm/components/ConfirmProvider";
import { theme } from "@/shared/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
