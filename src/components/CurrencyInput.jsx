import { TextField } from '@mui/material'
import { max } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'
import { NumericFormat } from 'react-number-format'

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue
          }
        })
      }}
      valueIsNumericString
    />
  )
})

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const CurrencyInput = ({
  label = '',
  value = '',
  prefix = '',
  thousandSeparator = ' ',
  decimalSeparator = ',',
  suffix = ' TND',
  decimalScale = 2,
  allowNegative = false,
  onChange,
  name = '',
  ...rest
}) => {
  return (
    <div>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        name={name}
        InputProps={{
          inputComponent: NumericFormatCustom,
          inputProps: {
            prefix,
            decimalScale,
            allowNegative,
            thousandSeparator,
            decimalSeparator,
            suffix
          }
        }}
        variant='standard'
        {...rest}
      />
    </div>
  )
}

export default CurrencyInput
