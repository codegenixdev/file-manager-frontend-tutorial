import { httpClient } from "../lib/httpClient";

async function getFiles() {
  type Response = {
    id: string;
    filename: string;
    size: number;
    dateUploaded: string;
  }[];

  const { data } = await httpClient.get<Response>("/files");
  return data;
}

async function deleteFile(fileId: string) {
  await httpClient.delete(`files/${fileId}`);
}

export { deleteFile, getFiles };
