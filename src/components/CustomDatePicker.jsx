// ** React Imports
import { useState, forwardRef, useEffect, memo } from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'

import Box from '@mui/material/Box'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { TextField } from '@mui/material'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import moment from 'moment'

const CustomDatePicker = ({ disabled, dateFormat, date, setDate, inputText, variant }) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <DatePicker
          disabled={disabled}
          id='issue-date'
          dateFormat={dateFormat ? dateFormat : 'dd/MM/yyyy'}
          selected={date}
          customInput={
            <CustomInput style={{ width: '100%' }} variant={variant ? variant : 'standard'} label={inputText} />
          }
          popperPlacement='bottom-start'
          onChange={value => setDate(value)}
        />
      </Box>
    </DatePickerWrapper>
  )
}

export default CustomDatePicker
