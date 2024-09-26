import { Stack, Typography } from "@mui/material";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { FileDataGridRow } from "@/fileManager/types/FileDataGridRow";
import { FileThumbnail } from "@/fileManager/components/FileThumbnail";
import { convertByteToMegabyte } from "@/lib/utils";
import { FileQuickActions } from "@/fileManager/components/FileQuickActions";
import { useConfirm } from "@/confirm/hooks/useConfirm";
import { useDeleteFilesMutation } from "@/fileManager/hooks/useDeleteFilesMutation";
import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { useFilesQuery } from "@/fileManager/hooks/useFilesQuery";
import { BulkActions } from "@/lib/components/BulkActions";

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
  {
    field: "action",
    sortable: false,
    pinnable: false,
    type: "actions",
    renderCell: ({ row }) => <FileQuickActions {...row} />,
  },
];

export function FilesDataGrid() {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "dateUploaded", sort: "desc" },
  ]);
  const confirm = useConfirm();

  const deleteFilesMutation = useDeleteFilesMutation();

  const selectedFileIds = useFileManagerStore((state) => state.selectedFileIds);
  const updateSelectedFileIds = useFileManagerStore(
    (state) => state.updateSelectedFileIds
  );

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

  function handleRemoveFiles() {
    confirm({
      handleConfirm: () => {
        deleteFilesMutation.mutate(selectedFileIds);
      },
    });
  }

  function handleRowSelectionModelChange(ids: GridRowSelectionModel) {
    updateSelectedFileIds(ids.map((id) => id.toString()));
  }

  return (
    <>
      <DataGrid
        sx={(theme) => ({ height: `calc(100dvh - ${theme.spacing(43)})` })}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={selectedFileIds}
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
      <BulkActions
        actions={[
          {
            icon: <DeleteForeverRoundedIcon />,
            actionFn: handleRemoveFiles,
            label: "Delete files",
          },
        ]}
        ids={selectedFileIds}
      />
    </>
  );
}
