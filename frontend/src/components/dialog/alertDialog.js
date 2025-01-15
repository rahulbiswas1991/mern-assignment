import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ openDialog, id, onClose }) {
  const [open, setOpen] = React.useState(false);

  // Sync `open` state with `openDialog` prop
  React.useEffect(() => {
    setOpen(openDialog);
  }, [openDialog]);

  const handleClose = (confirmed) => {
    if (onClose) {
      onClose(confirmed); // Pass `true` for delete, `false` for cancel
    }
    setOpen(false); // Ensure the dialog closes
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)} // Close when clicked outside or via escape
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the user with ID: <strong>{id}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleClose(true)} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
