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
import { useCreateUser, useGetUsers, useGetUsersById, useUpdateUser } from 'src/services/users.service'
import { Autocomplete, FormHelperText } from '@mui/material'
import { useGetGroups } from 'src/services/groups.service'
import { useGetSubRoles } from 'src/services/role.service'
import { useGetAvailableIng, useUpdateDossier } from 'src/services/dossier.service'
import { useAuth } from 'src/hooks/useAuth'
import moment from 'moment/moment'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const UpdateForm = ({ folderData }) => {
  // ** Authed User
  const auth = useAuth()

  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
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
    path: ''
  })

  // ** REACT QUERY Data
  const getClientsQuery = useGetUsers({ role: 'client' })
  const clientsData = getClientsQuery?.data
  const getGroupsQuery = useGetGroups()
  const groupsData = getGroupsQuery?.data
  const getAvailableIngQuery = useGetAvailableIng({ group: formInput?.group })
  const availableIngData = getAvailableIngQuery?.data

  // ** REACT QUERY Mutaions
  const updateFolderMutation = useUpdateDossier()

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeGroup = e => {
    setFormInput({
      ...formInput,
      group: { ...formInput.group, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setFormErrors({})
    try {
      await updateFolderMutation.mutateAsync(formInput)
      router.push('/folders')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    setFormInput(f => {
      return { ...f, ...folderData }
    })
  }, [folderData])

  return (
    <>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.name}
                helperText={renderArrayMultiline(formErrors?.errors?.name)}
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
                value={formInput.client}
                size='small'
                onChange={event => {
                  setClientId(event?.target?.value)
                  handleChange(event)
                }}
                label='client'
                labelId='validation-basic-client'
                aria-describedby='validation-basic-client'
              >
                {getClientsQuery.isSuccess ? (
                  clientsData?.map(option => (
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

          {(auth?.user?.role.includes(['admin']) || auth?.user?.role.includes(['team_lead'])) && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel size='small' id='validation-basic-group' htmlFor='validation-basic-group'>
                  Groupes
                </InputLabel>
                <Select
                  error={!!formErrors?.errors?.group}
                  helperText={renderArrayMultiline(formErrors?.errors?.group)}
                  value={formInput?.group}
                  size='small'
                  onChange={event => {
                    setGroup(event?.target?.value)
                    handleChange(event)
                  }}
                  label='Groupes'
                  labelId='validation-basic-group'
                  aria-describedby='validation-basic-group'
                >
                  {getGroupsQuery.isSuccess ? (
                    groupsData?.map(option => (
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
                    {formErrors?.errors?.group}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel size='small' id='validation-basic-assigned_user' htmlFor='validation-basic-assigned_user'>
                Ingenieurs
              </InputLabel>
              <Select
                error={!!formErrors?.errors?.assigned_user}
                helperText={renderArrayMultiline(formErrors?.errors?.assigned_user)}
                value={formInput?.assigned_user}
                size='small'
                onChange={handleChange}
                label='Ingenieur'
                labelId='validation-basic-assigned_user'
                aria-describedby='validation-basic-assigned_user'
              >
                {getAvailableIngQuery.isSuccess ? (
                  availableIngData?.map(option => (
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.ref_audit}
                helperText={renderArrayMultiline(formErrors?.errors?.ref_audit)}
                size='small'
                type='text'
                label='Reference Auditeur'
                placeholder='Reference Auditeur'
                aria-describedby='validation-basic-ref_audit'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {formInput?.expected_due_date !== '' && (
              <DatePicker
                disabled={true}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={24}
                selected={new Date(moment(folderData?.expected_due_date, 'YYYY-MM-DD HH:mm:ss').format())}
                id='date-time-picker'
                dateFormat='dd/MM/yyyy HH:mm '
                customInput={<CustomInput label='Date Fin Prevu' />}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <TextField
                error={!!formErrors?.errors?.description}
                helperText={renderArrayMultiline(formErrors?.errors?.description)}
                multiline
                placeholder='description'
                maxRows={5}
                minRows={5}
                label='description'
                id='textarea-outlined-controlled'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            {/* <CustomFileUpload
               fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'xlsx']}
              multiple={true}
              name='PDF'
              handleFilesChange={handleFilesChange}
              onFileDelete={onFileDelete}
              files={files}
              endpoint=''
              error={formErrors}
            /> */}
          </Grid>
          <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
            <Button size='large' variant='contained' type='submit'>
              Submit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      <CardActions>
        <Button onClick={handleSubmit} size='large' type='button' sx={{ mr: 2 }} variant='outlined'>
          Submit
        </Button>
        <Button type='reset' size='large' color='secondary' variant='outlined'>
          Reset
        </Button>
      </CardActions>
    </>
  )
}

export default UpdateForm
