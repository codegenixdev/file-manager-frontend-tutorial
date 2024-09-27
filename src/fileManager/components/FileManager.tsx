import { FilesDataGrid } from "@/fileManager/components/FilesDataGrid";
import { UploadProgressCard } from "@/fileManager/components/UploadProgressCard";
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { useFileUploadMutation } from "@/fileManager/hooks/useFileUploadMutation";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import {
  alpha,
  Box,
  ButtonBase,
  colors,
  Stack,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

export function FileManager() {
  const files = useFileManagerStore((state) => state.files);

  const [autoAnimateRef] = useAutoAnimate();

  const fileUploadMutation = useFileUploadMutation();

  function onDrop(acceptedFiles: File[]) {
    fileUploadMutation.mutate(
      acceptedFiles.map((item) => ({
        file: item,
        id: `${item.name}${item.size}`,
        uploadProgress: 0,
        uploadStatus: "idle",
      }))
    );
  }

  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   "image/*": [],
    //   "video/*": [],
    // },
    onDrop,
    maxFiles: 15,
    maxSize: 10_000_000_000,
  });

  return (
    <>
      <Typography variant="h4">Files</Typography>
      <Typography sx={{ marginBottom: 3 }}>
        Files and assets that have been uploaded as part of this project.
      </Typography>
      <ButtonBase
        sx={(theme) => ({
          backgroundColor: alpha(colors.grey[500], 0.1),
          padding: 2,
          width: 1,
          borderRadius: `${theme.shape.borderRadius}px`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 3,
        })}
        disableRipple
        {...getRootProps()}
      >
        <Box component="input" {...getInputProps()} />

        <FileUploadRoundedIcon fontSize="large" />

        <Stack sx={{ alignItems: "center", gap: 1 }}>
          <Typography>Click to upload or drag and drop</Typography>
          <Typography>Max 10GB.</Typography>
        </Stack>
        <Stack sx={{ gap: 2, width: 1 }} ref={autoAnimateRef}>
          {files.map((file) => (
            <Stack key={file.id}>
              <UploadProgressCard {...file} />
            </Stack>
          ))}
        </Stack>
      </ButtonBase>
      <FilesDataGrid />
    </>
  );
}
