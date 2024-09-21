import { LoadingButton } from "@mui/lab";
import { useDeleteFile } from "./services/mutations";

type Props = { id: string };
function QuickActions({ id }: Props) {
  const deleteFileMutation = useDeleteFile();

  function handleRemoveFile() {
    deleteFileMutation.mutate(id);
  }

  return (
    <LoadingButton
      onClick={handleRemoveFile}
      color="error"
      variant="outlined"
      loading={deleteFileMutation.isPending}
    >
      Delete
    </LoadingButton>
  );
}

export { QuickActions };
