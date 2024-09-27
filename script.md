desc:
zustand video
react query video

first comment on video that do you want to implemnt using nextjs or??

---

intro:

In this tutorial, you'll learn how to build a file manager in React where users can drag and drop multiple files with smooth animations and real-time upload progress. These files will be uploaded in parallel to a Node.js server running on your localhost. If an upload is interrupted, the progress indicator will turn red.

Once uploaded, the files will be displayed in a paginated Data Grid fetched from the server. Users can sort by columns, manage, download, or perform bulk actions on multiple files.

We’ll primarily focus on state management throughout the app, including handling user input for file selection (with type and quantity validation), uploading files in parallel, updating progress, and managing data on the client with caching, mutation, and invalidation.

So, let’s dive in and get started!

---

If you want to follow along and save time, I've created a starter template for this project. It’s a simple React Vite setup with Material UI and a few other libraries to get us up and running quickly. You can find all the relevant gists and project links in the description below.

In this React project, we'll be using Material UI, React Query, Zustand, and React Dropzone.

```bash
git clone -b starting-template https://github.com/codegenixdev/file-manager-frontend-tutorial.git .
```

make sure at least using node 18 for best compatibility

```bash
npm i
```

open localhost on port 5173

show what things are installed (insist on dropzone)
review tsconfig.app.json (paths)
review vite.config.ts (paths)
review .env
vite-end.d.ts
inside src, we have app.tsx, main.tsx and shared folder where we put our shared and common components or utilieis here

main.tsx (show why things are wrapped inside what)
view confirm provider and insist on that this is the best to handle confirms in react and by wrapping your project inside it, you can use it every where in your application with ease where we get to it soon

App.tsx (our application will go inside this container)
utils, theme and a simple axios httpclient to use it app wide
topbar and theme toggle that we talked before.
BulkActions.tsx where when user select multiple uploaded files, this component will show up and use can do group opertions like delete multiple files which i have implmented this component and you can use it everywhere that you want

---

fileManager/components/FileManager.tsx

```tsx FileManager.tsx
export function FileManager() {
  return <>file manager</>;
}
```

import it in app.tsx

```tsx filemanager.tsx
export function FileManager() {
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
      >
        <FileUploadRoundedIcon fontSize="large" />

        <Stack sx={{ alignItems: "center", gap: 1 }}>
          <Typography>Click to upload or drag and drop</Typography>
          <Typography>Max 10GB.</Typography>
        </Stack>
      </ButtonBase>
    </>
  );
}
```

show

like and subscribe

```tsx filemanager.tsx
const { getRootProps, getInputProps } = useDropzone();
```

on button base

```tsx filemanager.tsx
{...getRootProps()}
```

below it

```tsx
<Box component="input" {...getInputProps()} />
```

show
thats perfect but how to keep track of what files user has dropped in the upload box or has selected and what to do with them

```tsx
function onDrop(acceptedFiles: File[]) {
  console.log(acceptedFiles);
}

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
});
```

show that is logs

```tsx
const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  // accept: {
  //   "image/*": [],
  //   "video/*": [],
  // },
  maxFiles: 15,
  maxSize: 10_000_000_000,
});
```

!! try to show some other funcaitonlaity like show error if wrong file or rejected files.

also there are so many other properties you can read the docs

now lets continue how to handle and what to do with selected files.
because we want to have access to selected files in many different components and do some operations on them, instead of creating a state here that keeps track of selected files, i prefer to use some state management solutions like react context or zustand. but for simplicity and because zustand is very simple and unopninated, i prefer it here. also i have a full course on it so you can check it out

```ts hooks/useFileManagerStore.ts
import { create } from "zustand";

type FileState = {
  files: ExtendedFile[];
};
```

```ts types/extendedFile
export type ExtendedFile = {
  file: File;
  id: string;
  uploadProgress: number;
  uploadStatus: "idle" | "pending" | "error" | "success";
};
```

