// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useGetUsersById, useUpdateUser, useCreateUser } from 'src/services/users.service'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

// const AddUserForm = () => {
let initialValues = {
  name: '',
  email: '',
  password: '',
  address: '',
  phone_number: '',
  fax: '',
  role: '',
  city: '',
  zip_code: '',
  sexe: '',
  p_position_id: null
}

// }

const validationSchema = Yup.object({
  name: Yup.string().required('Nom est obligatoire'),
  email: Yup.string().email('format invalide').required('Le Email est obligatoire'),
  password: Yup.string().required('Le mot de passe est obligatoire'),
  address: Yup.string().required('Adresse est obligatoire'),
  phone_number: Yup.number().required('Le numero de telephone est obligatoire'),
  fax: Yup.number().required('Le Fax est obligatoire'),
  role: Yup.string().required('Le Role est obligatoire'),
  city: Yup.string().required('Le Ville est obligatoire'),
  zip_code: Yup.string().required('Le ZIP code est obligatoire'),
  sexe: Yup.string().required('Le Sexe code est obligatoire')
})

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const FormValidationUserEdit = () => {
  const submit = useCreateUser()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({})
  const router = useRouter()

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const [state, setState] = useState({
    password: '',
    showPassword: false
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  const onSubmit = data => {
    console.log(data)
    data.zip_code = Number(data.zip_code)
    data.p_position_id = null
    try {
      submit.mutateAsync({ data })

      router.push('/apps/user/list/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Card>
      <CardHeader title='Basic' />
      <CardContent>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit(onSubmit)} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label="Nom de l'utilisateur"
                      onChange={onChange}
                      placeholder="Nom de l'utilisateur"
                      error={Boolean(errors.name)}
                      aria-describedby='validation-basic-name'
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label="Adresse de l'utilisateur"
                      onChange={onChange}
                      placeholder="Adresse de l'utilisateur"
                      error={Boolean(errors.address)}
                      aria-describedby='validation-basic-adresse'
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-adresse'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='email'
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='email@exemple.com'
                      aria-describedby='validation-basic-email'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='city'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='text'
                      value={value}
                      label="Ville de l'utilisateur"
                      onChange={onChange}
                      error={Boolean(errors.city)}
                      placeholder='city'
                      aria-describedby='validation-basic-ville'
                    />
                  )}
                />
                {errors.city && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-ville'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='fax'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='fax'
                      value={value}
                      label='Fax'
                      onChange={onChange}
                      error={Boolean(errors.fax)}
                      placeholder='Numero Fax'
                      aria-describedby='validation-basic-email'
                    />
                  )}
                />
                {errors.fax && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='phone_number'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='Numero de telephone'
                      onChange={onChange}
                      error={Boolean(errors.phone_number)}
                      placeholder='phone_number'
                      aria-describedby='validation-basic-phone-number'
                    />
                  )}
                />
                {errors.phone_number && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-phone-number'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  id='validation-basic-select'
                  error={Boolean(errors.select)}
                  htmlFor='validation-basic-select'
                >
                  Sexe
                </InputLabel>
                <Controller
                  name='sexe'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Sexe'
                      onChange={onChange}
                      error={Boolean(errors.select)}
                      labelId='validation-basic-select'
                      aria-describedby='validation-basic-select'
                    >
                      <MenuItem value=''>Sleect sexe</MenuItem>

                      <MenuItem value='homme'>Homme</MenuItem>
                      <MenuItem value='femme'>Femme</MenuItem>
                    </Select>
                  )}
                />
                {errors.select && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='sexe'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='text'
                      value={value}
                      label='Sexe'
                      onChange={onChange}
                      error={Boolean(errors.sexe)}
                      placeholder='Sexe'
                      aria-describedby='validation-basic-sexe'
                    />
                  )}
                />
                {errors.sexe && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-sexe'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='zip_code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='Zip Code'
                      onChange={onChange}
                      error={Boolean(errors.zip_code)}
                      placeholder='Zip Code'
                      aria-describedby='validation-basic-zip-code'
                    />
                  )}
                />
                {errors.zip_code && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-zip-code'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='validation-basic-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='Mot de passe'
                      onChange={onChange}
                      id='validation-basic-password'
                      error={Boolean(errors.password)}
                      type={state.showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label='toggle password visibility'
                          >
                            <Icon icon={state.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-password'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='validation-basic-role' error={Boolean(errors.select)} htmlFor='validation-basic-role'>
                  Role
                </InputLabel>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Role'
                      onChange={onChange}
                      error={Boolean(errors.select)}
                      labelId='validation-basic-role'
                      aria-describedby='validation-basic-role'
                    >
                      <MenuItem value=''>Select a role</MenuItem>
                      <MenuItem value='collaborator'>Collaborator</MenuItem>
                      <MenuItem value='admin'>Admin</MenuItem>
                    </Select>
                  )}
                />
                {errors.select && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-role'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>{' '}
            <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' container>
              <Button size='large' type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* </Formik> */}
      </CardContent>
    </Card>
  )
}

export default FormValidationUserEdit
