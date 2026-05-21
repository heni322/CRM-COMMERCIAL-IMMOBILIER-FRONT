// ** React Imports
import { forwardRef, useState, useEffect } from 'react'

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
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useGetUsersById, useUpdateUser, useCreateUser } from 'src/services/users.service'
import { useQuery } from '@tanstack/react-query'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const FormValidationUserEdit = ({ id }) => {
  // const getUserById = useGetUsersById(id)
  const submit = useCreateUser()

  const {
    data: user,
    isLoading,
    isSuccess
  } = useQuery(['user', id], async () => {
    // Fetch user data by ID using React Query's useQuery hook
    const response = await fetch(`http://141.94.78.248:8850/evrim/users/${id}`)
    const data = await response.json()

    return data
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  const formik = useFormik({
    initialValues: {
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
    },
    onSubmit: values => {
      // Handle form submission
    }
  })

  // if (!getUserById.isLoading) {
  //   formik.setValues(getUserById)
  // }

  // useEffect(() => {
  //   // Update form's initial values with user data when user is fetched
  //   if (getUserById) {
  //     formik.setValues(getUserById)
  //   }
  // })

  // ** States
  // const [state, setState] = useState({
  //   password: '',
  //   showPassword: false
  // })

  // ** Hooks

  // const handleClickShowPassword = () => {
  //   setState({ ...state, showPassword: !state.showPassword })
  // }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const onSubmit = data => {
    data.zip_code = Number(data.zip_code)
    data.p_position_id = null
    console.log(data)
    submit.mutateAsync({ data })
  }
  console.log(formik)
  useEffect(
    data => {
      if (isSuccess) {
        console.log(user)

        // const userData = user.data;
        formik.setValues({
          name: user.name,
          email: user.email,
          address: user.address,
          city: user.city,
          phone_number: user.phone_number,
          fax: user.fax,
          sexe: user.sexe,
          zip_code: user.zip_code,
          password: user.password,
          role: user.role
        })
        console.log(formik)
      }
    },
    [isLoading, isSuccess]
  )
  if (isLoading) {
    return <div></div>
  } else {
    return (
      <Card>
        <CardHeader title='Basic' />
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    label='name'
                    error={Boolean(errors.name)}
                    aria-describedby='validation-basic-first-name'
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='address'
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    label='address'
                    placeholder='Carter'
                    error={Boolean(errors.address)}
                    aria-describedby='validation-basic-last-name'
                  />
                  {errors.address && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-last-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    type='email'
                    label='Email'
                    error={Boolean(errors.email)}
                    placeholder='carterleonard@gmail.com'
                    aria-describedby='validation-basic-email'
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
                  <TextField
                    id='city'
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    type='city'
                    label='city'
                    error={Boolean(errors.city)}
                    placeholder='city'
                    aria-describedby='validation-basic-email'
                  />
                  {errors.city && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='fax'
                    value={formik.values.fax}
                    onChange={formik.handleChange}
                    type='fax'
                    label='fax'
                    error={Boolean(errors.fax)}
                    placeholder='fax'
                    aria-describedby='validation-basic-email'
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
                  <TextField
                    id='phone_number'
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    type='phone_number'
                    label='phone_number'
                    error={Boolean(errors.phone_number)}
                    placeholder='phone_number'
                    aria-describedby='validation-basic-email'
                  />
                  {errors.phone_number && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
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
                  <Select
                    id='sexe'
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    label='Sexe'
                    error={Boolean(errors.select)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    <MenuItem value=''>Sleect sexe</MenuItem>

                    <MenuItem value='homme'>Homme</MenuItem>
                    <MenuItem value='femme'>Femme</MenuItem>
                  </Select>
                  {errors.select && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='zip_code'
                    type='text'
                    value={formik.values.zip_code}
                    onChange={formik.handleChange}
                    label='zip_code'
                    error={Boolean(errors.zip_code)}
                    placeholder='zip_code'
                    aria-describedby='validation-basic-email'
                  />
                  {errors.zip_code && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type='text'
                    label='password'
                    error={Boolean(errors.password)}
                    placeholder='password'
                    aria-describedby='validation-basic-email'
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-email'>
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

                  <Select
                    id='role'
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    label='Role'
                    error={Boolean(errors.select)}
                    labelId='validation-basic-role'
                    aria-describedby='validation-basic-role'
                  >
                    <MenuItem value=''>Select a role</MenuItem>
                    <MenuItem value='collaborator'>Collaborator</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>

                  {errors.select && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-role'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    )
  }
}

export default FormValidationUserEdit
