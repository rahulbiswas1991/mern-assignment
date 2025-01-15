import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

export default function AutohideSnackbar({isError, message}) {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, seterrorMessage] = React.useState("");

  const handleClick = () => {
    setOpen(true);
  };
  React.useEffect(()=>{
    if(isError){
        setOpen(true);
        seterrorMessage(message);
    }
  },[isError,message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
    </div>
  );
}
