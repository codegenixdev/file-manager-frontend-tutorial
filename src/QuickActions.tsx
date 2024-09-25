import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import {
  Button,
  IconButton,
  Link,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useDeleteFiles } from "./services/mutations";
import { FileRow } from "./lib/types";

type Props = FileRow;
function QuickActions({ id, filename }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const deleteFilesMutation = useDeleteFiles();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleRemoveFiles() {
    deleteFilesMutation.mutate([id]);
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertTwoToneIcon />
      </IconButton>
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
        <Stack sx={{ padding: 1 }}>
          <Link
            href={`${import.meta.env.VITE_API_URL}/files/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button startIcon={<DownloadRoundedIcon />}>
              <Typography variant="body2">{filename}</Typography>
            </Button>
          </Link>

          <ConfirmDialog
            onConfirm={handleRemoveFiles}
            buttonProps={{
              color: "error",
              children: "Delete",
              startIcon: <DeleteForeverRoundedIcon />,
            }}
          />
        </Stack>
      </Popover>
    </>
  );
}

export { QuickActions };
