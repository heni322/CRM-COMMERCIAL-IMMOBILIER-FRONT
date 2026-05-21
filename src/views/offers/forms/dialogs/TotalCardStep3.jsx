import PropTypes from 'prop-types'

// material-ui
import { Box, Divider, Grid, Typography } from '@mui/material'

// third-party
import CurrencyFormat from 'react-currency-format'
import CustomCurrency from 'src/components/CustomCurrency'

// project imports
// ==============================|| TOTAL-SUBCARD PAGE ||============================== //

function TotalCardStep3({ productsData, allAmounts, useGetFactureTotalQuery }) {
  // /* removed */

  return (
    <div className='p-6 bg-gradient-to-br rounded-xl shadow-md'>
      <div className='flex justify-between items-center'>
        <div className='w-1/2'>
          <div className='hidden md:block'>
            <div>
              <img src={'/images/simpar.png'} alt='Example' />
            </div>
          </div>
        </div>
        <div className='w-1/2'>
          <div className='grid grid-cols-2 gap-4 text-right'>
            <div className='col-span-1 flex justify-end'>
              <span className='font-bold'>Total HT :</span>
            </div>
            <div className='col-span-1'>
              <span className='font-bold text-primary'>
                <CustomCurrency value={allAmounts?.montant_HT_total ?? 0} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
            <div className='col-span-1 flex justify-end'>
              <span className='font-bold'>Total Remise :</span>
            </div>
            <div className='col-span-1'>
              <span className='font-bold text-primary'>
                <CustomCurrency value={allAmounts?.montant_Remise ?? 0} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
            <div className='col-span-1 flex justify-end'>
              <span className='font-bold'>Total HTNet :</span>
            </div>
            <div className='col-span-1'>
              <span className='font-bold text-primary'>
                <CustomCurrency value={allAmounts?.montant_HTNet_total ?? 0} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
            <div className='col-span-1 flex justify-end'>
              <span className='font-bold'>Total TVA :</span>
            </div>
            <div className='col-span-1'>
              <span className='font-bold text-primary'>
                <CustomCurrency value={allAmounts?.montant_TVA_total ?? 0} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
            <div className='col-span-2 flex justify-end mt-2'>
              <hr className='w-1/2 border-t border-gray-300' />
            </div>
            <div className='col-span-1 flex justify-end'>
              <span className='font-bold text-primary'>Total TTC :</span>
            </div>
            <div className='col-span-1'>
              <span className='font-bold text-primary'>
                <CustomCurrency value={allAmounts?.montant_TTC_total ?? 0} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

TotalCardStep3.propTypes = {
  productsData: PropTypes.array,
  allAmounts: PropTypes.object
}

export default TotalCardStep3
