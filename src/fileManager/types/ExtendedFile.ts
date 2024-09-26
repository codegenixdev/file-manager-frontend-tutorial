export type ExtendedFile = {
  file: File;
  id: string;
  uploadProgress: number;
  uploadStatus: "idle" | "pending" | "error" | "success";
};
