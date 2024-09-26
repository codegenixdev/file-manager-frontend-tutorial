import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { httpClient } from "@/lib/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFilesMutation() {
  const queryClient = useQueryClient();
  const updateSelectedFileIds = useFileManagerStore(
    (state) => state.updateSelectedFileIds
  );

  return useMutation({
    mutationFn: async (fileIds: string[]) => {
      await httpClient.delete(`files`, { data: { fileIds } });
    },
    onSuccess: async () => {
      updateSelectedFileIds([]);
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
