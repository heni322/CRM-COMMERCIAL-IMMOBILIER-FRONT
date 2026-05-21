// ** React Imports
import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { useAuth } from 'src/hooks/useAuth'

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import PDFViewer from './PDFViewer'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

import { useChangeStateFile, useGetFileStates, useGetFilePreview } from 'src/services/dossier.service'

const FileDialog = ({ file, fileURL, isOpen, open, onDialogStatusChange }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const auth = useAuth()

  const handleClose = () => {
    // setOpen(false)
    // onClose()
    onDialogStatusChange()
  }

  // Extract the file extension from the URL
  const fileExtension = file?.path?.match(/\.([^.]+)$/)?.[1]?.toLowerCase()

  // Check if the file extension is one of the document formats
  const isDocument = ['pdf'].includes(fileExtension)
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)

  return (
    <div>
      <Dialog
        onClose={handleClose}
        scroll='paper'
        aria-labelledby='customized-dialog-title'
        maxWidth={'md'}
        fullWidth={'md'}
        open={open}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' component='span'>
            {file?.name}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 4,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '650px'
          }}
        >
          <PDFViewer fileURL={file?.assets_file} fileName={file?.name} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FileDialog
