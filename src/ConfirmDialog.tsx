import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { ReactNode, useState } from "react";

type Props = {
  onConfirm: () => void;
  icon: ReactNode;
};
function ConfirmDialog(props: Props) {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Operation</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={props.onConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <IconButton onClick={handleOpen}>{props.icon}</IconButton>
    </>
  );
}

export { ConfirmDialog };
