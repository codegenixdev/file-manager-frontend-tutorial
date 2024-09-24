import { DeleteTwoTone } from "@mui/icons-material";
import { ConfirmDialog } from "./ConfirmDialog";
import { useDeleteFile } from "./services/mutations";

type Props = { id: string };
function QuickActions({ id }: Props) {
  const deleteFileMutation = useDeleteFile();

  function handleRemoveFile() {
    deleteFileMutation.mutate(id);
  }

  return (
    <ConfirmDialog
      onConfirm={handleRemoveFile}
      icon={<DeleteTwoTone color="error" />}
    />
  );
}

export { QuickActions };
