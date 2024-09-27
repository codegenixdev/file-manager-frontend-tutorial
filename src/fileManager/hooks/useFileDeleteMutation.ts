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
