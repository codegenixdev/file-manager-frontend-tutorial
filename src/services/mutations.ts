import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../lib/httpClient";
import { ExtendedFile } from "../lib/types";
import { useFileStore } from "../store/useFileStore";

function useUploadFiles() {
  const updateUploadProgress = useFileStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileStore((state) => state.updateUploadStatus);
  const appendFiles = useFileStore((state) => state.appendFiles);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      const uploadPromises = files.map((file) => {
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
              // updateUploadStatus(file.id, "success");
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

function useDeleteFiles() {
  const queryClient = useQueryClient();
  const updateSelectedFileIds = useFileStore(
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

export { useDeleteFiles, useUploadFiles };
