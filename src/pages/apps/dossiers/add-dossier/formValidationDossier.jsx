// ** React Imports
import { forwardRef, useState } from 'react'

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

// ** Third Party Imports
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import { useRouter } from 'next/router'
import { Form, FormikProvider, useFormik } from 'formik'

import * as Yup from 'yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useCreateDossier, useGetAvailableIng } from 'src/services/dossier.service'
import DialogAddUserInfo from './add-user-modal'
import moment from 'moment'
import { useGetUsers } from 'src/services/users.service'
import FileUploaderMultiple from 'src/components/CustomFileUpload'
import { useAuth } from 'src/hooks/useAuth'
import { useGetGroups } from 'src/services/groups.service'
import { TextareaAutosize } from '@mui/material'
import styled from '@emotion/styled'

const getInitialValues = () => {
  const newEvent = {
    name: '',
    files: '',
    assigned_user: '',
    status: '',
    ref_audit: '',
    client: '',
    group: '',
    is_billed: '',
    is_payed: '',
    qte_received: '',
    progress: '',
    description: '',
    comments: '',
    path: '',
    expected_start_date: '',
    expected_due_date: ''
  }

  return newEvent
}

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
}

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f'
}

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

const FormValidationDossier = () => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  // const [uploadErrors, setUploadErrors] = useState(false)
  const auth = useAuth()
  const createDossier = useCreateDossier()
  const getUsersList = useGetUsers()
  const getClientsList = useGetUsers('client')
  const getGroupsList = useGetGroups()
  const [currentDate, setCurrentDate] = useState(moment())
  const getAvailableIng = useGetAvailableIng(currentDate)
  const router = useRouter()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleAddUser = () => {
    setSuspendDialogOpen(true)
  }

  const formik = useFormik({
    initialValues: getInitialValues(),

    // validationSchema: EventSchema,
    enableReinitialize: true, // Add this line to enable reinitialization

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // await EventSchema.validate(values, { abortEarly: false })
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('path', '')
      formData.append('start_date', '')
      formData.append('due_date', '')
      formData.append('ref_audit', values.ref_audit)
      for (let i = 0; i < files.length; i++) {
        formData.append(`files[${i}]`, files[i])
      }
      formData.append('expected_start_date', moment(values.expected_start_date).format('YYYY/MM/DD'))
      formData.append('expected_due_date', moment(values.expected_due_date).format('YYYY/MM/DD'))
      formData.append('client', values.client)
      formData.append('assigned_user', '')
      formData.append('status', '')
      formData.append('group', '')
      formData.append('is_billed', '')
      formData.append('is_payed', '')
      formData.append('qte_received', '')
      formData.append('progress', '')
      formData.append('description', '')
      formData.append('comments', '')
      try {
        await createDossier.mutateAsync(formData)
        resetForm()

        // onCancel()
        setSubmitting(false)
      } catch (error) {
        console.log(error)
        const errorsObject = error?.response?.data
        setFormErrors(errorsObject)
      }
    }
  })
  const [dateError, setDateError] = useState('')

  function renderArrayMultiline(arr = []) {
    if (!arr || !Array.isArray(arr)) {
      return
    }

    return arr?.map(e => {
      return (
        <>
          {e}
          <br />
        </>
      )
    })
  }

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, handleChange } = formik
  console.log(formErrors.errors)

  return (
    <Card>
      <CardHeader title='Dossier' />
      <CardContent>
        <FormikProvider value={formik}>
          <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    error={!!formErrors?.errors?.name}
                    helperText={renderArrayMultiline(formErrors?.errors?.name)}
                    {...getFieldProps('name')}
                    label='Nom du dossier'
                    placeholder='Nom du dossier'
                    aria-describedby='validation-basic-name'
                    size='small'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel size='small' id='validation-basic-client' htmlFor='validation-basic-client'>
                    Clients
                  </InputLabel>
                  <Select
                    error={!!formErrors?.errors?.client}
                    helperText={renderArrayMultiline(formErrors?.errors?.client)}
                    {...getFieldProps('client')}
                    value={values.client}
                    size='small'
                    onChange={handleChange}
                    label='client'
                    labelId='validation-basic-client'
                    aria-describedby='validation-basic-client'
                  >
                    {getClientsList.isSuccess ? (
                      getClientsList.data.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value=''>Loading...</MenuItem>
                    )}
                  </Select>
                  {!!formErrors?.errors?.client && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-client'>
                      {formErrors?.errors?.client}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerWrapper sx={{ width: '100%' }}>
                  <DatePicker
                    selected={values.expected_start_date}
                    required
                    onChange={date => setFieldValue('expected_start_date', date)}
                    customInput={
                      <CustomInput
                        error={!!formErrors?.errors?.expected_start_date}
                        helperText={renderArrayMultiline(formErrors?.errors?.expected_start_date)}
                      />
                    }
                    placeholderText='expected date debut'
                    aria-describedby='stepper-linear-date-date-os'
                  />
                </DatePickerWrapper>
                {errors.expected_start_date && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-date-date-os'>
                    {formErrors?.errors?.expected_start_date}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerWrapper sx={{ width: '100%' }}>
                  <DatePicker
                    selected={values.expected_due_date}
                    required
                    onChange={date => setFieldValue('expected_due_date', date)}
                    customInput={
                      <CustomInput
                        error={!!formErrors?.errors?.expected_due_date}
                        helperText={renderArrayMultiline(formErrors?.errors?.expected_due_date)}
                      />
                    }
                    aria-describedby='stepper-linear-date-date-os'
                  />
                </DatePickerWrapper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel size='small' id='validation-basic-assigned_user' htmlFor='validation-basic-assigned_user'>
                    Ingenieurs
                  </InputLabel>
                  <Select
                    error={!!formErrors?.errors?.assigned_user}
                    helperText={renderArrayMultiline(formErrors?.errors?.assigned_user)}
                    {...getFieldProps('assigned_user')}
                    value={values.assigned_user}
                    size='small'
                    onChange={handleChange}
                    label='Ingenieur'
                    labelId='validation-basic-assigned_user'
                    aria-describedby='validation-basic-assigned_user'
                  >
                    {getAvailableIng.isSuccess ? (
                      getAvailableIng.data.data.availaibleEngineers.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value=''>Loading...</MenuItem>
                    )}
                  </Select>
                  {!!formErrors?.errors?.assigned_user && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      Le champs Igenieur est requis
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {/* {id && id.id && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      id='validation-basic-assigned_user'
                      error={Boolean(errors.assigned_user)}
                      htmlFor='validation-basic-assigned_user'
                    >
                      Statut
                    </InputLabel>
                    <Select
                      {...getFieldProps('status')}
                      value={values.status}
                      size='small'
                      onChange={handleChange}
                      label='Statut'
                      error={Boolean(errors.status)}
                      labelId='validation-basic-status'
                      aria-describedby='validation-basic-status'
                    >
                      {getUsersList.isSuccess ? (
                        getUsersList.data.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value=''>Loading...</MenuItem>
                      )}
                    </Select>
                    {errors.select && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )} */}

              {auth.user.role === 'admin' && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel
                      size='small'
                      id='validation-basic-group'
                      error={Boolean(errors.group)}
                      htmlFor='validation-basic-group'
                    >
                      Groupes
                    </InputLabel>
                    <Select
                      error={!!formErrors?.errors?.group}
                      helperText={renderArrayMultiline(formErrors?.errors?.group)}
                      {...getFieldProps('group')}
                      value={values.group}
                      size='small'
                      onChange={handleChange}
                      label='Groupes'
                      labelId='validation-basic-group'
                      aria-describedby='validation-basic-group'
                    >
                      {getGroupsList.isSuccess ? (
                        getGroupsList.data.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.entitled}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value=''>Loading...</MenuItem>
                      )}
                    </Select>
                    {!!formErrors?.errors?.group && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                        This field is required
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    error={!!formErrors?.errors?.ref_audit}
                    helperText={renderArrayMultiline(formErrors?.errors?.ref_audit)}
                    size='small'
                    {...getFieldProps('ref_audit')}
                    type='text'
                    label='Reference Auditeur'
                    placeholder='Reference Auditeur'
                    aria-describedby='validation-basic-ref_audit'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <TextField
                    error={!!formErrors?.errors?.description}
                    helperText={renderArrayMultiline(formErrors?.errors?.description)}
                    multiline
                    {...getFieldProps('description')}
                    placeholder='description'
                    maxRows={5}
                    minRows={5}
                    label='description'
                    id='textarea-outlined-controlled'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FileUploaderMultiple files={files} setFiles={setFiles} error={formErrors} />
              </Grid>
              <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
                <Button size='large' variant='contained' type='submit'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
        <DialogAddUserInfo open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
      </CardContent>
    </Card>
  )
}

export default FormValidationDossier
