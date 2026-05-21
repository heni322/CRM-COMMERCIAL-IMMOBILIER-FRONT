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
import { Form, FormikProvider, useFormik } from 'formik'

import * as Yup from 'yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useUploadReport, useUploadReportVersion } from 'src/services/dossier.service'

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

const UploadReport = ({ folder, report, reportType }) => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [open, setOpen] = useState(false)

  //Function to
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [groupId, setGroupId] = useState('')

  const auth = useAuth()
  const uploadReport = useUploadReport()
  const uploadReportVersion = useUploadReportVersion(report?.id)

  // const getClientsList = useGetUsers({ role: 'client' })
  const getClientsList = useGetUserGroups()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [fileUploading, setFileUploading] = useState(false)

  const handleSubmit = async () => {
    setFileUploading(true)
    try {
      const formData = new FormData()
      formData.append(`path`, files[0])
      formData.append(`name`, files[0]?.name)
      formData.append(`description`, description)

      if (reportType === 'reportVersion') {
        await uploadReportVersion.mutateAsync({ values: formData, reportId: report?.id })
      } else if (reportType === 'report') {
        await uploadReport.mutateAsync({ values: formData, folderId: folder?.id })
      }
      setFiles([])
      handleClose()
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

  const [description, setDescription] = useState('')

  const handleChange = e => {
    setDescription(e.target.value)
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
          <div className='flex flex-col'>
            <div className='flex flex-row gap-4 my-4 text-center'>
              <div className='self-center '>Description :</div>
              <div>
                <TextField
                  autoFocus
                  label='Ajouter une description'
                  value={description}
                  onChange={handleChange}
                  placeholder={description}
                />
              </div>
            </div>
            <div>
              <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color='inherit' />
              </Backdrop>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <CustomFileUpload
                    fileTypes={['pdf', 'doc', 'docx']}
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
            </div>
          </div>
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

export default UploadReport

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
