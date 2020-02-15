import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props: {
  type: Color, duration?: number, onClose?: Function, message: string, isOpen: boolean
}) {
  const { type, duration, onClose, message, isOpen } = props
  const classes = useStyles();
  const theme = useTheme();
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    if (onClose) onClose()
  };
  return (
    <div
      className={classes.root}
      style={{
        width: '100%',
        marginTop: theme.spacing(2),
      }}
    >
      <Snackbar
        open={isOpen}
        autoHideDuration={duration || 6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
