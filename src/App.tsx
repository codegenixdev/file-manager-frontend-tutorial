import { useAutoAnimate } from "@formkit/auto-animate/react";

import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import { Box, ButtonBase, Container, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone,
} from "react-dropzone";
import { FilesDataGrid } from "./FilesDataGrid";
import { PreviewCard } from "./PreviewCard";
import { useUploadFiles } from "./services/mutations";
import { useFileStore } from "./store/useFileStore";

function App() {
  const files = useFileStore((state) => state.files);

  const uploadFilesMutation = useUploadFiles();

  const [autoAnimateRef] = useAutoAnimate();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      uploadFilesMutation.mutate(
        acceptedFiles.map((item) => ({
          file: item,
          id: `${item.name}${item.size}`,
          uploadProgress: 0,
          uploadStatus: "idle",
        }))
      );
    },
    [uploadFilesMutation]
  );

  const {
    getRootProps,
    getInputProps,
  }: {
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  } = useDropzone({
    // accept: {
    //   "image/*": [],
    //   "video/*": [],
    // },
    onDrop,
    maxFiles: 15,
    maxSize: 10_000_000_000,
  });

  return (
    <Container sx={{ paddingY: 5 }}>
      <Typography variant="h4">Files and assets</Typography>
      <Typography sx={{ marginBottom: 3 }}>
        Documents and attachments that have been uploaded as part of this
        project.
      </Typography>
      <ButtonBase
        sx={{
          backgroundColor: "grey.100",
          paddingY: 5,
          width: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        {...getRootProps({ className: "dropzone" })}
      >
        <Box component="input" {...getInputProps()} />

        <CloudUploadTwoToneIcon />

        <Stack sx={{ alignItems: "center", gap: 1 }}>
          <Typography variant="h5">Select File</Typography>
          <Typography sx={{ color: "grey.700" }}>
            Click to upload or drag and drop
          </Typography>
          <Typography variant="caption">Maximum file size 2GB.</Typography>
        </Stack>
      </ButtonBase>
      <Stack sx={{ gap: 2, marginBottom: 6 }} ref={autoAnimateRef}>
        {files.map((file) => (
          <Stack key={file.id}>
            <PreviewCard {...file} />
          </Stack>
        ))}
      </Stack>
      <Typography variant="h5">Attached files</Typography>
      <Typography sx={{ marginBottom: 2 }} variant="body2">
        Files and assets that have been attached to this project
      </Typography>
      <FilesDataGrid />
    </Container>
  );
}

export { App };
