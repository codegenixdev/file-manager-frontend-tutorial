import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

type Props = {
  onConfirm: () => void;
  buttonProps: Omit<ButtonProps, "onClick">;
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
      <Button onClick={handleOpen} {...props.buttonProps} />
    </>
  );
}

export { ConfirmDialog };
