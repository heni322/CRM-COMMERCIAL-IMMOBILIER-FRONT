import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import Icon from 'src/@core/components/icon'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Autocomplete,
  TextField,
  Box,
  Checkbox
} from '@mui/material'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import PropertyDescription from './PropertyDescription'
import CardDescription from './CardDescription'
import CardTimeLine from './CardTimeLine'
import CardDocuments from './CardDocuments'
import CardImages from './CardImages'
import { LoadingButton } from '@mui/lab'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'

import useStates from 'src/hooks/useStates'
import CustomCurrency from 'src/components/CustomCurrency'
import Calendar from 'src/views/calendar'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import moment from 'moment'
import {
  useCreateOfferPayment,
  useGetBanks,
  useGetDocumentPayments,
  useGetDocumentsPaymentTypes,
  useUpdateOfferPayment
} from 'src/services/offers.service'
import CurrencyInput from 'src/components/CurrencyInput'
import CurrencyFormat from 'react-currency-format'

const Property = ({ offerId, offerData, offerQuery }) => {
  const router = useRouter()

  const getPaymentsTypes = useGetDocumentsPaymentTypes()
  const paymentsTypesData = getPaymentsTypes?.data

  const getBanks = useGetBanks()
  const banksData = getBanks?.data

  const getPayments = useGetDocumentPayments(offerId)
  const paymentsData = getPayments?.data

  const createPaymentMutation = useCreateOfferPayment()
  const updatePaymentMutation = useUpdateOfferPayment()
  const [value, setValue] = useState('1')
  const [totalTTC, setTotalTTC] = useState(0)

  const currentDate = moment(new Date()).format('YYYY-MM-DD')

  const [payments, setPayments] = useState()

  useEffect(() => {
    if (offerQuery?.isFetched) setTotalTTC(offerData?.information?.amount_TTC_total)
  }, [offerQuery?.isFetched])

  useEffect(() => {
    if (getPayments?.isFetched && getPayments?.data?.length > 0) setPayments(getPayments?.data)
    else
      setPayments([
        {
          p_type_echeance_id: 1,
          bank: 'ALUBAF - ALUBAF',
          date_echeance: currentDate,
          percentage: 0,
          amount: 0,
          pre_contract: 0
        }
      ])

  }, [getPayments?.isFetched])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const newPayments = [...payments]
    newPayments[index][name] = value
    if (name === 'percentage') {
      const parsedValue = parseFloat(value)
      if (!isNaN(parsedValue)) {
        // Round the percentage to two decimal places
        newPayments[index].percentage = Number(parsedValue.toFixed(2))

        const calculatedAmount = (parsedValue / 100) * totalTTC

        // Round the calculated amount to two decimal places
        newPayments[index].amount = isNaN(calculatedAmount) ? 0 : Number(calculatedAmount.toFixed(2))
      }
    } else if (name === 'amount') {
      const parsedValue = parseFloat(value)
      if (!isNaN(parsedValue)) {
        // Round the amount to two decimal places
        newPayments[index].amount = Number(parsedValue.toFixed(2))

        const calculatedPercentage = (parsedValue / totalTTC) * 100

        // Round the calculated percentage to two decimal places
        newPayments[index].percentage = isNaN(calculatedPercentage) ? 0 : Number(calculatedPercentage.toFixed(2))
      }
    }

    setPayments(newPayments)
  }

  const handleInputChangeType = (index, event) => {
    const newPayments = [...payments]
    newPayments[index]['p_type_echeance_id'] = event
    setPayments(newPayments)
  }

  const handleInputChangeBank = (index, event) => {
    const newPayments = [...payments]
    newPayments[index]['bank'] = event
    setPayments(newPayments)
  }

  const handleDateChange = (index, date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD')
    const newPayments = [...payments]
    newPayments[index]['date_echeance'] = formattedDate
    setPayments(newPayments)
  }

  const addPaymentLine = () => {
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    if (calculateTotalPercentage() === 100) {
      toast.error("Montant total d'échéance atteint. Vous ne pouvez pas ajouter plus de lignes.")

      return
    }

    setPayments([
      ...payments,
      {
        p_type_echeance_id: 1,
        bank: 'ALUBAF - ALUBAF',
        date_echeance: currentDate,
        percentage: 100 - calculateTotalPercentage(),
        amount: totalTTC - calculateTotalAmount(),
        pre_contract: 0
      }
    ])
  }

  const confirmPayments = async () => {
    let totalPercentage = 0
    let allLinesFilled = true

    payments?.forEach(payment => {
      // Check if any line has empty fields
      if (!payment?.p_type_echeance_id || !payment?.date_echeance || !payment?.percentage) {
        allLinesFilled = false
      }
      totalPercentage += parseFloat(payment?.percentage || 0)
    })

    if (allLinesFilled && totalPercentage === 100) {
      try {
        if (!paymentsData?.length) await createPaymentMutation.mutateAsync({ payment_lines: payments, id: offerId })
        else await updatePaymentMutation.mutateAsync({ payment_lines: payments, id: offerId })
      } catch (error) {}

    } else {
      if (!allLinesFilled) {
        toast.error('Please fill in all fields for each payment line.')
      } else if (totalPercentage !== 100) {
        toast.error('Total percentage should be 100%. Please adjust percentages.')
      }
    }
  }

  const handleDeletePaymentLine = index => {
    const updatedPayments = [...payments]
    updatedPayments?.splice(index, 1)
    setPayments(updatedPayments)
  }

  const calculateTotalPercentage = () => {
    let totalPercentage = 0
    payments?.forEach(payment => {
      totalPercentage += parseFloat(payment?.percentage)
    })

    return totalPercentage
  }

  const calculateTotalAmount = () => {
    let totalAmount = 0
    payments?.forEach(payment => {
      const percentage = parseFloat(payment?.percentage)
      const calculatedAmount = (percentage / 100) * totalTTC
      totalAmount += isNaN(calculatedAmount) ? 0 : calculatedAmount
    })

    return totalAmount
  }

  const handlePreContractChange = index => {
    const updatedPayments = [...payments]
    updatedPayments[index] = {
      ...updatedPayments[index],
      pre_contract: !updatedPayments[index].pre_contract // Toggle the pre_contract value
    }
    setPayments(updatedPayments)
  }

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
      {offerQuery?.isFetched &&
      offerQuery?.isSuccess &&
      !offerQuery?.isFetching &&
      getPayments?.isFetched &&
      getPayments?.isSuccess &&
      !getPayments?.isFetching ? (
        <MainCard content={false} sx={{ backgroundColor: '#F4F8FB' }}>
          <TabContext value={value}>
            <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
              <Tab value='1' label='Détails Document' />
              <Tab value='2' label='Calendrier' />
              <Tab value='3' label={`Pièce Jointe du document`} />
              <Tab value='4' label={`Lignes`} />
            </TabList>
            <TabPanel value='1'>
              <div className='p-4'>
                <Card>
                  <CardContent>
                    <div className='grid gap-2 md:grid-cols-3'>
                      <div className='flex flex-col gap-4'>
                        <div className='flex items-center mb-2'>
                          <span className='font-bold text-gray-800 text-1xl'>Détails du document:</span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:label-variant'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Reference:</span>
                          <span className='ml-1'>{offerData?.information?.reference}</span>
                        </div>
                        <div className='flex items-center'>
                          {/* Icon representing a person or user */}
                          <IconifyIcon
                            icon='mdi:account-outline'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Commercial:</span>
                          <span className='ml-1'>{offerData?.information?.creator?.name}</span>
                        </div>
                        <div className='flex items-center'>
                          {/* Icon representing a person or user */}
                          <IconifyIcon
                            icon='mdi:account-circle'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Client:</span>
                          <span className='ml-1'>{offerData?.information?.client?.name}</span>
                        </div>

                        <div className='flex items-center'>
                          {/* Icon representing a phone or call */}
                          <IconifyIcon
                            icon='mdi:phone'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Téléphone:</span>
                          <span className='ml-1'>{offerData?.information?.client?.phone_number_1}</span>
                        </div>

                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:calendar'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Date Document:</span>
                          <span className='ml-1'>{offerData?.information?.date_document}</span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:calendar-clock'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Date d'Échéance:</span>
                          <span className='ml-1'>{offerData?.information?.date_echeance}</span>
                        </div>

                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='bxs:contact'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Contact Client:</span>
                          <span className='ml-1'>{offerData?.information?.client_contact}</span>
                        </div>

                        {/* Include other new fields using a similar structure */}
                      </div>
                      <div className='flex flex-col gap-4'>
                        {/* Other fields with French labels */}
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:cash'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant HT Total:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_HT_total ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>

                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:percent'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant de Remise:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_discount ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:cash-multiple'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant HTNet Total:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_HTNet_total ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:currency-eur'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant TVA:</span>
                          <span className='ml-1'>
                            {<CustomCurrency value={offerData?.information?.amount_TVA ?? 0} allowNegative={false} />}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:cash-usd'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant TVA Total:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_TVA_total ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:cash-register'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant TTC Total:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_TTC_total ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <IconifyIcon
                            icon='mdi:credit-card-check'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800'>Montant Net à Payer:</span>
                          <span className='ml-1'>
                            {
                              <CustomCurrency
                                value={offerData?.information?.amount_NetaPayer ?? 0}
                                allowNegative={false}
                              />
                            }
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center mb-2'>
                          <IconifyIcon
                            icon='mdi:city-variant-outline'
                            width='24'
                            height='24'
                            className='mr-2 text-gray-600 fill-current'
                          />
                          <span className='font-bold text-gray-800 text-1xl'>Liste de ses biens:</span>
                        </div>
                        <div className='flex flex-col gap-4'>
                          {offerData?.details?.map((item, index) => (
                            <div className='flex items-center ml-8' key={index}>
                              <span className='font-bold text-gray-800'>Bien {index + 1}:</span>
                              <span className='ml-1'>{item?.entitled_property}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabPanel>
            <TabPanel value='2'>
              <div className='p-4'>
                <Card>
                  <CardContent>
                    <Calendar client={offerData?.information?.client} offer={offerData} resource='document' />
                  </CardContent>
                </Card>
              </div>
            </TabPanel>
            <TabPanel value='3'>
              <>
                <div className='mt-11 pl-5 h-[800px]'>
                  <iframe
                    title='PDF Viewer'
                    src={`${process.env.NEXT_PUBLIC_API_URL}/documents/${offerData?.information?.id}/pdf`}
                    width='100%'
                    height='800px'
                  ></iframe>
                </div>
              </>
            </TabPanel>
            <TabPanel value='4'>
              <div className='p-4'>
                <div className='flex flex-col items-center'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-gray-100'>
                        <th>Type</th>
                        <th>Banque</th>
                        <th>Date échéance</th>
                        <th>Pourcentage</th>
                        <th>Montant</th>
                        <th>Pré-contrat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments?.map((payment, index) => (
                        <tr key={index} className='text-center border-b'>
                          <td className='p-1' style={{ width: '21%' }}>
                            <Autocomplete
                              onChange={(event, newValue) => {
                                handleInputChangeType(index, newValue?.id)
                              }}
                              className='w-full'
                              options={(Array.isArray(paymentsTypesData)?paymentsTypesData:(paymentsTypesData?.data??[]))}
                              defaultValue={(Array.isArray(paymentsTypesData)?paymentsTypesData:(paymentsTypesData?.data??[])).find(item => item?.id === payment?.p_type_echeance_id)}
                              getOptionLabel={option => option?.entitled}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  className='w-full'
                                  label='Sélectionner le type'
                                />
                              )}
                            />
                          </td>
                          <td className='p-1' style={{ width: '21%' }}>
                            {payment.p_type_echeance_id === 5 ? (
                              <Autocomplete
                                onChange={(event, newValue) => {
                                  handleInputChangeBank(index, newValue?.entitled)
                                }}
                                className='w-full'
                                options={banksData || []}
                                defaultValue={banksData?.find(item => item?.entitled === payment?.bank)}
                                getOptionLabel={option => option?.entitled}
                                renderInput={params => (
                                  <TextField
                                    {...params}
                                    variant='outlined'
                                    className='w-full'
                                    label='Sélectionner la banque'
                                  />
                                )}
                              />
                            ) : (
                              <div className='flex items-center justify-center'>N/A</div>
                            )}
                          </td>

                          <td className='p-1' style={{ width: '21%' }}>
                            <DatePickerWrapper className='w-full'>
                              <DatePicker
                                dateFormat='dd/MM/yyyy'
                                selected={payment?.date_echeance ? new Date(payment?.date_echeance) : new Date()}
                                onChange={date => handleDateChange(index, date)}
                                customInput={<CustomInput variant='outlined' label={`Date échéance`} />}
                              />
                            </DatePickerWrapper>
                          </td>
                          <td className='p-1' style={{ width: '21%' }}>
                            <CurrencyInput
                              onChange={e => {
                                handleInputChange(index, e)
                              }}
                              variant='outlined'
                              value={payment?.percentage}
                              name='percentage'
                              decimalSeparator={','}
                              suffix={' %'}
                            />
                          </td>
                          <td className='p-1' style={{ width: '21%' }}>
                            <div className='flex items-center justify-center'>
                              {/* <TextField
                                name='amount'
                                type='number'
                                value={payment?.amount}
                                onChange={e => handleInputChange(index, e)}
                                className='w-full'
                              /> */}
                              <CurrencyInput
                                variant='outlined'
                                name='amount'
                                value={payment.amount}
                                size='big'
                                suffix=' TND'
                              />
                            </div>
                          </td>
                          <td className='p-1' style={{ width: '10%' }}>
                            <Checkbox
                              checked={payment?.pre_contract || false}
                              onChange={() => handlePreContractChange(index)}
                            />
                          </td>
                          <td className='p-1'>
                            {index === payments?.length - 1 ? (
                              <IconButton onClick={addPaymentLine}>
                                <Icon icon='mdi:plus' fontSize={20} />
                              </IconButton>
                            ) : (
                              <IconButton onClick={() => handleDeletePaymentLine(index)}>
                                <Icon icon='mdi:delete' fontSize={20} />
                              </IconButton>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='flex flex-col items-end'>
                  <div className='bg-gray-100 justify-end rounded-lg w-[400px] gap-2 p-6 flex flex-col shadow-md mt-6'>
                    <div className='grid grid-cols-1 gap-4'>
                      <div className='flex items-center text-right'>
                        <IconifyIcon
                          icon='mdi:percent'
                          width='24'
                          height='24'
                          className='mr-2 text-gray-600 fill-current'
                        />
                        <span className='font-bold text-gray-800'>Pourcentages Total:</span>
                        <span className='ml-1'>{calculateTotalPercentage()}%</span>
                      </div>
                    </div>
                    <div className='flex items-center text-right'>
                      <IconifyIcon
                        icon='mdi:currency-usd'
                        width='24'
                        height='24'
                        className='mr-2 text-gray-600 fill-current'
                      />
                      <span className='font-bold text-gray-800'>Montant Total:</span>
                      <span className='ml-1'>
                        <CustomCurrency value={calculateTotalAmount() ?? 0} suffix={' TN'} allowNegative={false} />
                      </span>
                    </div>
                    <div className='flex items-center text-right'>
                      <IconifyIcon icon='mdi:cash' width='24' height='24' className='mr-2 text-gray-600 fill-current' />
                      <span className='font-bold text-gray-800'>Total TTC:</span>
                      <span className='ml-1'>
                        <CustomCurrency value={totalTTC ?? 0} suffix={' TN'} allowNegative={false} />
                      </span>
                    </div>
                  </div>
                  <div className='flex justify-end mt-6'>
                    <Button variant='contained' onClick={confirmPayments}>
                      Confirmer
                    </Button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </MainCard>
      ) : (
        <MainCard content={false} sx={{ backgroundColor: '#F4F8FB' }}>
          <div class='flex justify-center items-center my-10'>
            <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
          </div>
        </MainCard>
      )}
    </DatePickerWrapper>
  )
}

export default Property
