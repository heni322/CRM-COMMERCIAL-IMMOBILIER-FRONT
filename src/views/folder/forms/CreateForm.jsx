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
import { useCreateDossier, useGetAvailableIng, useGetDateFinPrevu, useUploadFiles } from 'src/services/dossier.service'

// import DialogAddUserInfo from './add-user-modal'
import moment from 'moment'
import { useGetUserGroups, useGetUsers } from 'src/services/users.service'
import FileUploaderMultiple from 'src/components/CustomFileUpload'
import { useAuth } from 'src/hooks/useAuth'
import { useGetGroupUsers, useGetGroups } from 'src/services/groups.service'
import {
  Switch,
  Autocomplete,
  Backdrop,
  CardActions,
  CircularProgress,
  FormControlLabel,
  TextareaAutosize,
  RadioGroup,
  Radio
} from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useQueryClient } from '@tanstack/react-query'
import { useGetCompanies } from 'src/services/companies.service'
import { useGetOperations } from 'src/services/operations.service'

const CustomInput = forwardRef(({ error, helperText, ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

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
  const [type, setType] = useState(true)
  const [dispute, setDispute] = useState(0)
  const [formErrors, setFormErrors] = useState({})
  const [refAudit, setRefAudit] = useState('')
  const auth = useAuth()

  const [formInput, setFormInput] = useState({
    name: '',
    files: '',
    operation: '',
    p_operations_id: '',
    p_society_id: '',
    assigned_user: '',
    status: '',
    ref_audit: '',
    client: auth?.user?.role === 'client' ? auth?.user?.id : '',
    group: '',
    is_billed: '',
    is_payed: '',
    qte_received: '',
    progress: '',
    description: '',
    comments: '',
    path: '',
    type: 1
  })
  const [groupId, setGroupId] = useState('')

  const createDossier = useCreateDossier()
  const uploadFiles = useUploadFiles()

  // const getClientsList = useGetUsers({ role: 'client' })
  const getClientsList = useGetUserGroups()
  const getOperationsList = useGetOperations()
  const getCompaniesList = useGetCompanies({ paginated: false })

  const getAvailableIng = useGetGroupUsers({ grpId: groupId })
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   getAvailableIng?.isSuccess &&
  //     setFormInput(f => {
  //       return {
  //         ...f,
  //         assigned_user: auth?.user?.role === 'engineer' && auth?.user?.id,
  //         operation: 'BAR TH 164'
  //       }
  //     })
  // }, [getAvailableIng?.data, getAvailableIng?.isSuccess, auth])
  // useEffect(() => {

  //   setRefAudit(refAudit)
  // }, [getClientsList?.data, formInput?.client])

  // const handleChangeRefAudit = clientId => {
  //   const client = getClientsList?.data?.find(item => item.user_id === clientId)
  //   const refAudit = `AU-ENE-${client?.entitled}-${moment().format('DDMMYYYY')}-000`
  //   setFormInput(prev => {
  //     return {
  //       ...prev,
  //       ref_audit: refAudit
  //     }
  //   })
  // }

  const handleSubmit = async () => {
    setLoading(true)

    // await EventSchema.validate(values, { abortEarly: false })
    const formData = new FormData()
    formData.append('name', formInput.name)
    formData.append('path', '')
    formData.append('ref_audit', formInput.ref_audit)

    formData.append('client', formInput.client)
    formData.append('assigned_user', formInput?.assigned_user)
    formData.append('description', formInput?.description)
    formData.append('comments', formInput?.comments)
    formData.append('operation', formInput?.operation)
    formData.append('p_society_id', formInput?.p_society_id)
    formData.append('p_operations_id', formInput?.p_operations_id)
    formData.append('type', type ? 1 : 7)
    formData.append('dispute', dispute)
    try {
      const response = await createDossier.mutateAsync(formData)
      const filesArray = sliceIntoChunks(files, 5)
      for (let i = 0; i < filesArray.length; i++) {
        const formData = new FormData()
        const array = [...filesArray[i]]
        for (let index = 0; index < array.length; index++) {
          formData.append(`files[${index}]`, array[index])
        }
        await uploadFiles.mutateAsync({ values: formData, response: response })
      }
      setLoading(false)
      router.push('/folders')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
      setLoading(false)
    }
  }
  const dateFinPrevuQuery = useGetDateFinPrevu(formInput?.client)
  const dateFinPrevu = dateFinPrevuQuery?.data?.data?.expected_date

  const handleFilesChange = files => {
    // console.log(files);
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
              error={!!formErrors?.errors?.name}
              helperText={renderArrayMultiline(formErrors?.errors?.name)}
              name='name'
              onChange={handleChange}
              label='Nom du dossier'
              placeholder='Nom du dossier'
              aria-describedby='validation-basic-name'
              size='small'
            />
          </FormControl>
        </Grid>
        {auth?.user?.role !== 'client' && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                loading={!getClientsList?.data}
                loadingTest={'!getClientsList?.data'}
                onChange={(event, newValue) => {
                  setGroupId(newValue?.id)
                  const client = getClientsList?.data?.find(item => item.user_id === newValue?.user_id)
                  const refAudit = `AU-ENE-${client?.entitled}-${moment().format('DDMMYYYY')}-000`
                  setFormInput(formData => {
                    return { ...formData, client: newValue?.user_id, ref_audit: refAudit }
                  })
                }}
                options={getClientsList?.data || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='standard'
                    label='Client*'
                    error={!!formErrors?.errors?.client}
                    helperText={renderArrayMultiline(formErrors?.errors?.client)}
                  />
                )}
              />
            </FormControl>
          </Grid>
        )}
        {auth?.user?.role !== 'client' && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput(formData => {
                    return { ...formData, p_society_id: newValue?.id }
                  })
                }}
                options={getCompaniesList?.data || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='standard'
                    label='Société*'
                    error={!!formErrors?.errors?.p_society_id}
                    helperText={renderArrayMultiline(formErrors?.errors?.p_society_id)}
                  />
                )}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput(formData => {
                  return { ...formData, p_operations_id: newValue?.id, operation: newValue?.id }
                })
              }}
              options={getOperationsList?.data || []}
              getOptionLabel={option => option?.name}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Operation*'
                  error={!!formErrors?.errors?.p_operations_id}
                  helperText={renderArrayMultiline(formErrors?.errors?.p_operations_id)}
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput(formData => {
                  return {
                    ...formData,
                    p_operations_id: newValue?.id,
                    operation: newValue?.id
                  }
                })
              }}
              options={getOperationsList?.data || []}
              // options={[
              //   { id: 'BAR TH 164', entitled: 'BAR TH 164' },
              //   { id: 'BAR TH 145', entitled: 'BAR TH 145' }
              // ]}
              getOptionLabel={option => option?.entitled}
              defaultValue={{ id: 'BAR TH 164', entitled: 'BAR TH 164' }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Operation*'
                  error={!!formErrors?.data?.operation}
                  helperText={renderArrayMultiline(formErrors?.data?.operation)}
                />
              )}
            />
          </FormControl>
        </Grid> */}
        {!(auth?.user?.role === 'engineer') && (
          <>
            {getAvailableIng?.isSuccess && getAvailableIng?.isFetching === false && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput(formData => {
                        return { ...formData, assigned_user: newValue?.id }
                      })
                    }}
                    defaultValue={getAvailableIng?.data?.find(item => item?.id === formInput?.assigned_user)}
                    options={getAvailableIng?.data || []}
                    getOptionLabel={option => option?.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant='standard'
                        label='Ingenieur'
                        error={!!formErrors?.errors?.assigned_user}
                        helperText={renderArrayMultiline(formErrors?.errors?.assigned_user)}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}
          </>
        )}
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
                          <MenuItem key={option?.id} value={option?.id}>
                            {option?.name}
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              id='ref_audit'
              variant='standard'
              error={!!formErrors?.errors?.ref_audit}
              helperText={renderArrayMultiline(formErrors?.errors?.ref_audit)}
              size='small'
              type='text'
              name='ref_audit'
              onChange={handleChange}
              value={formInput?.ref_audit}
              inputProps={{
                label: 'shrink'
              }}
              label="Reference de l'audit"
              placeholder="Reference de l'audit"
              aria-describedby='validation-basic-ref_audit'
            />
          </FormControl>
        </Grid>
        {dateFinPrevu && (
          <Grid item xs={12} sm={6}>
            <DatePicker
              disabled={true}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={24}
              selected={new Date(dateFinPrevu)}
              id='date-time-picker'
              dateFormat='dd/MM/yyyy HH:mm'
              customInput={<CustomInput label='Date Fin Prevu' />}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              error={!!formErrors?.errors?.comments}
              helperText={renderArrayMultiline(formErrors?.errors?.comments)}
              multiline
              name='comments'
              placeholder='comments'
              maxRows={5}
              minRows={5}
              onChange={handleChange}
              label='Commentaire'
              id='textarea-outlined-controlled'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomFileUpload
            fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'xlsx']}
            multiple={true}
            name='PDF'
            handleFilesChange={handleFilesChange}
            onFileDelete={onFileDelete}
            files={files}
            endpoint=''
            error={formErrors}
          />
        </Grid>
        <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
          <LoadingButton loadingPosition='end' loading={loading} onClick={handleSubmit} variant='contained'>
            Ajouter
          </LoadingButton>
        </Grid>
      </Grid>
      <CardActions>
        <FormControlLabel
          control={
            <Android12Switch
              checked={type}
              onChange={event => {
                if (event?.target?.checked) {
                  setDispute(0)
                }
                setType(event?.target?.checked)
              }}
            />
          }
          label={type ? 'Nouveau' : 'Modifier'}
        />
        {!type && (
          <div className='flex flex-col w-full gap-2 mt-4'>
            <div className='flex flex-row w-full'>
              <div className='w-[30%] mb-6'></div>
              <RadioGroup
                row
                className='w-[50%]'
                value={dispute}
                name='simple-radio'
                onChange={event => setDispute(event.target.value)}
                aria-label='simple-radio'
              >
                <FormControlLabel value='1' control={<Radio />} label='Faute Interne' />
                <FormControlLabel value='2' control={<Radio />} label='Faute client' />
              </RadioGroup>
            </div>
          </div>
        )}
      </CardActions>
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

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}))
