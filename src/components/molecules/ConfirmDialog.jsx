import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '../atoms/Button';

/** MUI Dialog gives us focus trapping, Esc-to-close and aria-modal for free. */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', loading = false, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} aria-labelledby="confirm-title" aria-describedby="confirm-message" fullWidth maxWidth="xs">
      <DialogTitle id="confirm-title" sx={{ fontWeight: 800 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-message">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
