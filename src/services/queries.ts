import { GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";

import { GridSortModel } from "@mui/x-data-grid";
import { httpClient } from "../lib/httpClient";
import { FileRow } from "../lib/types";

function useFiles({
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
        files: FileRow[];
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

export { useFiles };
