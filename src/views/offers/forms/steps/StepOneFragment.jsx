import { Autocomplete, Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Fragment, forwardRef, useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Spacing from 'src/@core/theme/spacing'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { useGetClients, useGetUsers, useGetUsersById } from 'src/services/users.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetResidences } from 'src/services/residences.service'
import moment from 'moment'
import { LocalizationProvider } from '@mui/lab'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const StepOneFragment = ({
  handleSubmit,
  formInputParent,
  setFormInputParent,
  offer,
  isSuccess,
  isFetching,
  create
}) => {
  const [offerDate, setOfferDate] = useState()
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    step: 0,
    date_document: new Date(),
    date_echeance: new Date(),
    project_ids: [],
    d_client_id: 0,
    commercial_id: 0,
    client_contact: '',
    comment: ''
  })

  const getClientQuery = useGetClients({ paginated: false })
  const clientData = getClientQuery?.data

  const getUsersQuery = useGetUsers({ paginated: false })
  const usersData = getUsersQuery?.data

  const residencesQuery = useGetResidences({ paginated: false })
  const residencesData = residencesQuery?.data

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    // Only propagate when we actually have form data (avoids clobbering parent with empty/initial state)
    if (formInput && Object.keys(formInput).length) {
      setFormInputParent(formInput)
    }
  }, [formInput])
  useEffect(() => {
    // Guard against undefined offer during initial load
    if (offer) {
      setFormInput(prev => ({ ...prev, ...offer }))
    }
  }, [offer])

  return (
    <>
      {(!residencesQuery?.isFetching && residencesQuery?.isSuccess && isSuccess && !isFetching) ||
      (create && !residencesQuery?.isFetching && residencesQuery?.isSuccess) ? (
        <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
          <div className='z-4'>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <DatePicker
                    label='Selectionner Date'
                    inputFormat='dd/MM/yyyy'
                    value={moment(formInput?.date_document).format('DD-MM-YYYY')}
                    onChange={date => {
                      const formattedDate = moment(date).format('YYYY-MM-DD')

                      setFormInput({
                        ...formInput,
                        date_document: formattedDate
                      })
                    }}
                    dateFormat='dd/MM/yyyy'
                    customInput={<CustomInput variant='standard' label={`Date de l'offre`} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <DatePicker
                    label='Selectionner date'
                    inputFormat='dd/MM/yyyy'
                    value={moment(formInput?.date_echeance).format('DD-MM-YYYY')}
                    onChange={date => {
                      const formattedDate = moment(date).format('YYYY-MM-DD')

                      setFormInput({
                        ...formInput,
                        date_echeance: formattedDate
                      })
                    }}
                    dateFormat='dd/MM/yyyy'
                    customInput={<CustomInput variant='standard' label={`Date d'échéance`} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput(formData => {
                        return { ...formData, d_client_id: newValue?.id }
                      })
                    }}
                    value={(Array.isArray(clientData)?clientData:(clientData?.data??[])).find(client => client?.id === formInput?.d_client_id) || null}
                    options={Array.isArray(clientData) ? clientData : (clientData?.data ?? [])}
                    getOptionLabel={option => option?.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant='standard'
                        label={`Client*`}
                        placeholder={`Client`}
                        error={!!formErrors?.data?.d_client_id}
                        helperText={renderArrayMultiline(formErrors?.data?.d_client_id)}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    onChange={(event, newValue) => {
                      setFormInput(formData => {
                        return { ...formData, commercial_id: newValue?.id }
                      })
                    }}
                    value={(Array.isArray(usersData)?usersData:(usersData?.data??[])).find(user => user?.id === formInput?.commercial_id) || null}
                    options={Array.isArray(usersData) ? usersData : (usersData?.data ?? [])}
                    getOptionLabel={option => option?.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant='standard'
                        label={`Agent Commercial*`}
                        placeholder={`Agent Commercial`}
                        error={!!formErrors?.data?.commercial_id}
                        helperText={renderArrayMultiline(formErrors?.data?.commercial_id)}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple={true}
                    defaultValue={residencesData?.filter(residence => formInput?.project_ids?.includes(residence?.id))}
                    onChange={(event, newValue) => {
                      /* removed */
                      setFormInput(formData => {
                        return {
                          ...formData,
                          project_ids: newValue?.map(residence => residence?.id)
                        }
                      })
                    }}
                    options={Array.isArray(residencesData) ? residencesData : (residencesData?.data ?? [])}
                    getOptionLabel={option => option?.entitled}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant='standard'
                        label={`Résidence*`}
                        placeholder={`Résidence`}
                        error={!!formErrors?.data?.project_ids}
                        helperText={renderArrayMultiline(formErrors?.data?.project_ids)}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    variant='standard'
                    name='client_contact'
                    value={formInput?.client_contact}
                    onChange={handleChange}
                    label='Contact Client'
                    placeholder='Contact Client'
                    size='small'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <TextField
                    error={!!formErrors?.errors?.comment}
                    helperText={renderArrayMultiline(formErrors?.errors?.comment)}
                    multiline
                    name='comment'
                    value={formInput?.comment}
                    placeholder='Description'
                    maxRows={5}
                    minRows={5}
                    onChange={handleChange}
                    label='Description'
                    id='textarea-outlined-controlled'
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </DatePickerWrapper>
      ) : (
        <div className='flex justify-center items-center mt-10'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </>
  )
}

export default StepOneFragment
