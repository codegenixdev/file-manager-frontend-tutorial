import { useFileManagerStore } from "@/fileManager/hooks/useFileManagerStore";
import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { httpClient } from "@/shared/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFileUploadMutation() {
  const updateUploadProgress = useFileManagerStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileManagerStore(
    (state) => state.updateUploadStatus
  );
  const appendFiles = useFileManagerStore((state) => state.appendFiles);

  const queryClient = useQueryClient();

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}
