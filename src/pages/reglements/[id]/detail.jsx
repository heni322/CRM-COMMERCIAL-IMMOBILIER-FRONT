import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import MainCard from 'src/components/MainCard'
import { useGetReglement } from 'src/services/reglements.service'
import EditForm from 'src/views/invoices/forms/EditForm'
import UpdateReglement from 'src/views/reglements/forms/updateReglement'

// import MainCard from 'src/components/MainCard'

const UpdateInvoice = () => {
  const router = useRouter()
  const invoiceId = router?.query?.id
  const invoiceQuery = useGetReglement(invoiceId)
  const reglementData = invoiceQuery?.data

  return (
    <div className='flex flex-row gap-10 place-items-center justify-center'>
      <div class='bg-white rounded-lg shadow-lg px-8 py-10 w-[800px]  '>
        <div class='border-b-2 gap-2 border-gray-300 pb-8 mb-8 grid justify-end'>
          <div class='flex flex-row gap-2 self-end'>
            <span class='flex flex-row  gap-2 items-center'>
              <IconifyIcon icon='tabler:number' fontSize={20} />
              Reference:
            </span>
            <span class='text-2xl font-bold ml-1'> {reglementData?.reference}</span>
          </div>
        </div>
        <div class='border-b-2 gap-8 border-gray-300 pb-8 mb-8 grid grid-cols-2'>
          <div class='grid grid-cols-2 gap-2'>
            <span class='flex flex-row w-[200px] gap-2 items-center'>
              <IconifyIcon icon='ph:user' fontSize={20} />
              Client :
            </span>
            <span class='font-bold ml-1'> {reglementData?.client?.name}</span>
          </div>
          <div class='grid grid-cols-2 gap-2'>
            <span class='flex flex-row w-[200px] items-center gap-2 items-center'>
              <IconifyIcon icon='tdesign:system-regulation' fontSize={20} />
              Mode Regelment :
            </span>
            <span class='font-bold ml-1'> {reglementData?.mode_de_reglement?.entitled}</span>
          </div>
          <div class='grid grid-cols-2 gap-2'>
            <span class='flex flex-row w-[200px] items-center gap-2'>
              <IconifyIcon icon='solar:calendar-date-linear' fontSize={20} />
              Date de creation :
            </span>
            <span class='font-bold ml-1'> {reglementData?.created_at}</span>
          </div>
          <div class='grid grid-cols-2 gap-2'>
            <span class='flex flex-row w-[200px] items-center gap-2'>
              <IconifyIcon icon='ph:user' fontSize={20} />
              Date de creation :
            </span>
            <span class='font-bold ml-1'> {reglementData?.created_at}</span>
          </div>
        </div>
        <div class='border-b-2 gap-2 border-gray-300 pb-8 mb-8 grid grid-cols-2'>
          {/* {(reglementData?.mode_de_reglement?.entitled === 'traite' ||
            reglementData?.mode_de_reglement?.entitled === 'cheque') && ( */}
          <>
            <div class='grid grid-cols-2 gap-2'>
              <span class='flex flex-row w-[200px] gap-2 items-center'>
                <IconifyIcon icon='mdi:close' fontSize={20} />
                Date échéance :
              </span>
              <span class='font-bold ml-1'>{reglementData?.date_echeance}</span>
            </div>
            <div class='grid grid-cols-2 gap-2'>
              <span class='flex flex-row w-[200px] gap-2 items-center'>
                <IconifyIcon icon='uil:bill' fontSize={20} />
                Référence chèque :
              </span>
              <span class='font-bold ml-1'>{reglementData?.reference_cheque || reglementData?.reference_traite}</span>
            </div>
          </>
          {/* )} */}
        </div>

        <table class='w-full text-left mb-8'>
          <thead>
            <tr>
              <th class='text-gray-700 font-bold uppercase py-2'>Factures</th>
              <th class='text-gray-700 font-bold uppercase py-2'> Montant TTC</th>
              <th class='text-gray-700 font-bold uppercase py-2'>Reste à payer</th>
            </tr>
          </thead>
          <tbody>
            {reglementData?.invoices?.map((item, index) => (
              <tr key={index}>
                <td class='py-4 text-gray-700'>{item?.reference}</td>
                <td class='py-4 text-gray-700'>€{item?.amount_TTC_total}</td>
                <td class='py-4 text-gray-700'>€{item?.rest_a_payer}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class='flex justify-end mb-2 mt-4'>
          <div className='flex justify-end mb-2 items-center'>
            <IconifyIcon icon='streamline:money-cash-bag-bag-payment-cash-money-finance' fontSize={20} />
            <div className='text-gray-700 mr-2 ml-2'>RESTE :</div>
          </div>
          <div class='text-gray-700'>€{reglementData?.reste}</div>
        </div>
        <div class='flex justify-end mb-8 items-center'>
          <div class='text-gray-700 gap-2 flex flex-row mr-2'>
            <IconifyIcon
              icon='streamline:money-cash-dollar-coin-accounting-billing-payment-cash-coin-currency-money-finance'
              fontSize={20}
            />{' '}
            MONTANT:
          </div>
          <div class='text-gray-700 font-bold text-xl'>€{reglementData?.montant}</div>
        </div>
      </div>
      <div>
        <img
          alt='avatar'
          height={220}
          className='w-[180px] mt-10'
          src='/images/pages/account-settings-security-illustration.png'
        />
      </div>
    </div>
  )
}

export default UpdateInvoice
