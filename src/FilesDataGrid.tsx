import { Link, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { QuickActions } from "./Actions";
import { FileThumbnail } from "./FileThumbnail";
import { convertByteToMegabyte } from "./lib/utils";
import { useFiles } from "./services/queries";
import { FileRow } from "./lib/types";

const columns: GridColDef<FileRow>[] = [
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
        <Link
          href={`http://localhost:3000/files/${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="body2">{row.filename}</Typography>
        </Link>
      </Stack>
    ),
  },
  {
    field: "size",
    headerName: "size",
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
    renderCell: ({ row }) => <QuickActions id={row.id} />,
  },
];

function FilesDataGrid() {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "dateUploaded", sort: "desc" },
  ]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filesQuery = useFiles({ paginationModel, sortModel });
  const rowCountRef = useRef(filesQuery.data?.totalFilesCount || 0);

  const rowCount = useMemo(() => {
    if (filesQuery.data?.totalFilesCount !== undefined) {
      rowCountRef.current = filesQuery.data.totalFilesCount;
    }
    return rowCountRef.current;
  }, [filesQuery.data?.totalFilesCount]);

  return (
    <DataGrid
      sx={{ height: 500 }}
      rows={filesQuery.data?.files}
      columns={columns}
      rowCount={rowCount}
      loading={filesQuery.isLoading}
      pageSizeOptions={[5, 10, 25]}
      paginationModel={paginationModel}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
    />
  );
}

export { FilesDataGrid };
