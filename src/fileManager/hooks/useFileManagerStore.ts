import { ExtendedFile } from "@/fileManager/types/extendedFile";
import { create } from "zustand";

type FileState = {
  files: ExtendedFile[];
  selectedFileIds: string[];
};

type FileActions = {
  removeFile: (id: string) => void;
  appendFiles: (acceptedFiles: File[]) => void;
  updateUploadProgress: (id: string, uploadProgress: number) => void;
  updateUploadStatus: (
    id: string,
    uploadStatus: ExtendedFile["uploadStatus"]
  ) => void;
  updateSelectedFileIds: (ids: string[]) => void;
};

type FileSlice = FileState & FileActions;

export const useFileManagerStore = create<FileSlice>()((set) => ({
  files: [],
  selectedFileIds: [],
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),

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
  updateSelectedFileIds: (ids) =>
    set(() => ({
      selectedFileIds: ids,
    })),
}));