```ts
import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { create } from "zustand";

type FileState = {
  files: ExtendedFile[];
};

type FileActions = {
  appendFiles: (acceptedFiles: File[]) => void;
};

type FileSlice = FileState & FileActions;

export const useFileManagerStore = create<FileSlice>()((set) => ({
  files: [],
  appendFiles: (acceptedFiles) =>
    set((state) => {
      const notDuplicatedNewFiles: ExtendedFile[] = acceptedFiles
        .filter((file) => {
          const isDuplicate = state.files.some(
            (subItem) => subItem.id === `${file.name}${file.size}`
          );
          return !isDuplicate;
        })
        .map((file) => ({
          file,
          id: `${file.name}${file.size}`,
          uploadStatus: "idle",
          uploadProgress: 0,
        }));

      return {
        files: [...state.files, ...notDuplicatedNewFiles],
      };
    }),
}));
```

```tsx
const appendFiles = useFileManagerStore((state) => state.appendFiles);
const files = useFileManagerStore((state) => state.files);

function onDrop(acceptedFiles: File[]) {
  appendFiles(acceptedFiles);
  console.log(acceptedFiles);
}
```

now show what we want to achieve in final project

```tsx before closing button base
<Stack sx={{ gap: 2, width: 1 }} ref={autoAnimateRef}>
  {files.map((file) => (
    <Stack key={file.id}>
      <UploadProgressCard {...file} />
    </Stack>
  ))}
</Stack>
```

```tsx UploadProgressCard
import { FileThumbnail } from "@/fileManager/components/FileThumbnail";
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { convertByteToMegabyte } from "@/shared/utils";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Card, CardHeader, IconButton, Typography } from "@mui/material";

import { Box, LinearProgress } from "@mui/material";
import { useCallback } from "react";

type Props = ExtendedFile;
export function UploadProgressCard({
  file,
  id,
  uploadStatus,
  uploadProgress,
}: Props) {
  const removeFile = useFileManagerStore((state) => state.removeFile);

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
          <IconButton onClick={handleRemove}>
            <CloseRoundedIcon />
          </IconButton>
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
```

```tsx FileThumbnail
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";

function getFileType(extension: string) {
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return "video";
    case "mp3":
    case "wav":
      return "audio";
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return "document";
    default:
      return "file";
  }
}

type FileThumbnailProps = Pick<File, "name">;

export function FileThumbnail({ name }: FileThumbnailProps) {
  const extension = name.split(".").pop()?.toLowerCase();
  const fileType = extension ? getFileType(extension) : "file";

  switch (fileType) {
    case "image":
      return <InsertPhotoRoundedIcon fontSize="large" color="primary" />;
    case "video":
      return <SmartDisplayRoundedIcon fontSize="large" color="primary" />;
    case "audio":
      return <AudioFileRoundedIcon fontSize="large" color="primary" />;
    case "document":
      return <DescriptionRoundedIcon fontSize="large" color="primary" />;
    default:
      return <InsertDriveFileRoundedIcon fontSize="large" color="primary" />;
  }
}
```

now import file upload progress in file manager

show it

now implement removeFile

```ts
  removeFile: (id: string) => void;

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
```

```tsx upload card
const removeFile = useFileManagerStore((state) => state.removeFile);
// in avatar
<IconButton onClick={handleRemove}>
  <CloseRoundedIcon />
</IconButton>;
```

show it that works
disable ripple in button base
to have better animation, we can use this amazing simple library

```tsx
const [autoAnimateRef] = useAutoAnimate();
<Stack sx={{ gap: 2, width: 1 }} ref={autoAnimateRef}>
  {files.map((file) => (
    <Stack key={file.id}>
      <UploadProgressCard {...file} />
    </Stack>
  ))}
</Stack>;
```

show animations

now we need to implement upload logic
we need a simple
i have created a nodejs express server that you can clone it like this

```bash
git clone https://github.com/codegenixdev/file-manager-backend-tutorial.git .
npm i
npm run dev
```

now it is running on localhost:3000 and uploaded files will be in the upload folder and we can use it in our project
show endpoints in postman

