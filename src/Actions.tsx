import { DeleteTwoTone } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useDeleteFile } from "./services/mutations";

type Props = { id: string };
function QuickActions({ id }: Props) {
  const deleteFileMutation = useDeleteFile();

  function handleRemoveFile() {
    deleteFileMutation.mutate(id);
  }

  return (
    <IconButton
      sx={{ textTransform: "none" }}
      size="small"
      onClick={handleRemoveFile}
      color="error"
    >
      <DeleteTwoTone />
    </IconButton>
  );
}

export { QuickActions };
