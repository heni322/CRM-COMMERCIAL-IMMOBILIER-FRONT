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

// ** Icon Imports
import { useRouter } from 'next/navigation'
import { Form, FormikProvider, useFormik } from 'formik'

import * as Yup from 'yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useUploadFiles } from 'src/services/dossier.service'
import DatePicker from 'react-datepicker'

// import DialogAddUserInfo from './add-user-modal'
import { useAuth } from 'src/hooks/useAuth'
import { useGetGroupUsers, useGetGroups } from 'src/services/groups.service'
import { Autocomplete, Backdrop, Box, CircularProgress, Divider, TextareaAutosize, Typography } from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useUpdateResidence } from 'src/services/residences.service'
import CurrencyInput from 'src/components/CurrencyInput'

const UpdateForm = ({ residenceData }) => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const updateResidence = useUpdateResidence()
  const uploadFiles = useUploadFiles()

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formInput, setFormInput] = useState({
    entitled: '',
    floors_number: 0,
    city: '',
    zip_code: 0,
    address: '',
    tf_number: ''
  })

  useEffect(() => {
    setFormInput(formInput => {
      return { ...formInput, ...residenceData }
    })
  }, [residenceData])

  const handleSubmit = async () => {
    setLoading(true)

    const formData = new FormData()
    for (const key in formInput) {
      formData.append(key, formInput[key])
    }

    try {
      // const filesArray = sliceIntoChunks(files, 5)

      // //  for (const array of filesArray) {
      // //    for (const file of array) {
      // //      formData.append('documents[]', file)
      // //    }
      // //  }
      // for (let i = 0; i < filesArray.length; i++) {
      //   const array = [...filesArray[i]]
      //   for (let index = 0; index < array.length; index++) {
      //     formData.append(`documents[${index}]`, array[index])
      //   }
      // }
      const updatedFormInput = { ...formInput }
      delete updatedFormInput.state
      const response = await updateResidence?.mutateAsync({ id: residenceData?.id, values: updatedFormInput })
      setLoading(false)
      router.push('/residences/' + residenceData?.id + '/details')
    } catch (error) {
      const errorsObject = error?.response?.data

      setFormErrors(errorsObject)
      setLoading(false)
    }
  }

  const handleFilesChange = files => {
    // /* removed */;
    // Update chosen files
    setFiles([...files])
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormInput({
      ...formInput,
      [name]: value
    })
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  const propertyTypes = ['Appartement', 'Maison', 'Garage', 'Autre']

  const handleTypeChange = (event, newValue) => {
    setFormInput({
      ...formInput,
      type: newValue
    })
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              variant='standard'
              error={!!formErrors?.errors?.entitled}
              helperText={renderArrayMultiline(formErrors?.errors?.entitled)}
              name='entitled'
              onChange={handleChange}
              value={formInput?.entitled}
              label='Intitulé'
              placeholder='Intitulé'
              aria-describedby='validation-basic-name'
              size='small'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              type='number'
              variant='standard'
              error={!!formErrors?.errors?.floors_number}
              helperText={renderArrayMultiline(formErrors?.errors?.floors_number)}
              name='floors_number'
              onChange={handleChange}
              label='Nombre détages'
              value={formInput?.floors_number}
              placeholder='Nombre détages'
              aria-describedby='validation-basic-name'
              size='small'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.tf_number}
              helperText={renderArrayMultiline(formErrors?.errors?.tf_number)}
              name='tf_number'
              onChange={handleChange}
              label='Numéro de titre foncier'
              placeholder='Numéro de titre foncier'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.tf_number}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>Adresse</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.address}
              helperText={renderArrayMultiline(formErrors?.errors?.address)}
              name='address'
              onChange={handleChange}
              label='Adresse'
              placeholder='Adresse'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.address}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.city}
              helperText={renderArrayMultiline(formErrors?.errors?.city)}
              name='city'
              onChange={handleChange}
              label='Ville'
              placeholder='Ville'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.city}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <TextField
              required
              type='number'
              variant='standard'
              error={!!formErrors?.errors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.errors?.zip_code)}
              name='zip_code'
              onChange={handleChange}
              label='Code Postale'
              placeholder='Code Postale'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.zip_code}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              error={!!formErrors?.errors?.comments}
              helperText={renderArrayMultiline(formErrors?.errors?.comments)}
              multiline
              name='description'
              placeholder='Description'
              maxRows={5}
              minRows={5}
              onChange={handleChange}
              value={formInput?.description}
              label='Description'
              id='textarea-outlined-controlled'
            />
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={12}>
          <CustomFileUpload
            fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx']}
            multiple={true}
            name='PDF'
            error={!!formErrors?.errors?.documents}
            helperText={renderArrayMultiline(formErrors?.errors?.documents)}
            handleFilesChange={handleFilesChange}
            onFileDelete={onFileDelete}
            files={files}
            endpoint=''
          />
        </Grid> */}
        <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
          <LoadingButton loadingPosition='end' loading={loading} onClick={handleSubmit} variant='contained'>
            Modifier
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  )
}

export default UpdateForm

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
