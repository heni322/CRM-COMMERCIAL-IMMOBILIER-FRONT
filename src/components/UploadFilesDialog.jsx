// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {
  frFR,
  DateTimePicker,
  DesktopDatePicker,
  LocalizationProvider,
  MobileDateTimePicker
} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// ** Third Party Imports
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import { useRouter } from 'next/navigation'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// import DialogAddUserInfo from './add-user-modal'
import moment from 'moment'
import { useGetUserGroups, useGetUsers } from 'src/services/users.service'
import FileUploaderMultiple from 'src/components/CustomFileUpload'
import { useAuth } from 'src/hooks/useAuth'
import { useGetGroups } from 'src/services/groups.service'
import { Autocomplete, Backdrop, CircularProgress, TextareaAutosize } from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useQueryClient } from '@tanstack/react-query'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useUploadDocuments } from 'src/services/residences.service'

const CustomInput = forwardRef(({ error, helperText, ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props
  console.log(error)

  return (
    <TextField
      error={error}
      helperText={helperText}
      sx={{ width: '100%' }}
      size='small'
      inputRef={ref}
      {...props}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

const UploadFilesDialog = ({ residence }) => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [open, setOpen] = useState(false)

  //Function to
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const auth = useAuth()
  const uploadFiles = useUploadDocuments()

  // const getClientsList = useGetUsers({ role: 'client' })
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
        await uploadFiles.mutateAsync({ values: formData, residenceId: residence?.id })
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

  return (
    <div>
      <IconButton color='secondary' size='large' onClick={handleClickOpen}>
        <Icon icon='material-symbols:upload' fontSize={20} />
      </IconButton>

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
            Charger les fichiers
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
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <LoadingButton loadingPosition='end' loading={fileUploading} onClick={handleSubmit} variant='contained'>
            Ajouter
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UploadFilesDialog

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
