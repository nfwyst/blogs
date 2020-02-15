import React, { MouseEventHandler } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Confirm(
  props: {
    isOpen: boolean,
    onOk: MouseEventHandler<HTMLElement>,
    onCancel: MouseEventHandler<HTMLElement>,
    message: string
  }
) {
  const { isOpen, onOk, onCancel, message } = props
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            取消
          </Button>
          <Button onClick={onOk} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
