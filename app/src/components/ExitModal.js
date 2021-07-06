import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Typography
} from "@material-ui/core";

import locale from "../locales/main";

export default function ExitModal({ open, setOpen, handleExit }) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {locale.close_dialog}
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          {locale.no}
        </Button>
        <Button onClick={handleExit} color="primary">
          {locale.yes}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
