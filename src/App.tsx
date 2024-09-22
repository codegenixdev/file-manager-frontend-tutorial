import { useAutoAnimate } from "@formkit/auto-animate/react";

import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import { Box, ButtonBase, Container, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCallback } from "react";
import {
  DropzoneInputProps,
  DropzoneRootProps,
  useDropzone,
} from "react-dropzone";
import { QuickActions } from "./Actions";
import { FileThumbnail } from "./FileThumbnail";
import { convertByteToMegabyte } from "./lib/utils";
import { PreviewCard } from "./PreviewCard";
import { getFiles } from "./services/api";
import { useUploadFiles } from "./services/mutations";
import { useFiles } from "./services/queries";
import { useFileStore } from "./store/file-slice";

const dropZoneAccept = {
  "image/*": [],
  "video/*": [],
};

function App() {
  const files = useFileStore((state) => state.files);

  const filesQuery = useFiles();
  const uploadFilesMutation = useUploadFiles();

  const [autoAnimateRef] = useAutoAnimate();

  const columns: GridColDef<
    Awaited<ReturnType<typeof getFiles>>["files"][number]
  >[] = [
    {
      field: "filename",
      headerName: "File Name",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            height: 1,
          }}
        >
          <FileThumbnail name={row.filename} />
          <Stack>
            <Typography variant="body2">{row.filename}</Typography>

            <Typography variant="caption">
              {convertByteToMegabyte(row.size)}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: "dateUploaded",
      headerName: "Date Uploaded",
      flex: 1,
      valueFormatter: (value) => new Date(value).toDateString(),
    },
    {
      field: "action",
      sortable: false,
      pinnable: false,
      type: "actions",
      renderCell: ({ row }) => <QuickActions id={row.id} />,
    },
  ];

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
    accept: dropZoneAccept,
    onDrop,
    maxFiles: 10,
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
          backgroundColor: "background.default",
          borderRadius: 3,
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: "grey.100",
          padding: 2,
          width: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 3,
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
          <Typography variant="caption">Maximum file size 50MB.</Typography>
        </Stack>
      </ButtonBase>
      <Stack sx={{ gap: 2, marginBottom: 6 }} ref={autoAnimateRef}>
        {files.map((file) => (
          <Stack key={file.id}>
            <PreviewCard {...file} />
          </Stack>
        ))}
      </Stack>
      add server side pagination to datagriddddd
      <Typography variant="h5">Attached files</Typography>
      <Typography sx={{ marginBottom: 2 }} variant="body2">
        Files and assets that have been attached to this project
      </Typography>
      <Stack>
        <DataGrid rows={filesQuery.data?.files} columns={columns} />
      </Stack>
    </Container>
  );
}

export { App };
