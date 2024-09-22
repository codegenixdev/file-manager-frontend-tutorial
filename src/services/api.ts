import { httpClient } from "../lib/httpClient";
import { FileRow } from "../lib/types";

async function getFiles() {
  type Response = {
    totalFiles: number;
    files: FileRow[];
  };

  const { data } = await httpClient.get<Response>("/files");
  return data;
}

async function deleteFile(fileId: string) {
  await httpClient.delete(`files/${fileId}`);
}

export { deleteFile, getFiles };
