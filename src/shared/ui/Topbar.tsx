import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export function Topbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File manager
          </Typography>

          <ThemeToggle />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
