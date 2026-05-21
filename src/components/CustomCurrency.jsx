import React from 'react'
import CurrencyFormat from 'react-currency-format'

const CustomCurrency = ({
  value = 0,
  prefix = '',
  type = 'text',
  thousandSeparator = ' ',
  decimalSeparator = ',',
  suffix = '',
  decimalScale = 2,
  allowNegative = false
}) => {
  // Format the value as a string with fixed decimal places and replace the dot with the specified separator
  const formattedValue = (parseFloat(value) || 0).toFixed(decimalScale).replace('.', decimalSeparator)

  // console.log(typeof formattedValue)

  return (
    <div>
      <CurrencyFormat
        value={formattedValue}
        displayType={type}
        thousandSeparator={thousandSeparator}
        prefix={prefix}
        suffix={suffix}
        decimalSeparator={decimalSeparator} // Keep this as a fallback
        decimalScale={decimalScale} // Will remain 3, but keeping it for consistency
        allowNegative={allowNegative}
        style={{ width: 200, padding: 10 }}
      />
    </div>
  )
}

export default CustomCurrency
