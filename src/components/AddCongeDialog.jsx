// ** React Imports
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import IconifyIcon from 'src/@core/components/icon'

// ** Icon Imports
import { LoadingButton } from '@mui/lab'

import { useAddConge, useEditConge } from 'src/services/shifts.service'
import moment from 'moment'
import CustomDatePicker from './CustomDatePicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const AddCongeDialog = ({ conge, user, open, status, onDialogStatusChange }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const auth = useAuth()

  const [description, setDescription] = useState('')
  const [joursConges, setJoursConges] = useState(0)

  // console.log(getFilePreviewQuery?.data)

  const createCongeMutation = useAddConge(user?.id)
  const editCongeMutation = useEditConge(user?.id)

  const [isLoading, setIsloading] = useState(false)

  const saveStatus = async () => {
    try {
      setIsloading(true)
      const formattedStartDate = moment(holidayStartDate).format('YYYY-MM-DD')
      const formattedEndDate = moment(holidayEndDate).format('YYYY-MM-DD')
      console.log(formattedEndDate) // '2021-06-07'
      if (conge)
        await editCongeMutation?.mutateAsync({
          values: {
            user_id: conge?.user_id,
            id: conge?.id,
            description: description,
            start_date: formattedStartDate,
            end_date: formattedEndDate
          }
        })
      else
        await createCongeMutation?.mutateAsync({
          values: {
            user_id: user?.id,
            description: description,
            start_date: formattedStartDate,
            end_date: formattedEndDate
          }
        })
      onDialogStatusChange()
    } catch (error) {
      // console.log('description:', description)
      // console.log(error)
    }
    setIsloading(false)
  }

  //Function

  const handleClose = () => {
    setDescription(null)
    onDialogStatusChange()
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setDescription(description + '\n') // Append a new line character
    }
  }

  const [holidayStartDate, setHolidayStartDate] = useState() // Initialize with an empty object
  const [holidayEndDate, setHolidayEndDate] = useState() // Initialize with an empty object

  const handleOnChangeStart = date => {
    setHolidayStartDate(date)
    if (date && holidayEndDate) {
      var timeDifference = holidayEndDate - date
      var dayDifference = timeDifference / (1000 * 3600 * 24)

      setJoursConges(dayDifference + 1)
    }
  }

  const handleOnChangeEnd = date => {
    setHolidayEndDate(date)

    if (holidayStartDate && date) {
      var timeDifference = date - holidayStartDate
      var dayDifference = timeDifference / (1000 * 3600 * 24)

      setJoursConges(dayDifference + 1)
    }
  }
  useEffect(() => {
    // selected={new Date(moment(conge?.start_date, 'YYYY-MM-DD HH:mm:ss').format())}
    if (conge) {
      setHolidayStartDate(new Date(moment(conge?.start_date, 'YYYY-MM-DD HH:mm:ss').format()))
      setHolidayEndDate(new Date(moment(conge?.end_date, 'YYYY-MM-DD HH:mm:ss').format()))
      setDescription(conge?.description)
    }
  }, [conge])

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <div>
        <Dialog
          onClose={handleClose}
          scroll='paper'
          aria-labelledby='customized-dialog-title'
          maxWidth={'md'}
          fullWidth={'md'}
          open={open}
        >
          <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
            <Typography variant='h6' component='span'>
              Ajouter un congé :
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleClose}
              sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 4 }} style={{ background: 'white' }}>
            <div className='flex gap-2 min-h-[400px] mt-4 flex-row justify-center w-full text-center'>
              <div className='flex self-center justify-center gap-2 mx-4'>
                <IconifyIcon className='w-28 h-28' icon='solar:calendar-broken' />
              </div>{' '}
              <div className='self-center flex flex-col gap-6 justify-start items-start '>
                {/* <div className='mb-4'>Ajouter un congé :</div> */}
                <div>
                  Total : {joursConges} jour{joursConges > 1 ? 's' : ''} de congé
                </div>
                <div className='self-center justify-center w-full'>
                  <div className='flex flex-col self-center justify-center gap-4'>
                    <div className='flex flex-row gap-4 align-middle'>
                      {/* <DatePicker
                        selectsRange
                        endDate={holidayEndDate}
                        selected={holidayStartDate}
                        startDate={holidayStartDate}
                        id='date-range-picker'
                        onChange={handleOnChangeRange}
                        shouldCloseOnSelect={false}
                        customInput={
                          <CustomInput label='Choisir les dates' start={holidayStartDate} end={holidayEndDate} />
                        }
                      /> */}

                      <DatePicker
                        id='issue-date'
                        dateFormat='dd/MM/yyyy'
                        selected={holidayStartDate}
                        customInput={<CustomInput label='Date Début' />}
                        onChange={v => {
                          try {
                            // setFormInput(f => {
                            //   return { ...f, date_echeance: v }
                            // })
                            handleOnChangeStart(v)
                          } catch (error) {}
                        }}
                      />
                      <DatePicker
                        id='issue-date'
                        dateFormat='dd/MM/yyyy'
                        selected={holidayEndDate}
                        customInput={<CustomInput label='Date Fin' />}
                        onChange={v => {
                          try {
                            // setFormInput(f => {
                            //   return { ...f, date_echeance: v }
                            // })
                            handleOnChangeEnd(v)
                          } catch (error) {}
                        }}
                      />
                      {/* <CustomDatePicker
                      disabled={false}
                      date={'Date Fin'}
                      // setDate={filter?.setState}
                      inputText={conge?.start_date}
                    /> */}
                    </div>
                    {holidayEndDate && holidayStartDate && holidayEndDate < holidayStartDate && (
                      <p className='text-red-500'>Date fin faut etre avant la date de début</p>
                    )}
                  </div>
                </div>
                <div className='self-center justify-center w-full'>
                  <TextField
                    multiline
                    placeholder='Add your description'
                    label='description'
                    fullWidth
                    rowsMax={4} // Set the maximum number of rows based on your design
                    // variant='outlined'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            {auth.user.role == 'team_lead' || auth.user.role == 'engineer' || auth.user.role == 'admin' ? (
              <div className=''>
                <div className='flex flex-row items-end self-end p-4'>
                  <LoadingButton
                    loading={isLoading}
                    loadingPosition='start'
                    style={{ marginLeft: '20px', padding: '12px' }}
                    startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                    color={'secondary'}
                    variant='contained'
                    onClick={() => {
                      saveStatus()
                    }}
                  >
                    {conge ? <>Modifier</> : <>Ajouter</>}
                  </LoadingButton>
                </div>
              </div>
            ) : null}
          </DialogActions>
        </Dialog>
      </div>
    </DatePickerWrapper>
  )
}

export default AddCongeDialog
