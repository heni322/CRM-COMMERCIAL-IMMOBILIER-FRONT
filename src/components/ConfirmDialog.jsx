// ** React Imports
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  CircularProgress,
  Backdrop
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

import {
  useChangeStateFile,
  useGetFileStates,
  useGetFilePreview,
  useCreateDossierComment,
  useUploadFiles
} from 'src/services/dossier.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from './CustomFileUpload'

const ConfirmDialog = ({ folder, open, status, onClose, onDialogStatusChange, onSubmit }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const auth = useAuth()

  const [comment, setComment] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [radioValue, setRadioValue] = useState('')

  // console.log(getFilePreviewQuery?.data)

  const createDossierCommentMutation = useCreateDossierComment(folder?.id)
  const uploadFiles = useUploadFiles()

  //Function

  const handleClose = () => {
    setRadioValue(null)
    setComment(null)
    onDialogStatusChange()
  }

  const handleChangeRadio = event => {
    setRadioValue(event.target.value)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setComment(comment + '\n') // Append a new line character
    }
  }

  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [fileUploading, setFileUploading] = useState(false)

  const handleSubmit = async () => {
    setFileUploading(true)
    try {
      const filesArray = sliceIntoChunks(files, 5)
      for (let i = 0; i < filesArray.length; i++) {
        const formData = new FormData()
        const array = [...filesArray[i]]
        for (let index = 0; index < array.length; index++) {
          formData.append(`files[${index}]`, array[index])
        }
        await uploadFiles.mutateAsync({ values: formData, file_comment: comment, folderId: folder.id })
        handleClose()
      }
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
      setLoading(false)
    }
    setFileUploading(false)
  }

  const handleFilesChange = files => {
    // console.log(files);
    // Update chosen files
    setFiles([...files])
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  const saveStatus = async () => {
    try {
      // Send the comment to the server
      await createDossierCommentMutation?.mutateAsync({
        values: {
          comment: comment,
          d_folder_id: folder.id
        }
      })
      if (status?.entitled == 'à modifier') {
        onSubmit(radioValue)
        handleSubmit()
      }

      // else if (status?.entitled == 'Incomplet') onSubmit('Incomplet')
      // else onSubmit('Incomplet')
    } catch (error) {
      setFormErrors(error.response.data)
    }
  }

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
            {status?.entitled}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <div className='flex flex-col w-full gap-2 mt-4'>
            <div className='flex flex-row w-full'>
              <div className='w-[30%] mb-6'>Choisir :</div>
              <RadioGroup
                row
                className='w-[50%]'
                value={radioValue}
                name='simple-radio'
                onChange={handleChangeRadio}
                aria-label='simple-radio'
              >
                <FormControlLabel value='1' control={<Radio />} label='Faute Interne' />
                <FormControlLabel value='2' control={<Radio />} label='Faute client' />
              </RadioGroup>
            </div>

            <div className='w-full'>
              <div className='mb-4'>Ajouter une explication :</div>
              <TextField
                multiline
                placeholder='Ajouter un commentaire'
                label='Commentaire'
                fullWidth
                rowsMax={4} // Set the maximum number of rows based on your design
                error={!!formErrors?.errors?.comment}
                helperText={renderArrayMultiline(formErrors?.errors?.comment)}
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className='w-full mt-4'>
              <div className='mb-4'>Ajouter un fichier (optionel) :</div>
              <>
                <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
                  <CircularProgress color='inherit' />
                </Backdrop>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={12}>
                    <CustomFileUpload
                      fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'xlsx']}
                      multiple={true}
                      name='PDF'
                      handleFilesChange={handleFilesChange}
                      onFileDelete={onFileDelete}
                      files={files}
                      endpoint=''
                      error={formErrors}
                    />
                  </Grid>
                </Grid>
              </>
            </div>
            <div className='flex align-bottom '></div>
          </div>
        </DialogContent>
        <DialogActions>
          {auth.user.role == 'team_lead' || auth.user.role == 'engineer' || auth.user.role == 'admin' ? (
            <div className=''>
              <div className='flex flex-row items-end self-end p-4'>
                <LoadingButton
                  loadingPosition='start'
                  style={{ marginLeft: '20px', padding: '12px' }}
                  startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                  color={'secondary'}
                  variant='contained'
                  onClick={() => {
                    saveStatus()
                  }}
                >
                  {'Sauvegarder'}
                </LoadingButton>
              </div>
            </div>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmDialog

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
