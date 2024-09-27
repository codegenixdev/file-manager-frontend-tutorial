import { FileThumbnail } from "@/fileManager/components/FileThumbnail";
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { convertByteToMegabyte } from "@/shared/utils";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { Box, LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

type Props = ExtendedFile;
export function UploadProgressCard({
  file,
  id,
  uploadStatus,
  uploadProgress,
}: Props) {
  const removeFile = useFileManagerStore((state) => state.removeFile);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploadStatus === "success") {
      let progressValue = 0;

      const interval = setInterval(() => {
        progressValue += 3;
        setProgress((prev) => prev + 3);
        if (progressValue >= 100) {
          removeFile(id);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [id, removeFile, uploadStatus]);

  const getStatusColor = useCallback(() => {
    switch (uploadStatus) {
      case "success":
        return "success";
      case "error":
        return "error";
      default:
        return "info";
    }
  }, [uploadStatus]);

  function handleRemove() {
    removeFile(id);
  }

  return (
    <Card
      sx={{ textAlign: "left" }}
      component="div"
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader
        action={
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              color="inherit"
              value={progress}
              size={40}
              thickness={4}
            />
            <Stack
              sx={{
                inset: 0,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={handleRemove}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        }
        avatar={<FileThumbnail name={file.name} />}
        title={file.name}
        subheader={
          <Box>
            <Typography sx={{ marginBottom: 1 }} variant="caption">
              {convertByteToMegabyte(file.size)}
            </Typography>

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
                  color={getStatusColor()}
                  value={uploadProgress}
                  aria-label={`Progress: ${uploadProgress ?? 0}%`}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                uploadProgress ?? 0
              )}%`}</Typography>
            </Box>
          </Box>
        }
        disableTypography
      />
    </Card>
  );
}
