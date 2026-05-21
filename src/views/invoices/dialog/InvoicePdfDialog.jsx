import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'
import { Card, CardContent } from '@mui/material'

const InvoicePdfDialog = ({ setOpen, open, reference, invoiceId }) => {
  // ** State
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Dialog maxWidth={1200} onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h6' component='span'>
            Facturesd - {reference}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <iframe
            title='document rapport'
            src={`${process.env.REACT_APP_BASE_URL}/invoices/${invoiceId}/pdf`}
            height='850px'
            style={{
              width: 1200,
              borderRadius: 10,
              borderColor: '#90caf975',
              boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
              border: '0px solid'
            }}
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InvoicePdfDialog