for simplicity i decided to use react query to communicate with our server and handle queries and mutations to our server in a more professional way. also i have a video on it. if are following along, the react query is installed (show package.json) and just make sure that in main.tsx the whole project is wrapped inside react query provider.

create useFileUploadMutation.ts

but before it, because we need to change the upload status and upload progress (show extendedFile) alot during the upload process so we need a way to manage these two properties more easily, so we can easily add two other actions to our store

```ts

  updateUploadProgress: (id: string, uploadProgress: number) => void;
  updateUploadStatus: (
    id: string,
    uploadStatus: ExtendedFile["uploadStatus"]
  ) => void;

  updateUploadProgress: (id, uploadProgress) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadProgress } : file
      ),
    })),

  updateUploadStatus: (id, uploadStatus) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadStatus } : file
      ),
    })),

```

```ts useFileUploadMutation.ts
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { httpClient } from "@/shared/httpClient";
import { useMutation } from "@tanstack/react-query";

export function useFileUploadMutation() {
  const updateUploadProgress = useFileManagerStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileManagerStore(
    (state) => state.updateUploadStatus
  );
  const appendFiles = useFileManagerStore((state) => state.appendFiles);

  return useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      const uploadPromises = files.map(async (file) => {
        if (file.uploadStatus === "idle") {
          updateUploadStatus(file.id, "pending");

          const formData = new FormData();
          formData.append("file", file.file);

          return httpClient
            .post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (event) => {
                if (event.lengthComputable && event.total) {
                  const percentComplete = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  updateUploadProgress(file.id, percentComplete);
                }
              },
            })
            .then(() => {
              updateUploadStatus(file.id, "success");
            })
            .catch(() => {
              updateUploadStatus(file.id, "error");
            });
        }
        return Promise.resolve();
      });

      await Promise.all(uploadPromises);
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => item.file));
    },
  });
}
```

to use it

```tsx
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
```

now upload a file and show the uploads folder (try a heavy file)

show it becomes red if upload becomes intruptted

but i want the file to be removed after a few seconds if uploaded

```tsx UploadProgressCard
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

```

show it

now we need to create a query to fetch files from server to show files in a data grid
show final project (upload something and show that data grid updates), show pagination and page size and sorting

```ts useFilesQuery.ts
import { GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";

import { GridSortModel } from "@mui/x-data-grid";
import { FileDataGridRow } from "@/fileManager/types/fileDataGridRow";
import { httpClient } from "@/shared/httpClient";

export function useFilesQuery({
  paginationModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
}) {
  return useQuery({
    queryKey: ["files", { paginationModel, sortModel }],
    queryFn: async () => {
      const sortField =
        sortModel.length > 0 ? sortModel[0].field : "dateUploaded";
      const sortOrder = sortModel.length > 0 ? sortModel[0].sort : "asc";

      type Response = {
        totalFilesCount: number;
        files: FileDataGridRow[];
      };

      const { data } = await httpClient.get<Response>(`/files`, {
        params: {
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          sortField,
          sortOrder,
        },
      });

      return data;
    },
  });
}
```

```ts fileDataGridRow
export type FileDataGridRow = {
  id: string;
  filename: string;
  size: number;
  dateUploaded: string;
};
```

```ts FilesDataGrid.tsx
import { Stack, Typography } from "@mui/material";

import { FileThumbnail } from "@/fileManager/components/FileThumbnail";
import { useFilesQuery } from "@/fileManager/hooks/useFilesQuery";
import { FileDataGridRow } from "@/fileManager/types/fileDataGridRow";
import { convertByteToMegabyte } from "@/shared/utils";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

const columns: GridColDef<FileDataGridRow>[] = [
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
        <Typography sx={{ fontWeight: 500 }} variant="body2">
          {row.filename}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "size",
    headerName: "Size",
    flex: 1,
    valueFormatter: (value) => convertByteToMegabyte(value),
  },
  {
    field: "dateUploaded",
    headerName: "Date Uploaded",
    flex: 1,
    valueFormatter: (value) => new Date(value).toDateString(),
  },
];

export function FilesDataGrid() {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "dateUploaded", sort: "desc" },
  ]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const filesQuery = useFilesQuery({ paginationModel, sortModel });
  const rowCountRef = useRef(filesQuery.data?.totalFilesCount || 0);

  const rowCount = useMemo(() => {
    if (filesQuery.data?.totalFilesCount !== undefined) {
      rowCountRef.current = filesQuery.data.totalFilesCount;
    }
    return rowCountRef.current;
  }, [filesQuery.data?.totalFilesCount]);

  return (
    <>
      <DataGrid
        sx={(theme) => ({ height: `calc(100dvh - ${theme.spacing(52)})` })}
        rows={filesQuery.data?.files}
        columns={columns}
        rowCount={rowCount}
        loading={filesQuery.isLoading}
        pageSizeOptions={[10, 25, 50, 100]}
        density="comfortable"
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
      />
    </>
  );
}
```

import it in filemanager below button base then show it (pagination works and sorting) but when upload something grid wont updated

```ts

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
```

now when upload, it revalidates

now show the final quick actions. we want to implement it

```ts useFileDeleteMutation
import { httpClient } from "@/shared/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFileDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileIds: string[]) => {
      await httpClient.delete(`files`, { data: { fileIds } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
```

```ts FileQuickActions.tsx
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import {
  Button,
  IconButton,
  Link,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useFileDeleteMutation } from "@/fileManager/hooks/useFileDeleteMutation";
import { FileDataGridRow } from "@/fileManager/types/fileDataGridRow";
import { useConfirm } from "@/shared/confirm/hooks/useConfirm";

type Props = FileDataGridRow;
export function FileQuickActions({ id, filename }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const confirm = useConfirm();

  const fileDeleteMutation = useFileDeleteMutation();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleRemoveFiles() {
    confirm({
      handleConfirm: () => {
        fileDeleteMutation.mutate([id]);
      },
    });
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertTwoToneIcon />
      </IconButton>
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
        <Stack sx={{ padding: 1 }}>
          <Link
            href={`${import.meta.env.VITE_API_URL}/files/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button startIcon={<DownloadRoundedIcon />}>
              <Typography variant="body2">{filename}</Typography>
            </Button>
          </Link>

          <Button
            startIcon={<DeleteForeverRoundedIcon />}
            onClick={handleRemoveFiles}
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
```

import it in data grid

```tsx
  {
    field: "action",
    sortable: false,
    pinnable: false,
    type: "actions",
    renderCell: ({ row }) => <FileQuickActions {...row} />,
  },
```

show it

show final project, we want select files then do some actions with them. so first of all we need to select files from our data grid then keep track of selected files specificalyy selected file ids

```ts

  selectedFileIds: string[];

  updateSelectedFileIds: (ids: string[]) => void;

  updateSelectedFileIds: (ids) =>
    set(() => ({
      selectedFileIds: ids,
    })),

```

```tsx datagrid
const confirm = useConfirm();
const fileDeleteMutation = useFileDeleteMutation();

const selectedFileIds = useFileManagerStore((state) => state.selectedFileIds);
const updateSelectedFileIds = useFileManagerStore(
  (state) => state.updateSelectedFileIds
);

function handleRemoveFiles() {
  confirm({
    handleConfirm: () => {
      fileDeleteMutation.mutate(selectedFileIds, {
        onSuccess: () => {
          updateSelectedFileIds([]);
        },
      });
    },
  });
}

function handleRowSelectionModelChange(ids: GridRowSelectionModel) {
  updateSelectedFileIds(ids.map((id) => id.toString()));
}

checkboxSelection;
onRowSelectionModelChange = { handleRowSelectionModelChange };
rowSelectionModel = { selectedFileIds };

<BulkActions
  actions={[
    {
      icon: <DeleteForeverRoundedIcon />,
      actionFn: handleRemoveFiles,
      label: "Delete files",
    },
  ]}
  ids={selectedFileIds}
/>;
```
