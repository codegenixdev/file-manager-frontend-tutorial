import { ReactNode, useState } from "react";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Dialog as MuiDialog } from "@mui/material";
import {
  ConfirmContext,
  ConfirmOptions,
} from "@/shared/confirm/hooks/useConfirm";

type ConfirmProviderProps = {
  children: ReactNode;
};

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>();

  function confirm(optionsArg: ConfirmOptions) {
    return new Promise<void>(() => {
      setOptions(optionsArg);
      setOpen(true);
    });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleConfirm() {
    options?.handleConfirm();
    handleClose();
  }

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <MuiDialog
        disableRestoreFocus
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth="xs"
      >
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
}
