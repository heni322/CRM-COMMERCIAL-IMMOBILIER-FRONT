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
import { useCreateDossier, useGetAvailableIng, useGetDateFinPrevu } from 'src/services/dossier.service'

// import DialogAddUserInfo from './add-user-modal'
import moment from 'moment'
import { useGetUsers } from 'src/services/users.service'
import FileUploaderMultiple from 'src/components/CustomFileUpload'
import { useAuth } from 'src/hooks/useAuth'
import { useGetGroups } from 'src/services/groups.service'
import { TextareaAutosize, Typography } from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { useCreateCompany } from 'src/services/companies.service'

const getInitialValues = () => {
  const newEvent = {
    entitled: '',
    adress: '',
    city: '',
    zip_code: '',
    immatriculation: '',
    siret_number: '',
    email: '',
    phone: '',
    website: '',
    rib: '',
    iban: '',
    bic: '',
    tva_rate: '',
    logo: '',
    siren_number: '',
    siret_number: '',
    rcs_number: '',
    opqibi_number: '',
    contract_assurance: '',
    tva_number: '',
    primary_color: '',
    secondary_color: '',
    footer1: '',
    footer2: ''
  }

  return newEvent
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

const CreateForm = () => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [group, setGroup] = useState(false)
  const [clientId, setClientId] = useState('')

  const auth = useAuth()
  const createCompany = useCreateCompany()

  const getUsersList = useGetUsers({ role: 'collaborator' })
  const getClientsList = useGetUsers({ role: 'client' })
  const getGroupsList = useGetGroups()

  const [currentDate, setCurrentDate] = useState(moment())
  const getAvailableIng = useGetAvailableIng({ currentDate: currentDate, group: group })
  const router = useRouter()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleAddUser = () => {
    setSuspendDialogOpen(true)
  }

  useEffect(() => {
    if (auth?.user?.role.includes(['engineer'])) {
      setGroup(auth?.user?.d_group_id)
    }
  }, [auth?.user])

  const formik = useFormik({
    initialValues: getInitialValues(),

    // validationSchema: EventSchema,
    enableReinitialize: true, // Add this line to enable reinitialization

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      // await EventSchema.validate(values, { abortEarly: false })
      const formData = new FormData()

      formData.append('entitled', values.entitled)
      formData.append('adress', values.adress)
      formData.append('city', values.city)
      formData.append('zip_code', values.zip_code)
      formData.append('immatriculation', values.immatriculation)
      formData.append('siret_number', values.siret_number)
      formData.append('email', values.email)
      formData.append('phone', values.phone)
      formData.append('website', values.website)
      formData.append('rib', values.rib)
      formData.append('iban', values.iban)
      formData.append('bic', values.bic)
      formData.append('tva_rate', values.tva_rate)
      formData.append(`logo`, files[0])
      formData.append('siren_number', values.siren_number)
      formData.append('siret_number', values.siret_number)
      formData.append('rcs_number', values.rcs_number)
      formData.append('opqibi_number', values.opqibi_number)
      formData.append('contract_assurance', values.contract_assurance)
      formData.append('tva_number', values.tva_number)
      formData.append('primary_color', values.primary_color)
      formData.append('secondary_color', values.secondary_color)
      formData.append('footer1', values.footer1)
      formData.append('footer2', values.footer2)

      try {
        await createCompany.mutateAsync(formData)
        resetForm()
        router.push('/companies')
        setSubmitting(false)
      } catch (error) {
        console.log(error)
        const errorsObject = error?.response?.data
        setFormErrors(errorsObject)
      }
    }
  })
  const [dateError, setDateError] = useState('')

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, handleChange } = formik
  const dateFinPrevuQuery = useGetDateFinPrevu(clientId)
  const dateFinPrevu = dateFinPrevuQuery?.data?.data?.expected_date

  const handleFilesChange = files => {
    console.log(files)

    // Update chosen files
    setFiles(files)
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.entitled}
                helperText={renderArrayMultiline(formErrors?.errors?.entitled)}
                {...getFieldProps('entitled')}
                label='Intitulée du sociétés'
                placeholder='Intitulée du sociétés'
                aria-describedby='validation-basic-entitled'
                size='small'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                type='email'
                error={!!formErrors?.errors?.email}
                helperText={renderArrayMultiline(formErrors?.errors?.email)}
                {...getFieldProps('email')}
                label='Email du sociétés'
                placeholder='Email du sociétés'
                aria-describedby='validation-basic-email'
                size='small'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                type='tel'
                error={!!formErrors?.errors?.phone}
                helperText={renderArrayMultiline(formErrors?.errors?.phone)}
                {...getFieldProps('phone')}
                label='N° Teléphone du sociétés'
                placeholder='N° Teléphone du sociétés'
                aria-describedby='validation-basic-phone'
                size='small'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                type='url'
                error={!!formErrors?.errors?.website}
                helperText={renderArrayMultiline(formErrors?.errors?.website)}
                {...getFieldProps('website')}
                label='Site Web du sociétés'
                placeholder='Site Web du sociétés'
                aria-describedby='validation-basic-website'
                size='small'
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.immatriculation}
                helperText={renderArrayMultiline(formErrors?.errors?.immatriculation)}
                size='small'
                {...getFieldProps('immatriculation')}
                type='text'
                label='Immatriculation du sociétés'
                placeholder='Immatriculation du sociétés'
                aria-describedby='validation-basic-immatriculation'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.rib}
                helperText={renderArrayMultiline(formErrors?.errors?.rib)}
                size='small'
                {...getFieldProps('rib')}
                type='text'
                label='RIB du sociétés'
                placeholder='RIB du sociétés'
                aria-describedby='validation-basic-rib'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.iban}
                helperText={renderArrayMultiline(formErrors?.errors?.iban)}
                size='small'
                {...getFieldProps('iban')}
                type='text'
                label='IBAN du sociétés'
                placeholder='IBAN du sociétés'
                aria-describedby='validation-basic-iban'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.bic}
                helperText={renderArrayMultiline(formErrors?.errors?.bic)}
                size='small'
                {...getFieldProps('bic')}
                type='text'
                label='BIC du sociétés'
                placeholder='BIC du sociétés'
                aria-describedby='validation-basic-bic'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.tva_number}
                helperText={renderArrayMultiline(formErrors?.errors?.tva_number)}
                size='small'
                {...getFieldProps('tva_number')}
                type='text'
                label='Numéro TVA du sociétés'
                placeholder='Numéro TVA du sociétés'
                aria-describedby='validation-basic-tva_number'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.tva_rate}
                helperText={renderArrayMultiline(formErrors?.errors?.tva_rate)}
                size='small'
                {...getFieldProps('tva_rate')}
                type='text'
                label='Taux de TVA du sociétés'
                placeholder='Taux de TVA du sociétés'
                aria-describedby='validation-basic-tva_rate'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.siren_number}
                helperText={renderArrayMultiline(formErrors?.errors?.siren_number)}
                size='small'
                {...getFieldProps('siren_number')}
                type='text'
                label='Numéro SIREN du sociétés'
                placeholder='Numéro SIREN du sociétés'
                aria-describedby='validation-basic-siren_number'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.siret_number}
                helperText={renderArrayMultiline(formErrors?.errors?.siret_number)}
                size='small'
                {...getFieldProps('siret_number')}
                type='text'
                label='Numéro SIRET du sociétés'
                placeholder='Numéro SIRET du sociétés'
                aria-describedby='validation-basic-siret_number'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.rcs_number}
                helperText={renderArrayMultiline(formErrors?.errors?.rcs_number)}
                size='small'
                {...getFieldProps('rcs_number')}
                type='text'
                label='Numéro RCS du sociétés'
                placeholder='Numéro RCS du sociétés'
                aria-describedby='validation-basic-rcs_number'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.opqibi_number}
                helperText={renderArrayMultiline(formErrors?.errors?.opqibi_number)}
                size='small'
                {...getFieldProps('opqibi_number')}
                type='text'
                label='Numéro OPQIBI du sociétés'
                placeholder='Numéro OPQIBI du sociétés'
                aria-describedby='validation-basic-opqibi_number'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.adress}
                helperText={renderArrayMultiline(formErrors?.errors?.adress)}
                size='small'
                {...getFieldProps('adress')}
                type='text'
                label='Adresse du sociétés'
                placeholder='Adresse du sociétés'
                aria-describedby='validation-basic-adress'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.city}
                helperText={renderArrayMultiline(formErrors?.errors?.city)}
                size='small'
                {...getFieldProps('city')}
                type='text'
                label='Ville du sociétés'
                placeholder='Ville du sociétés'
                aria-describedby='validation-basic-city'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.zip_code}
                helperText={renderArrayMultiline(formErrors?.errors?.zip_code)}
                size='small'
                {...getFieldProps('zip_code')}
                type='text'
                label='Code Postale du sociétés'
                placeholder='Code Postale du sociétés'
                aria-describedby='validation-basic-zip_code'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.contract_assurance}
                helperText={renderArrayMultiline(formErrors?.errors?.contract_assurance)}
                size='small'
                {...getFieldProps('contract_assurance')}
                type='text'
                label="Contrat d'assurance du sociétés"
                placeholder="Contrat d'assurance du sociétés"
                aria-describedby='validation-basic-contract_assurance'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ marginBottom: 4 }}>
                  <label htmlFor='color'>Choisir couleur primare</label>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <input id='color' onChange={handleChange} name='primary_color' type='color' />
                  <p
                    style={{
                      color: '#f44336',
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      fontFamily: "'Inter',sans-serif",
                      lineHeight: '1.66',
                      textAlign: 'left',
                      marginTop: '3px',
                      marginRight: '0',
                      marginBottom: '0',
                      marginLeft: '0'
                    }}
                  >
                    {formErrors?.data?.primary_color}
                  </p>
                </div>
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ marginBottom: 4 }}>
                  <label htmlFor='color'>Choisir couleur secondaire</label>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <input id='color' onChange={handleChange} name='secondary_color' type='color' />
                  <p
                    style={{
                      color: '#f44336',
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      fontFamily: "'Inter',sans-serif",
                      lineHeight: '1.66',
                      textAlign: 'left',
                      marginTop: '3px',
                      marginRight: '0',
                      marginBottom: '0',
                      marginLeft: '0'
                    }}
                  >
                    {formErrors?.data?.secondary_color}
                  </p>
                </div>
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.footer1}
                helperText={renderArrayMultiline(formErrors?.errors?.footer1)}
                size='small'
                {...getFieldProps('footer1')}
                type='text'
                label='Pied de Page 1'
                placeholder='Pied de Page 1'
                aria-describedby='validation-basic-footer1'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.footer2}
                helperText={renderArrayMultiline(formErrors?.errors?.footer2)}
                size='small'
                {...getFieldProps('footer2')}
                type='text'
                label='Pied de Page 2'
                placeholder='Pied de Page 2'
                aria-describedby='validation-basic-footer2'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography>Logo du sociétés</Typography>
            <CustomFileUpload
              fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'xlsx']}
              multiple={true}
              name='image'
              handleFilesChange={handleFilesChange}
              onFileDelete={onFileDelete}
              files={files}
              endpoint=''
              error={formErrors}
            />
          </Grid>
          <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
            <Button size='large' variant='contained' type='submit'>
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}

export default CreateForm
