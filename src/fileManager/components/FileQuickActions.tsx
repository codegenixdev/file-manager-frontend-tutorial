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
import { useFileDeleteMutation } from "@/fileManager/hooks/useFileDeleteMutation";
import { FileDataGridRow } from "@/fileManager/types/fileDataGridRow";
import { useConfirm } from "@/shared/confirm/hooks/useConfirm";

type Props = FileDataGridRow;
export function FileQuickActions({ id, filename }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const confirm = useConfirm();

  const fileDeleteMutation = useFileDeleteMutation();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleRemoveFiles() {
    confirm({
      handleConfirm: () => {
        fileDeleteMutation.mutate([id]);
      },
    });
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

          <Button
            startIcon={<DeleteForeverRoundedIcon />}
            onClick={handleRemoveFiles}
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
