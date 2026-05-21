// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import CustomFileUpload from 'src/components/CustomFileUpload'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/navigation'
import renderArrayMultiline from 'src/@core/utils/utilities'
import {
  useCreateUser,
  useGetClientCategories,
  useGetClientTypes,
  useGetUserCategories,
  useGetUserGroups,
  useGetUsers,
  useGetUsersById
} from 'src/services/users.service'
import { Autocomplete, FormControlLabel, FormGroup, Skeleton, Switch } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { useGetClientNatures } from 'src/services/client.service'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const Form = () => {
  /// ** LogedInUser
  const { user } = useAuth()

  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})

  const [auth, setAuth] = useState(0)
  const [active, setActive] = useState(false)
  const [files, setFiles] = useState([])

  const [showPasswords, setShowPasswords] = useState({
    password: false
  })

  // ** REACT QUERY
  const createClientMutation = useCreateUser()
  const clientNatureQuery = useGetClientNatures()
  const userCategoriesQuery = useGetClientCategories()
  const userTypesQuery = useGetClientTypes()
  const userCategoriesData = userCategoriesQuery?.data

  const usersQuery = useGetUsers({
    paginated: false,
    role: 'commercial'
  })
  const commercialList = usersQuery?.data

  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    address: '',
    phone_number_1: '',
    phone_number_2: '',
    ville: '',
    contact: '',
    zip_code: '',
    p_client_category_id: 1,
    p_client_type_id: 2,
    discount_client: '',
    contact_number: '',
    commercial_id: '',
    identifier_number: '',
    p_client_type_people_id: 2
  })

  const handleClickShowPassword = name => {
    setShowPasswords({ ...showPasswords, [name]: !showPasswords?.password })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const handleSwitchChange = event => {
    setActive(!active)
    setAuth(active ? 0 : 1)
  }

  const handleSubmit = async e => {
    // /* removed */

    e.preventDefault()
    setFormErrors({})
    try {
      const formData = new FormData()
      for (const key in formInput) {
        formData.append(key, formInput[key])
      }
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
      await createClientMutation.mutateAsync({ values: formData })
      router.push('/clients')
    } catch (error) {
      const errorsObject = error?.errors ?? error?.response?.data?.errors
      setFormErrors(errorsObject)
    }
  }

  const handleFilesChange = files => {
    // /* removed */;
    // Update chosen files
    setFiles([...files])
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  return (
    <>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Informations Générales
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              required
              label='Intitulée'
              value={formInput?.name || ''}
              name='name'
              onChange={handleChange}
              error={!!formErrors?.name}
              helperText={renderArrayMultiline(formErrors?.name)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {!clientNatureQuery?.isFetching && clientNatureQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput({
                    ...formInput,
                    p_client_type_people_id: newValue?.id
                  })
                }}
                defaultValue={clientNatureQuery?.data?.find(item => item?.id === formInput?.p_client_type_people_id)}
                options={clientNatureQuery?.data || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField {...params} required variant='standard' className='w-full' label='Nature' />
                )}
              />
            ) : (
              <Skeleton variant='rounded' fullWidth height={40} />
            )}
          </Grid>
          {formInput.p_client_type_people_id &&
          clientNatureQuery?.data?.find(option => option.id === formInput.p_client_type_people_id)?.entitled ===
            'Personne physique' ? (
            <Grid item xs={12} md={6}>
              <TextField
                variant='standard'
                fullWidth
                required
                label='Cin/Passport'
                value={formInput?.identifier_number || ''}
                name='identifier_number'
                onChange={handleChange}
                error={!!formErrors?.identifier_number}
                helperText={renderArrayMultiline(formErrors?.identifier_number)}
              />
            </Grid>
          ) : null}
          {formInput.p_client_type_people_id &&
          clientNatureQuery?.data?.find(option => option.id === formInput.p_client_type_people_id)?.entitled !==
            'Personne physique' ? (
            <Grid item xs={12} md={6}>
              <TextField
                variant='standard'
                fullWidth
                label='Identifiant fiscale'
                value={formInput?.identifier_number || ''}
                name='identifier_number'
                onChange={handleChange}
                error={!!formErrors?.identifier_number}
                helperText={renderArrayMultiline(formErrors?.identifier_number)}
              />
            </Grid>
          ) : null}
          {/* <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Cin/Passport*'
              value={formInput?.identifier_number || ''}
              name='identifier_number'
              onChange={handleChange}
              error={!!formErrors?.identifier_number}
              helperText={renderArrayMultiline(formErrors?.identifier_number)}
            />
          </Grid> */}

          <Grid item xs={12} md={6}>
            {!userTypesQuery?.isFetching && userTypesQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormInput({
                      ...formInput,
                      p_client_type_id: newValue?.id
                    })
                  } // newValue is null, clear the field
                }}
                value={userTypesQuery?.data?.find(item => item.id === formInput?.p_client_type_id)}
                options={userTypesQuery?.data || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField {...params} variant='standard' className='w-full' label='Selectionner le type' />
                )}
              />
            ) : (
              <Skeleton variant='rounded' fullWidth height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {!userCategoriesQuery?.isFetching && userCategoriesQuery?.isSuccess ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormInput({
                      ...formInput,
                      p_client_category_id: newValue?.id
                    })
                  } // newValue is null, clear the field
                }}
                value={userCategoriesData?.find(item => item.id === formInput?.p_client_category_id)}
                options={userCategoriesData || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    variant='standard'
                    className='w-full'
                    label='Selectionner la catégorie'
                  />
                )}
              />
            ) : (
              <Skeleton variant='rounded' fullWidth height={40} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput({
                  ...formInput,
                  commercial_id: newValue?.id
                })
              }}
              options={commercialList || []}
              getOptionLabel={option => option?.name}
              renderInput={params => <TextField {...params} variant='standard' className='w-full' label='Commercial' />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              required
              label='Numéro de Telephone'
              value={formInput?.phone_number_1 || ''}
              name='phone_number_1'
              onChange={handleChange}
              error={!!formErrors?.phone_number_1}
              helperText={renderArrayMultiline(formErrors?.phone_number_1)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Numéro de Telephone 2'
              value={formInput?.phone_number_2 || ''}
              name='phone_number_2'
              onChange={handleChange}
              error={!!formErrors?.phone_number_2}
              helperText={renderArrayMultiline(formErrors?.phone_number_2)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Person de Contact'
              value={formInput?.contact || ''}
              name='contact'
              onChange={handleChange}
              error={!!formErrors?.contact}
              helperText={renderArrayMultiline(formErrors?.contact)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Numéro de telephone de Contact'
              value={formInput?.contact_number || ''}
              name='contact_number'
              onChange={handleChange}
              error={!!formErrors?.contact_number}
              helperText={renderArrayMultiline(formErrors?.contact_number)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant='standard'
              fullWidth
              label='Adresse'
              value={formInput?.address || ''}
              name='address'
              onChange={handleChange}
              error={!!formErrors?.address}
              helperText={renderArrayMultiline(formErrors?.address)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant='standard'
              fullWidth
              label='Ville'
              value={formInput?.city || ''}
              name='city'
              onChange={handleChange}
              error={!!formErrors?.city}
              helperText={renderArrayMultiline(formErrors?.city)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant='standard'
              fullWidth
              label='Code Postal'
              value={formInput?.zip_code || ''}
              name='zip_code'
              onChange={handleChange}
              error={!!formErrors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.zip_code)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant='standard'
              fullWidth
              label='Email'
              value={formInput?.email || ''}
              name='email'
              onChange={handleChange}
              error={!!formErrors?.email}
              helperText={renderArrayMultiline(formErrors?.email)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
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
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <CardActions>
        <Button onClick={handleSubmit} size='large' type='button' sx={{ mr: 2 }} variant='outlined'>
          Ajouter
        </Button>
        {/* <Button type='reset' size='large' color='secondary' variant='outlined'>
          Réinitialiser
        </Button> */}
      </CardActions>
    </>
  )
}

export default Form
