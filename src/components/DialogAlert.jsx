// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { LoadingButton } from '@mui/lab'

const DialogAlert = ({
  color = 'error',
  open,
  setOpen,
  handleAction,
  title,
  description,
  acceptButtonTitle,
  declineButtonTitle,
  isLoading = false
}) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{description}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <LoadingButton loading={isLoading} onClick={() => handleAction(false)}>
            {declineButtonTitle}
          </LoadingButton>
          <LoadingButton loading={isLoading} color={color} onClick={() => handleAction(true)}>
            {acceptButtonTitle}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogAlert
