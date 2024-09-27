import ContrastRoundedIcon from "@mui/icons-material/ContrastRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { MenuItem, Select, useColorScheme } from "@mui/material";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  if (!mode || !setMode) {
    return null;
  }

  return (
    <Select
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as "system" | "light" | "dark")
      }
      variant="standard"
      disableUnderline
      sx={{
        ".MuiSelect-icon": { display: "none" },
      }}
    >
      <MenuItem value="system">
        <ContrastRoundedIcon />
      </MenuItem>
      <MenuItem value="light">
        <LightModeRoundedIcon />
      </MenuItem>
      <MenuItem value="dark">
        <DarkModeRoundedIcon />
      </MenuItem>
    </Select>
  );
}
