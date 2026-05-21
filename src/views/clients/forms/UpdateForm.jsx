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
import {
  useCreateUser,
  useDisableUser,
  useGetClientById,
  useGetClientCategories,
  useGetClientTypes,
  useGetUserCategories,
  useGetUsers,
  useGetUsersById,
  useUpdateUser
} from 'src/services/users.service'
import { Autocomplete, Box, FormControlLabel, FormGroup, Skeleton, Switch } from '@mui/material'
import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteClient, useGetClientNatures, useToggleActiveClient } from 'src/services/client.service'
import { LoadingButton } from '@mui/lab'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const UpdateForm = Client => {
  /// ** LogedInUser
  const { user } = useAuth()

  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const IdClient = Client.clientId

  // ** REACT QUERY
  const updateClientMutation = useUpdateUser()
  const getClientQuery = useGetClientById({ stats: false, userId: IdClient })
  const clientData = getClientQuery?.data

  // ** MuTATION
  const toggleDisableClientMutation = useToggleActiveClient()
  const deleteClientMutation = useDeleteClient()
  const clientNatureQuery = useGetClientNatures()
  const userCategoriesQuery = useGetClientCategories()
  const userTypesQuery = useGetClientTypes()

  const usersQuery = useGetUsers({
    paginated: false,
    role: 'commercial'
  })
  const userCategoriesData = userCategoriesQuery?.data
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
    p_client_category_id: '',
    p_client_type_id: '',
    discount_client: '',
    contact_number: '',
    commercial_id: '',
    identifier_number: '',
    p_client_type_people_id: '',
    state: 1
  })

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

      router.push('/clients')
    } catch (error) {
      const errorsObject = error?.errors ?? error?.response?.data?.errors
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

  const disableCollaboratorValidation = async action => {
    try {
      if (!action) {
        setDeleteDialogOpen(false)

        return
      }
      await toggleDisableClientMutation.mutateAsync({ id: formInput?.id })
      setSuspendDialogOpen(false)
      router.push('/clients')
    } catch (error) {}
  }

  const handleDeleteClient = async (action = false) => {
    try {
      if (!action) {
        setDeleteDialogOpen(false)

        return
      }
      await deleteClientMutation.mutateAsync({ id: formInput?.id })
      setDeleteDialogOpen(false)
      router.push('/clients')
    } catch (error) {}
  }

  return (
    <>
      {getClientQuery.isSuccess && !getClientQuery.isFetching ? (
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
                    <TextField required {...params} variant='standard' className='w-full' label='Nature' />
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

            <Grid item xs={12} md={6}>
              {!userTypesQuery?.isFetching && userTypesQuery?.isSuccess ? (
                <Autocomplete
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setFormInput({
                        ...formInput,
                        p_client_type_id: newValue?.id
                      })
                    }
                  }}
                  defaultValue={userTypesQuery?.data?.find(item => item?.id === formInput?.p_client_type_id)}
                  options={userTypesQuery?.data || []}
                  getOptionLabel={option => option?.entitled}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      variant='standard'
                      className='w-full'
                      label='Selectionner le type'
                    />
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
                    setFormInput({
                      ...formInput,
                      p_client_category_id: newValue?.id
                    })
                  }}
                  defaultValue={userCategoriesData?.find(item => item?.id === formInput?.p_client_category_id)}
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
              {!usersQuery?.isFetching && usersQuery?.isSuccess ? (
                <Autocomplete
                  onChange={(event, newValue) => {
                    setFormInput({
                      ...formInput,
                      commercial_id: newValue?.id
                    })
                  }}
                  defaultValue={(Array.isArray(commercialList)?commercialList:(commercialList?.data??[])).find(item => item?.id === formInput?.commercial_id)}
                  options={(Array.isArray(commercialList)?commercialList:(commercialList?.data??[]))}
                  getOptionLabel={option => option?.name}
                  renderInput={params => (
                    <TextField {...params} variant='standard' className='w-full' label='Commercial' />
                  )}
                />
              ) : (
                <Skeleton variant='rounded' fullWidth height={40} />
              )}
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
          </Grid>
        </CardContent>
      ) : (
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Informations Générales
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant='rounded' fullWidth height={40} />
          </Grid>
        </Grid>
      )}
      <Divider sx={{ m: '0 !important' }} />
      <CardActions
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <LoadingButton
            loading={toggleDisableClientMutation.isLoading}
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
            loading={toggleDisableClientMutation.isLoading}
            onClick={() => {
              setSuspendDialogOpen(true)
            }}
            size='large'
            type='button'
            sx={{ mr: 2 }}
            variant='outlined'
            color={formInput?.state == 0 ? 'success' : 'error'}
          >
            {formInput?.state == 0 ? 'Activer' : 'Désactiver'}
          </LoadingButton>
        </Box>
        <LoadingButton
          loading={updateClientMutation.isLoading}
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
        isLoading={toggleDisableClientMutation.isLoading}
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`${formInput?.active === 0 ? 'Activer' : 'Désactiver'} Client ${formInput?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        color={clientData?.active === 0 ? 'success' : 'error'}
        handleAction={disableCollaboratorValidation}
      />
      <DialogAlert
        isLoading={deleteClientMutation.isLoading}
        open={deleteDialogOpen}
        description=''
        setOpen={setDeleteDialogOpen}
        title={`Supprimer Client : ${formInput?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        color={'error'}
        handleAction={handleDeleteClient}
      />
    </>
  )
}

export default UpdateForm
