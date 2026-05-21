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

// import DialogAddUserInfo from './add-user-modal'
import { Autocomplete, Backdrop, CircularProgress, TextareaAutosize } from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useCreateLocal } from 'src/services/locals.service'
import { useCreateProperty } from 'src/services/properties.service'
import { useGetPropertyTypes, useGetUsages } from 'src/services/settings.service'
import { useCreateBloc, useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'

const CreateForm = ({ residence, residencesData, finished }) => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    entitled: '',
    description: '',
    d_project_id: residence?.id ? residence?.id : 0
  })

  const createBloc = useCreateBloc()

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    // await EventSchema.validate(values, { abortEarly: false })
    const formData = new FormData()
    for (const key in formInput) {
      formData.append(key, formInput[key])
    }

    try {
      const filesArray = sliceIntoChunks(files, 5)
      for (const array of filesArray) {
        for (const file of array) {
          formData.append('documents[]', file)
        }
      }
      const response = await createBloc?.mutateAsync(formData)
      setLoading(false)
      if (!residence?.id) {
        router.push('/properties')
      } else finished()
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
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
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
              name='entitled'
              onChange={handleChange}
              value={formInput.entitled}
              label='Intitulé'
              placeholder='Intitulé'
              size='small'
            />
          </FormControl>
        </Grid>
        {!residence?.id && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput(formData => {
                    return { ...formData, d_project_id: newValue?.id }
                  })
                }}
                options={residencesData || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='standard'
                    label='Résidence'
                    placeholder='Résidence'
                    error={!!formErrors?.data?.d_project_id}
                    helperText={renderArrayMultiline(formErrors?.data?.d_project_id)}
                  />
                )}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              error={!!formErrors?.errors?.description}
              helperText={renderArrayMultiline(formErrors?.errors?.description)}
              multiline
              name='description'
              placeholder='Description'
              maxRows={5}
              minRows={5}
              onChange={handleChange}
              label='Description'
              id='textarea-outlined-controlled'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
          <LoadingButton loadingPosition='end' loading={loading} onClick={handleSubmit} variant='contained'>
            Ajouter
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateForm

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
