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
            .post("http://localhost:3000/upload", formData, {
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
        return Promise.resolve(); // For files that are not idle, return a resolved promise
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => item.file));
    },
    onSuccess: async () => {
      console.log("dsjfisjfdisjif");
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      await httpClient.delete(`files/${fileId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export { useDeleteFile, useUploadFiles };
