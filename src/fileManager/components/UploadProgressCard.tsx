import { FileThumbnail } from "@/fileManager/components/FileThumbnail";
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { ExtendedFile } from "@/fileManager/types/ExtendedFile";
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
export function UploadProgressCard(props: Props) {
  const removeFile = useFileManagerStore((state) => state.removeFile);
  const file = useFileManagerStore((state) =>
    state.files.find((file) => file.id === props.id)
  );

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file?.uploadStatus === "success") {
      let progressValue = 0;

      const interval = setInterval(() => {
        progressValue += 3;
        setProgress((prev) => prev + 3);
        if (progressValue >= 100) {
          removeFile(file.id);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [file?.id, file?.uploadStatus, removeFile]);

  const getStatusColor = useCallback(() => {
    switch (file?.uploadStatus) {
      case "success":
        return "success";
      case "error":
        return "error";
      default:
        return "info";
    }
  }, [file?.uploadStatus]);

  function handleRemove() {
    removeFile(props.id);
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
        avatar={<FileThumbnail name={props.file.name} />}
        title={props.file.name}
        subheader={
          <Box>
            <Typography sx={{ marginBottom: 1 }} variant="caption">
              {convertByteToMegabyte(props.file.size)}
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
                  value={file?.uploadProgress}
                  aria-label={`Progress: ${file?.uploadProgress ?? 0}%`}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                file?.uploadProgress ?? 0
              )}%`}</Typography>
            </Box>
          </Box>
        }
        disableTypography
      />
    </Card>
  );
}
