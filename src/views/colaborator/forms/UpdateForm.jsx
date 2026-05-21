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
import renderArrayMultiline, {
  returnEqualValuesDynamiqueAttributeInArray,
  returnEqualValuesInArray
} from 'src/@core/utils/utilities'
import {
  useCreateUser,
  useDeleteUser,
  useDisableUser,
  useGetRoles,
  useGetUsersById,
  useToggleUserStatus,
  useUpdateCollab,
  useUpdateUser
} from 'src/services/users.service'
import { Autocomplete, Box, ButtonBase, FormControlLabel, FormGroup, Skeleton, Switch } from '@mui/material'
import { useGetGroups } from 'src/services/groups.service'
import { useGetSubRoles } from 'src/services/role.service'
import DialogAlert from 'src/components/DialogAlert'
import { useGetShifts } from 'src/services/shifts.service'
import { useGetOperations } from 'src/services/operations.service'
import { LoadingButton } from '@mui/lab'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const UpdateForm = User => {
  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})

  const [showPasswords, setShowPasswords] = useState({
    password: false
  })

  const [isLoading, setIsLoading] = useState(true)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const IdUser = User.colaboratorId
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ** REACT QUERY
  const updateUserMutation = useUpdateCollab()
  const getUserQuery = useGetUsersById({ stats: false, userId: IdUser })
  const userData = getUserQuery?.data
  const { data: rolesList } = useGetRoles()
  const toggleUserStatusMutation = useToggleUserStatus()
  const deleteUserMutation = useDeleteUser()

  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    active: true,
    phone_number_1: '',
    phone_number_2: '',
    city: '',
    role: 'commercial',
    zip_code: ''
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
      await updateUserMutation.mutateAsync({ data: formInput, id: IdUser })

      router.push('/collaborators')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    if (getUserQuery.isSuccess) {
      setFormInput(f => {
        return {
          ...f,
          ...userData
        }
      })

      setIsLoading(false)
    }
  }, [userData, getUserQuery.isSuccess])

  const handleDeleteUser = async event => {
    try {
      if (event) {
        await deleteUserMutation.mutateAsync({ id: IdUser })

        router.push('/collaborators')
      }
      setDeleteDialogOpen(false)
    } catch (error) {

    }
  }

  const handleToggleUserStatus = async event => {
    try {
      if (event) {
        await toggleUserStatusMutation.mutateAsync({ id: IdUser })

        router.push('/collaborators')
      }
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  return (
    <>
      {!isLoading && getUserQuery?.isSuccess ? (
        <>
          <CardContent>
            <Grid container spacing={5}>
              {/* <Grid item xs={12}>
            <Divider sx={{ mb: '0 !important' }} />
          </Grid> */}
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Informations Générale
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
                  error={!!formErrors?.data?.name}
                  helperText={renderArrayMultiline(formErrors?.data?.name)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Numéro de Telephone'
                  value={formInput?.phone_number_1 || ''}
                  name='phone_number_1'
                  onChange={handleChange}
                  error={!!formErrors?.data?.phone_number_1}
                  helperText={renderArrayMultiline(formErrors?.data?.phone_number_1)}
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
                  error={!!formErrors?.data?.phone_number_2}
                  helperText={renderArrayMultiline(formErrors?.data?.phone_number_2)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Adresse'
                  value={formInput?.address || ''}
                  name='address'
                  onChange={handleChange}
                  error={!!formErrors?.data?.address}
                  helperText={renderArrayMultiline(formErrors?.data?.address)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Ville'
                  value={formInput?.city || ''}
                  name='city'
                  onChange={handleChange}
                  error={!!formErrors?.data?.city}
                  helperText={renderArrayMultiline(formErrors?.data?.city)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Code postal'
                  value={formInput?.zip_code || ''}
                  name='zip_code'
                  onChange={handleChange}
                  error={!!formErrors?.data?.zip_code}
                  helperText={renderArrayMultiline(formErrors?.data?.zip_code)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  Identifiants de compte
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    setFormInput({
                      ...formInput,
                      role: newValue?.display_name
                    })
                  }}
                  value={rolesList?.find(role => role?.name === formInput?.role) || null}
                  options={rolesList || []}
                  getOptionLabel={option => option?.display_name}
                  renderInput={params => (
                    <TextField {...params} required variant='standard' className='w-full' label='Role' />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant='standard'
                  fullWidth
                  required
                  label='Email'
                  value={formInput?.email || ''}
                  name='email'
                  onChange={handleChange}
                  error={!!formErrors?.data?.email}
                  helperText={renderArrayMultiline(formErrors?.data?.email)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  variant='standard'
                  fullWidth
                  label='Mot de passe'
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
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <LoadingButton
                loading={deleteUserMutation.isLoading}
                onClick={() => {
                  setDeleteDialogOpen(true)
                }}
                size='large'
                type='button'
                sx={{ mr: 2 }}
                variant='contained'
                color={'error'}
              >
                Supprimer
              </LoadingButton>
              <LoadingButton
                loading={toggleUserStatusMutation.isLoading}
                onClick={() => {
                  setSuspendDialogOpen(true)
                }}
                size='large'
                type='button'
                sx={{ mr: 2 }}
                variant='outlined'
                color={formInput?.state === 0 ? 'success' : 'error'}
              >
                {formInput?.state === 0 ? 'Activer' : 'Désactiver'}
              </LoadingButton>
            </Box>
            <LoadingButton
              loading={updateUserMutation.isLoading}
              onClick={handleSubmit}
              size='large'
              type='button'
              sx={{ mr: 2 }}
              variant='outlined'
            >
              Modifier
            </LoadingButton>
          </CardActions>
          <DialogAlert
            isLoading={toggleUserStatusMutation.isLoading}
            open={suspendDialogOpen}
            description=''
            setOpen={setSuspendDialogOpen}
            title={`${formInput?.state === 0 ? 'Activer' : 'Désactiver'} Collaborateur ${formInput?.name} ?`}
            acceptButtonTitle='Accepter'
            declineButtonTitle='Annuler'
            color={formInput?.state === 0 ? 'success' : 'error'}
            handleAction={handleToggleUserStatus}
          />
          <DialogAlert
            isLoading={deleteUserMutation.isLoading}
            open={deleteDialogOpen}
            description=''
            setOpen={setDeleteDialogOpen}
            title={`Supprimer Collaborateur : ${formInput?.name} ?`}
            acceptButtonTitle='Accepter'
            declineButtonTitle='Annuler'
            color={'error'}
            handleAction={handleDeleteUser}
          />
        </>
      ) : (
        <>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <Skeleton animation='wave' variant='rectangular' />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton animation='wave' variant='rectangular' />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton animation='wave' variant='rectangular' />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton animation='wave' variant='rectangular' />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton animation='wave' variant='rectangular' />
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            <CardActions>
              <Skeleton variant='rectangular' sx={{ height: 50, width: 150 }} />
              <Skeleton variant='rectangular' sx={{ height: 50, width: 150 }} />
            </CardActions>
          </CardContent>
        </>
      )}
    </>
  )
}

export default UpdateForm
