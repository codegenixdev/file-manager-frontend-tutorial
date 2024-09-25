import { useAutoAnimate } from "@formkit/auto-animate/react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

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
import { useConfirm } from "./confirm/hooks/useContext";

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

  const confirm = useConfirm();

  return (
    <Container sx={{ paddingY: 5 }}>
      <button
        onClick={() =>
          confirm({ handleClose: () => {}, handleConfirm: () => {} })
        }
      >
        copy and paste use confirm from niku app asjdiasjdij
      </button>

      <Typography variant="h4">Files and assets</Typography>
      <Typography sx={{ marginBottom: 3, color: "grey.700" }}>
        Documents and attachments that have been uploaded as part of this
        project.
      </Typography>
      <ButtonBase
        sx={(theme) => ({
          backgroundColor: "grey.100",
          padding: 2,
          width: 1,
          borderRadius: `${theme.shape.borderRadius}px`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 3,
        })}
        disableRipple
        {...getRootProps({ className: "dropzone" })}
      >
        <Box component="input" {...getInputProps()} />

        <FileUploadRoundedIcon sx={{ color: "grey.700" }} fontSize="large" />

        <Stack sx={{ alignItems: "center", gap: 1, color: "grey.700" }}>
          <Typography>Click to upload or drag and drop</Typography>
          <Typography>Max 10GB.</Typography>
        </Stack>
        <Stack sx={{ gap: 2, width: 1 }} ref={autoAnimateRef}>
          {files.map((file) => (
            <Stack key={file.id}>
              <PreviewCard {...file} />
            </Stack>
          ))}
        </Stack>
      </ButtonBase>
      <FilesDataGrid />
    </Container>
  );
}

export { App };
