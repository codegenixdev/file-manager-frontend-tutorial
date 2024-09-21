import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFileStore } from "../store/file-slice";
import { deleteFile } from "./api";
import { ExtendedFile } from "../lib/types";

function useUploadFiles() {
  const removeFile = useFileStore((state) => state.removeFile);
  const updateUploadProgress = useFileStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileStore((state) => state.updateUploadStatus);
  const appendFiles = useFileStore((state) => state.appendFiles);

  return useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      files.forEach((file) => {
        if (file.uploadStatus === "idle") {
          updateUploadStatus(file.id, "pending");
          const xhr = new XMLHttpRequest();
          const formData = new FormData();

          formData.append("file", file.file);

          xhr.open("POST", "http://localhost:3000/upload");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              updateUploadProgress(file.id, percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              removeFile(file.id);
            } else {
              updateUploadStatus(file.id, "error");
            }
          };

          xhr.onerror = () => {
            updateUploadStatus(file.id, "error");
          };

          xhr.send(formData);
        }
      });
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => item.file));
    },
  });
}

function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

export { useDeleteFile, useUploadFiles };
