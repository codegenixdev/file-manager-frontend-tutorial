import { Box, LinearProgress, Typography } from "@mui/material";
function LinearProgressWithLabel({ value }: { value: number | undefined }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={(theme) => ({
            height: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            "& .MuiLinearProgress-bar": {
              borderRadius: theme.shape.borderRadius,
            },
          })}
          variant="determinate"
          value={value}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">{`${Math.round(
        value ?? 0
      )}%`}</Typography>
    </Box>
  );
}

export { LinearProgressWithLabel };
