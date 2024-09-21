import { useQuery } from "@tanstack/react-query";
import { getFiles } from "./api";

function useFiles() {
  return useQuery({
    queryKey: ["files"],
    queryFn: getFiles,
  });
}

export { useFiles };
