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

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/navigation'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useCreateUser, useGetUsersById, useUpdateUser } from 'src/services/users.service'
import { Autocomplete, FormControlLabel, FormGroup, Switch } from '@mui/material'
import { useGetGroups } from 'src/services/groups.service'
import { useGetSubRoles } from 'src/services/role.service'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const UpdateForm = Client => {
  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})

  const [showPasswords, setShowPasswords] = useState({
    password: false
  })

  const [role, setRole] = useState(null)
  const IdClient = Client.clientId
  const getClient = localStorage.getItem('userData')

  const clientDataLocalStorage = JSON.parse(getClient)
  console.log('====================================')
  console.log(clientDataLocalStorage)
  console.log('====================================')

  // ** REACT QUERY
  const groupsQuery = useGetGroups()
  const groupsData = groupsQuery?.data
  const subRolesQuery = useGetSubRoles('collaborator')
  const subRolesData = subRolesQuery?.data
  const updateClientMutation = useUpdateUser()
  const getClientQuery = useGetUsersById({ stats: false, userId: IdClient })
  const clientData = getClientQuery?.data

  const [formInput, setFormInput] = useState({
    email: '',
    password: '',
    role: clientDataLocalStorage?.role
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

  const handleSubmit = async e => {
    e.preventDefault()
    setFormErrors({})
    try {
      await updateClientMutation.mutateAsync({ data: formInput, id: IdClient })
      router.push('/')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    if (getClientQuery.isSuccess) {
      setFormInput(f => {
        return { ...f, ...clientData }
      })
    }
  }, [clientData, getClientQuery.isSuccess])

  return (
    <>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Identifiants de compte
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Email*'
              value={formInput?.email || ''}
              name='email'
              onChange={handleChange}
              error={!!formErrors?.data?.email}
              helperText={renderArrayMultiline(formErrors?.data?.email)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant='standard'
              fullWidth
              label='Mot de passe*'
              value={formInput?.password || ''}
              name='password'
              onChange={handleChange}
              error={!!formErrors?.data?.password}
              helperText={renderArrayMultiline(formErrors?.data?.password)}
              type={showPasswords?.password ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      name='password'
                      onClick={() => handleClickShowPassword('password')}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      <Icon icon={showPasswords?.password ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <Divider sx={{ mb: '0 !important' }} />
          </Grid> */}
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <CardActions>
        <Button onClick={handleSubmit} size='large' type='button' sx={{ mr: 2 }} variant='outlined'>
          Modifier
        </Button>
        {/* <Button type='reset' size='large' color='secondary' variant='outlined'>
          Reset
        </Button> */}
      </CardActions>
    </>
  )
}

export default UpdateForm
