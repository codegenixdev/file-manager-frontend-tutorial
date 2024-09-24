type ExtendedFile = {
  file: File;
  id: string;
  uploadProgress: number;
  uploadStatus: "idle" | "pending" | "error" | "success";
};

type FileRow = {
  id: string;
  filename: string;
  size: number;
  dateUploaded: string;
};

export { type ExtendedFile, type FileRow };
