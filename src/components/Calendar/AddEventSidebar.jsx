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
import { LocalizationProvider } from '@mui/lab'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  title: '',
  id: null,
  description: '',
  p_appointment_type_id: 0,
  endDate: new Date(),
  state: 0,
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    client,
    offer,
    drawerWidth,
    calendarApi,
    handleSelectEvent,
    currentEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  const createAppMutation = useCreateAppointment()
  const deleteAppMutation = useDeleteAppointment()
  const getAppointment = useGetAppointment({ appId: currentEvent?.id })
  const appointmentData = getAppointment?.data
  console.log(currentEvent)

  const getAppointmentsTypesQuery = useGetAppointmentsTypes()

  // ** States
  const [values, setValues] = useState(defaultState)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const states = getStatesByModel('DOpointment')

  const [formInput, setFormInput] = useState({
    title: '',
    description: '',
    p_appointment_type_id: null,
    end: new Date(),
    state: null,
    start: new Date(),
    d_client_id: client?.id ?? ''
  })

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
    handleAddEventSidebarToggle()
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

    try {
      await createAppMutation?.mutateAsync(modifiedEvent)

      handleSidebarClose()
    } catch (error) {}
  }

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const deleteEvent = async () => {
    try {
      await deleteAppMutation?.mutateAsync({ id: currentEvent?.id })

      handleSidebarClose()
    } catch (error) {}
  }

  // useEffect(() => {
  //   console.log(currentEvent)
  //   if (currentEvent !== null) {
  //     let event = {
  //       id: currentEvent?.id || 0,
  //       title: currentEvent?.title || '',
  //       description: currentEvent?.description || '',
  //       start: moment(currentEvent?.start),
  //       state: getAppointment?.data?.state,
  //       p_appointment_type_id: getAppointment?.data?.p_appointment_type_id,
  //       end: moment(currentEvent?.end)
  //     }
  //     const formattedStartDate = moment(appointmentData?.start).format('DD-MM-YYYY HH:mm')
  //     const formattedEndDate = moment(appointmentData?.end).format('DD-MM-YYYY HH:mm')

  //     event.start = moment(event?.start).format('DD-MM-YYYY hh:mm')
  //     event.end = moment(event?.end).format('DD-MM-YYYY hh:mm')
  //     console.log(event)
  //     setValues({
  //       id: event?.id || 0,
  //       title: event?.title || '',
  //       description: event?.description || '',
  //       start: formattedStartDate,
  //       end: formattedEndDate,
  //       state: getAppointment?.data?.state,
  //       p_appointment_type_id: getAppointment?.data?.p_appointment_type_id
  //     })
  //   }
  // }, [addEventSidebarOpen, currentEvent, getAppointment?.isFetched])

  useEffect(() => {
    // Format start and end consistently
    const formattedStart = moment(currentEvent?.start).format('YYYY-MM-DD HH:mm:ss')
    const formattedEnd = moment(currentEvent?.end).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')

    // Update formInput state while merging the formatted start and end
    setFormInput(formInput => {
      return {
        ...formInput,
        start: formattedStart,
        end: formattedEnd
      }
    })
  }, [addEventSidebarOpen, currentEvent, getAppointment?.isFetched])

  return (
    <>
      {!getAppointmentsTypesQuery?.isFetching &&
      getAppointmentsTypesQuery?.isSuccess &&
      !getAppointment?.isFetching &&
      getAppointment?.isSuccess ? (
        <Drawer
          anchor='left'
          open={addEventSidebarOpen}
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
                  <Fragment>
                    <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
                      Ajouter
                    </Button>
                  </Fragment>
                </Box>
              </form>
            </DatePickerWrapper>
          </Box>
        </Drawer>
      ) : (
        <Drawer
          anchor='left'
          open={addEventSidebarOpen}
          onClose={handleSidebarClose}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
        >
          <div className='p-4'>
            <Typography variant='h6'>Ajouter un rendez-vous</Typography>
            <div class='flex justify-center items-center mt-10'>
              <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
            </div>
          </div>
        </Drawer>
      )}
    </>
  )
}

export default AddEventSidebar
