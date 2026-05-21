// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DialogAlert from 'src/components/DialogAlert'
import renderArrayMultiline from 'src/@core/utils/utilities'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  useCreateAppointment,
  useDeleteAppointment,
  useGetAppointment,
  useGetAppointmentsTypes,
  useUpdateAppointment
} from 'src/services/appointments.service'
import { Autocomplete, Grid } from '@mui/material'
import useStates from 'src/hooks/useStates'
import moment from 'moment'

const defaultState = {
  title: '',
  id: null,
  description: '',
  p_appointment_type_id: 0,
  end: new Date(),
  state: 0,
  start: new Date()
}

const UpdateEventSidebar = props => {
  // ** Props
  const {
    client,
    offer,
    drawerWidth,
    calendarApi,
    handleSelectEvent,
    currentEvent,
    updateEventSidebarOpen,
    handleUpdateEventSidebarToggle
  } = props

  const createAppMutation = useCreateAppointment()
  const updateAppMutation = useUpdateAppointment()
  const deleteAppMutation = useDeleteAppointment()
  const getAppointment = useGetAppointment({ appId: currentEvent?.id })
  const appointmentData = getAppointment?.data
  const getAppointmentsTypesQuery = useGetAppointmentsTypes()
  console.log(currentEvent)

  // ** States
  const [values, setValues] = useState(defaultState)
  const [start, setstart] = useState()
  const [end, setend] = useState()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    title: '',
    description: '',
    p_appointment_type_id: null,
    end: null,
    state: null,
    start: null
  })

  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const states = getStatesByModel('DOpointment')

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    handleSelectEvent(null)
    handleUpdateEventSidebarToggle()
  }

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async data => {
    let modifiedEvent = {
      id: +(formInput?.id ?? undefined),
      entitled: formInput.title,
      start_date: moment(formInput?.start)?.format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment(formInput?.end)?.format('YYYY-MM-DD hh:mm:ss'),
      d_document_header_id: offer?.information?.id ?? null,
      p_appointment_type_id:
        formInput?.p_appointment_type_id ||
        (getAppointmentsTypesQuery?.data && getAppointmentsTypesQuery?.data?.length
          ? getAppointmentsTypesQuery?.data[0]?.id
          : null),
      state: formInput?.state || (states && states?.length ? states[0]?.state : null),
      description: formInput?.description,
      d_client_id: client?.id
    }
    console.log(modifiedEvent)
    console.log(offer)

    if (currentEvent?.id) {
      try {
        await updateAppMutation?.mutateAsync({ data: modifiedEvent, id: formInput?.id })

        handleSidebarClose()
      } catch (error) {}
    }
  }

  const deleteEvent = async () => {
    try {
      await deleteAppMutation?.mutateAsync({ id: currentEvent?.id })

      handleSidebarClose()
    } catch (error) {}
  }

  useEffect(() => {
    // Format start and end consistently
    const formattedstart = moment(appointmentData?.start).format('YYYY-MM-DD HH:mm:ss')
    const formattedend = moment(appointmentData?.end).format('YYYY-MM-DD HH:mm:ss')

    // Update formInput state while merging the formatted start and end
    setFormInput(formInput => {
      return {
        ...formInput,
        ...appointmentData,
        start: formattedstart,
        end: formattedend
      }
    })
  }, [updateEventSidebarOpen, currentEvent, getAppointment?.isFetched])

  return (
    <>
      {!getAppointmentsTypesQuery?.isFetching &&
      getAppointmentsTypesQuery?.isSuccess &&
      !getAppointment?.isFetching &&
      getAppointment?.isSuccess ? (
        <Drawer
          anchor='left'
          open={updateEventSidebarOpen}
          onClose={handleSidebarClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
        >
          <Box
            className='sidebar-header'
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: 'background.default',
              p: theme => theme.spacing(3, 3.255, 3, 5.255)
            }}
          >
            <Typography variant='h6'>
              {currentEvent?.id ? `Modifier ce rendez-vous` : 'Ajouter un rendez-vous'}
            </Typography>
          </Box>
          <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
            <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <TextField
                        multiline
                        name='title'
                        fullWidth
                        label='Intitulé'
                        id='event-title'
                        value={formInput?.title}
                        onChange={handleChange}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant='standard'
                            label='Intitulé*'
                            placeholder='Intitulé'
                            error={!!formErrors?.data?.title}
                            helperText={renderArrayMultiline(formErrors?.data?.title)}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <DatePicker
                        timeFormat='HH:mm'
                        dateFormat='dd/MM/yyyy HH:mm'
                        showTimeSelect={true}
                        label='Selectionner Date'
                        selected={new Date(formInput?.start)}
                        maxDate={new Date(formInput?.end)}
                        onChange={date => {
                          const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
                          setFormInput(formData => {
                            return { ...formData, start: formattedDate }
                          })
                        }}
                        customInput={<CustomInput variant='outlined' label={`Date Début`} />}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <DatePicker
                        timeFormat='HH:mm'
                        dateFormat='dd/MM/yyyy HH:mm'
                        showTimeSelect={true}
                        label='Selectionner Date'
                        selected={new Date(formInput?.end)}
                        onChange={date => {
                          const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
                          setFormInput(formData => {
                            return { ...formData, end: formattedDate }
                          })
                        }}
                        customInput={<CustomInput variant='outlined' label={`Date Fin`} />}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                          value={states?.find(state => state?.state === formInput?.state) || null}
                          onChange={(event, newValue) => {
                            setFormInput(formData => {
                              return { ...formData, state: newValue?.state }
                            })
                          }}
                          options={states || []}
                          getOptionLabel={option => option?.entitled}
                          renderInput={params => (
                            <TextField {...params} variant='outlined' label='Choisir status*' fullWidth />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                          value={
                            getAppointmentsTypesQuery?.data?.find(
                              type => type?.id === formInput?.p_appointment_type_id
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setFormInput(formData => {
                              return { ...formData, p_appointment_type_id: newValue?.id }
                            })
                          }}
                          options={getAppointmentsTypesQuery?.data || []}
                          getOptionLabel={option => option?.entitled}
                          renderInput={params => (
                            <TextField {...params} variant='outlined' label='Choisir type*' fullWidth />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        rows={4}
                        multiline
                        fullWidth
                        sx={{ mb: 2 }}
                        label='Description'
                        id='event-description'
                        name='description'
                        onChange={handleChange}
                        value={formInput?.description}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {!currentEvent?.id ? (
                    <Fragment>
                      <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
                        Ajouter
                      </Button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
                        Modifier
                      </Button>
                      <Button
                        size='large'
                        variant='outlined'
                        color='error'
                        onClick={() => {
                          setSuspendDialogOpen(true)
                        }}
                      >
                        Supprimer
                      </Button>
                    </Fragment>
                  )}
                </Box>
              </form>
            </DatePickerWrapper>
          </Box>
          <DialogAlert
            open={suspendDialogOpen}
            description=''
            setOpen={() => setSuspendDialogOpen(true)}
            title={`Supprimer ce rendez-vous ?`}
            acceptButtonTitle='Accepter'
            declineButtonTitle='Annuler'
            handleAction={e => {
              console.log(e)
              if (e === true) {
                deleteEvent()
              } else setSuspendDialogOpen(false)
            }}
          />
        </Drawer>
      ) : (
        <Drawer
          anchor='left'
          open={updateEventSidebarOpen}
          onClose={handleSidebarClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
        >
          <div className='p-4'>
            <Typography variant='h6'>
              {currentEvent?.id ? `Modifier ce rendez-vous` : 'Ajouter un rendez-vous'}
            </Typography>
            <div class='flex justify-center items-center mt-10'>
              <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
            </div>
          </div>
        </Drawer>
      )}
    </>
  )
}

export default UpdateEventSidebar
