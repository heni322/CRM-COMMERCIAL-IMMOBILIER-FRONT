import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, CardContent, Checkbox, Grid, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import { forwardRef, useEffect, useState } from 'react'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import renderArrayMultiline from 'src/@core/utils/utilities'
import { useCreateReglement, useGetFactures, useGetReglementsMode } from 'src/services/reglements.service'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/navigation'
import { useGetUsers } from 'src/services/users.service'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import InvoiceColumn from 'src/views/invoices/list/InvoiceColumn'
import { useGetInvoices } from 'src/services/invoices.service'
import MainCard from 'src/components/MainCard'

// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
// import { PencilIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip
} from '@material-tailwind/react'

// import { Button, Card, CardBody, CardFooter } from '@material-tailwind/react'

const CreateReglement = () => {
  const navigate = useRouter()
  const auth = useAuth()
  const [formErrors, setFormErrors] = useState({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [user, setUser] = useState('')
  const [filterArray, setFilterArray] = useState([])
  const [date, setDate] = useState(null)
  const [client, setClient] = useState({ id: 0 })
  const [selectionstate, setSelectionState] = useState(false)

  const [formInput, setFormInput] = useState({
    libelle: '',
    p_mode_de_reglement_id: '',
    date_echeance: new Date(),
    date: new Date(),
    reference_cheque: '',
    reference_traite: '',
    montant: '',
    invoices: [],
    client_id: ''
  })
  const useGetModeReglementQuery = useGetReglementsMode()
  const reglementMode = useGetModeReglementQuery?.data

  const useGetFactureQuery = useGetFactures({
    idClient: formInput?.client_id
  })
  const factureData = useGetFactureQuery?.data
  const createReglementMutation = useCreateReglement()
  const getClientsQuery = useGetUsers({ type: '1', paginated: false, role: 'client' })

  const [selectedFacture, setSelectedFacture] = useState(null)
  const [selectedReglementMode, setSelectedReglementMode] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setFormErrors({})
    const stringsInvoices = selectedIds?.map(number => number.toString())
    const selectedInvoices = (Array.isArray(factureData)?factureData:(factureData?.data??[])).filter(invoice => selectedIds.includes(invoice?.id))
    const newArray = selectedInvoices?.map(item => ({ d_invoice_header_id: item.id }))

    try {
      const formattedInput = {
        ...formInput,
        invoices: newArray,
        date: moment(formInput?.date).format('YYYY-MM-DD'),
        date_echeance: moment(formInput?.date_echeance).format('YYYY-MM-DD')
      }
      await createReglementMutation.mutateAsync(formattedInput)

      navigate.push('/reglements')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
    }
  }

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  // **LIST COLUMNS
  const invoiceColumn = InvoiceColumn({ type: 1 })

  const clientsQuery = useGetUsers({
    role: 'client'
  })
  const clientsData = clientsQuery?.data

  /// **DATA
  const invoicesQuery = useGetInvoices({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,

    // user: user,
    clientId: client?.id,
    payed: false,
    relance: false,
    state: false,
    date: moment(date)?.format('YYYY-MM-DD')
  })

  // const invoicesData = invoicesQuery?.data
  const [invoicesData, setInvoicesData] = useState(factureData)

  useEffect(() => {
    // /* removed */
    if (invoicesQuery?.data) setInvoicesData(factureData)
  }, [invoicesQuery?.isSuccess, factureData])

  // const sendEmailMutation = useSendInvoiceEmail()

  useEffect(() => {
    setFilterArray([
      {
        title: 'Selectionner Date',
        setState: setDate,
        state: date,
        type: 'date'
      },
      {
        title: 'Selectionner Client',
        option: 'name',
        setState: setClient,
        state: client,
        data: clientsData,
        all: true,
        width: 250
      }
    ])
  }, [auth, date, client, clientsData])

  useEffect(() => {
    if (client?.id && client?.id !== 0) {
      setSelectionState(true)
    } else {
      setSelectionState(false)
    }
  }, [client])

  const [selectedIds, setSelectedIds] = useState([])
  const [totalAmount, setTotalAmount] = useState()

  useEffect(() => {
    calculateTotalAmount(selectedIds)
  }, [formInput?.montant])

  const calculateTotalAmount = selectedIds => {
    // /* removed */
    let totalAmountCurrent = 0
    if (selectedIds && selectedIds?.length > 0) {
      for (const id of selectedIds) {
        const selectedRow = invoicesData?.find(row => row.id === id)
        if (selectedRow && selectedRow.amount_TTC_total) {
          totalAmountCurrent += parseFloat(selectedRow.amount_TTC_total)
        }
      }
    }

    let currentSolde = parseFloat(formInput?.montant)

    const updatedData = invoicesData?.map((row, index) => {
      let rest_a_payer = row?.rest_a_payer
      var amountTTC = parseFloat(row.amount_TTC_total)

      if (selectedIds.includes(row.id)) {
        currentSolde = currentSolde - amountTTC
        rest_a_payer =
          currentSolde >= 0
            ? 0
            : currentSolde < 0 && amountTTC + currentSolde >= 0
            ? (-currentSolde)?.toFixed(2)
            : amountTTC
      } else {
        currentSolde = currentSolde + amountTTC
        rest_a_payer = amountTTC
      }
      rest_a_payer = parseFloat(rest_a_payer)

      return { ...row, rest_a_payer }
    })
    setInvoicesData(updatedData)
    setTotalAmount(totalAmountCurrent?.toFixed(2))

    return totalAmountCurrent?.toFixed(2)
  }

  const [selectAll, setSelectAll] = useState(false)
  useEffect(() => {
    var IDs = invoicesData?.map(row => row?.id)
    selectedIds?.length == IDs?.length && setSelectAll(true)
  }, [selectedIds])

  const handleSelectAll = event => {
    var IDs = invoicesData?.map(row => row.id)

    if (!selectAll) {
      // /* removed */)

      // Select all rows
      setSelectedIds(IDs)
      calculateTotalAmount(IDs)
    } else {
      calculateTotalAmount([])
      setSelectedIds([])
    }

    // Toggle the master checkbox state
    setSelectAll(!selectAll)
  }

  const handleChangeChecked = (event, row) => {
    // /* removed */
    setSelectAll(false)
    const isChecked = event?.target?.checked
    setSelectedIds(prevSelectedIds => {
      const updatedSelectedIds = isChecked
        ? [...prevSelectedIds, row?.id]
        : prevSelectedIds.filter(selectedId => selectedId !== row?.id)

      const totalAmount = calculateTotalAmount(updatedSelectedIds)

      return updatedSelectedIds
    })
  }

  return (
    <DatePickerWrapper>
      <div className='w-full gap-4 flex flex-row'>
        <div className='w-80%'>
          <Card>
            <CardContent className='w-full'>
              <Grid item xl={9} md={8} xs={12}>
                <div className='flex flex-col gap-2'>
                  <div class='grid grid-cols-2 gap-4 place-content-between h-48 ...'>
                    <div className='w-[125%]'>
                      <form className='p-4 '>
                        <Grid container spacing={2} sx={{ mt: 0.25 }}>
                          <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                              <div className='flex flex-row gap-2 '>
                                <IconifyIcon icon='ph:user' fontSize={20} />
                                <div>Client :</div>
                              </div>
                            </Typography>
                            <Autocomplete
                              onChange={(event, newValue) => {
                                setFormInput(formData => {
                                  return { ...formData, client_id: newValue?.id }
                                })
                              }}
                              options={getClientsQuery?.data || []}
                              sx={{
                                '& .MuiInputBase-input': { color: '#195EA8' },
                                '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                flexBasis: '50%' // Set the width to 50%
                              }}
                              getOptionLabel={option => option.name}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Client*'
                                  error={!!formErrors?.data?.client_id}
                                  helperText={renderArrayMultiline(formErrors?.data?.client_id)}
                                  sx={{
                                    '& .MuiInputBase-input': { color: '#195EA8' },
                                    '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                    flexBasis: '50%' // Set the width to 50%
                                  }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon
                                  icon='streamline:money-cash-dollar-coin-accounting-billing-payment-cash-coin-currency-money-finance'
                                  fontSize={20}
                                />
                                <div>Montant :</div>
                              </div>
                            </Typography>
                            <TextField
                              variant='outlined'
                              type='number'
                              fullWidth
                              label='Montant*'
                              value={formInput?.montant || ''}
                              name='montant'
                              onChange={handleChange}
                              error={!!formErrors?.data?.montant}
                              helperText={renderArrayMultiline(formErrors?.data?.montant)}
                              sx={{
                                '& .MuiInputBase-input': { color: '#195EA8' },
                                '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                flexBasis: '50%'
                              }} // Change 'blue' to your desired text color
                            />
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='solar:calendar-date-linear' fontSize={20} />
                                <div>Date de creation :</div>
                              </div>
                            </Typography>
                            <DatePicker
                              className='!w-full !mt-4'
                              id='issue-date'
                              dateFormat='dd/MM/yyyy'
                              selected={formInput?.date}
                              customInput={<CustomInput className='!w-full' label='Date du création' />}
                              onChange={v => {
                                try {
                                  setFormInput(f => {
                                    return { ...f, date: v }
                                  })
                                } catch (error) {}
                              }}
                              error={!!formErrors?.data?.date}
                              sx={{
                                '& .MuiInputBase-input': { color: '#195EA8' },
                                '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                flexBasis: '50%'
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='tdesign:system-regulation' fontSize={20} />
                                <div>Type de paiement :</div>
                              </div>
                            </Typography>
                            <Autocomplete
                              onChange={(event, newValue) => {
                                setSelectedReglementMode(newValue)
                                setFormInput(formData => {
                                  return { ...formData, p_mode_de_reglement_id: newValue?.id }
                                })
                              }}
                              options={Array.isArray(reglementMode) ? reglementMode : (reglementMode?.data ?? [])}
                              getOptionLabel={option => option.entitled}
                              sx={{
                                '& .MuiInputBase-input': { color: '#195EA8' },
                                '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                flexBasis: '50%'
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  variant='outlined'
                                  label='Type de paiement*'
                                  error={!!formErrors?.data?.p_mode_de_reglement_id}
                                  helperText={renderArrayMultiline(formErrors?.data?.p_mode_de_reglement_id)}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='ant-design:number-outlined' fontSize={20} />
                                <div>Libelle :</div>
                              </div>
                            </Typography>
                            <TextField
                              variant='outlined'
                              fullWidth
                              label='Libelle*'
                              value={formInput?.libelle || ''}
                              name='libelle'
                              onChange={handleChange}
                              error={!!formErrors?.data?.libelle}
                              helperText={renderArrayMultiline(formErrors?.data?.libelle)}
                              sx={{
                                '& .MuiInputBase-input': { color: '#195EA8' },
                                '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                flexBasis: '50%'
                              }}
                            />
                          </Grid>

                          {selectedReglementMode?.entitled === 'cheque' && (
                            <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                                <div className='flex flex-row gap-2'>
                                  <IconifyIcon icon='ant-design:number-outlined' fontSize={20} />
                                  <div>Reference cheque :</div>
                                </div>
                              </Typography>
                              <TextField
                                variant='outlined'
                                fullWidth
                                label='Reference cheque'
                                value={formInput?.reference_cheque || ''}
                                name='reference_cheque'
                                onChange={handleChange}
                                error={!!formErrors?.data?.reference_cheque}
                                helperText={renderArrayMultiline(formErrors?.data?.reference_cheque)}
                                sx={{
                                  '& .MuiInputBase-input': { color: '#195EA8' },
                                  '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                  flexBasis: '50%'
                                }}
                              />
                            </Grid>
                          )}
                          {selectedReglementMode?.entitled === 'traite' && (
                            <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                                <div className='flex flex-row gap-2'>
                                  <IconifyIcon icon='ant-design:number-outlined' fontSize={20} />
                                  <div>Reference traite :</div>
                                </div>
                              </Typography>
                              <TextField
                                variant='outlined'
                                fullWidth
                                label='Reference traite'
                                value={formInput?.reference_traite || ''}
                                name='reference_traite'
                                onChange={handleChange}
                                error={!!formErrors?.data?.reference_traite}
                                helperText={renderArrayMultiline(formErrors?.data?.reference_traite)}
                                sx={{
                                  '& .MuiInputBase-input': { color: '#195EA8' },
                                  '& .MuiOutlinedInput-root': { background: '#FEFEFE' },
                                  flexBasis: '50%'
                                }}
                              />
                            </Grid>
                          )}

                          {(selectedReglementMode?.entitled === 'traite' ||
                            selectedReglementMode?.entitled === 'cheque') && (
                            <Grid item xs={12} md={6} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant='body2' style={{ display: 'flex', flexBasis: '50%' }}>
                                <div className='flex flex-row gap-2'>
                                  <IconifyIcon icon='mdi:close' fontSize={20} />
                                  <div>Date échéance :</div>
                                </div>
                              </Typography>
                              <DatePicker
                                id='issue-date'
                                className='!w-full'
                                dateFormat='dd/MM/yyyy'
                                selected={formInput?.date_echeance}
                                customInput={<CustomInput className='!w-full' label='Date écheance' />}
                                onChange={v => {
                                  try {
                                    setFormInput(f => {
                                      return { ...f, date_echeance: v }
                                    })
                                  } catch (error) {}
                                }}
                                sx={{
                                  '& .react-datepicker-wrapper': { background: '#FEFEFE' },
                                  '& .react-datepicker__input-container input': {
                                    color: '#195EA8'
                                  },
                                  flexBasis: '50%'
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </form>
                    </div>
                    {/* <div className='justify-self-end self-start'>
                <Card className='flex self-start w-[300px]'>
                  <CardContent className='w-full'>
                    <Grid style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='body2'>Montant 1:</Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}
                        >
                          {formInput?.montant ? formInput?.montant : 0}
                        </Typography>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='body2'>Montant imputé:</Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}
                        >
                          {totalAmount ? totalAmount : 0}
                        </Typography>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='body2'>Solde Règlement:</Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}
                        >
                          {totalAmount && formInput?.montant && formInput?.montant - totalAmount > 0
                            ? parseFloat(formInput?.montant - totalAmount)?.toFixed(2)
                            : 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div> */}
                  </div>

                  <section class='container px-4 w-full self-center mt-20'>
                    <div class='overflow-hidden border border-gray-200 md:rounded-lg'>
                      <table class='min-w-full divide-y divide-gray-200 overflow-hidden border border-gray-200 md:rounded-lg'>
                        <thead class='bg-gray-50'>
                          <tr>
                            <th
                              scope='col'
                              class='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500'
                            >
                              <div class='flex items-center gap-x-3'>
                                <div class=''>
                                  <input
                                    id='default-checkbox'
                                    type='checkbox'
                                    checked={selectAll}
                                    onChange={(e, newValue) => {
                                      handleSelectAll(e)
                                    }}
                                    class='w-[20px] ml-2 h-[20px] cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                  ></input>
                                </div>
                              </div>
                            </th>
                            <th
                              scope='col'
                              class='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                            >
                              Référence
                            </th>
                            <th
                              scope='col'
                              class='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                            >
                              Date de création
                            </th>
                            <th
                              scope='col'
                              class='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                            >
                              Montant Facture
                            </th>
                            <th
                              scope='col'
                              class='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500'
                            >
                              Solde
                            </th>
                          </tr>
                        </thead>
                        <tbody class='bg-white divide-y divide-gray-200'>
                          {invoicesData &&
                            invoicesData?.length > 0 &&
                            invoicesData?.map((row, index) => {
                              return (
                                <tr key={index}>
                                  <td class='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    <div class='inline-flex items-center gap-x-3'>
                                      <input
                                        id='default-checkbox'
                                        type='checkbox'
                                        checked={selectedIds.includes(row.id) || selectAll}
                                        onChange={e => {
                                          handleChangeChecked(e, row)
                                        }}
                                        class='w-[20px] ml-2 h-[20px] cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                      ></input>
                                    </div>
                                  </td>
                                  <td class='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>{row.reference}</td>
                                  <td class='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>{row.created_at}</td>
                                  <td class='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    <div class='inline-flex items-center px-3 py-1 rounded-full gap-x-2 '>
                                      <h2 class='text-sm font-normal'>{row.amount_TTC_total}</h2>
                                    </div>
                                  </td>
                                  <td class='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    {formInput?.montant > 0 ? row.rest_a_payer : row.amount_TTC_total}
                                  </td>
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                    {(!invoicesData || (invoicesData && invoicesData?.length) == 0) && (
                      <div className='w-full flex h-28 align-middle bg-white text-center border border-gray-200 rounded-lg'>
                        <p className='w-full self-center'>Pas de facture à payer</p>
                      </div>
                    )}
                  </section>
                  {/* <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '15px' }} xs={12}>
              <LoadingButton
                // endIcon={<IconifyIcon icon='mdi:send' />}
                loadingPosition='end'
                loading={createReglementMutation.isLoading}
                variant='outlined'
                type='submit'
              >
                Imputer
              </LoadingButton>
              <LoadingButton
                loadingPosition='end'
                endIcon={<IconifyIcon icon='mdi:send' />}
                loading={createReglementMutation.isLoading}
                variant='contained'
                onClick={handleSubmit}
                type='submit'
              >
                Valider
              </LoadingButton>
            </Grid> */}
                </div>
              </Grid>
            </CardContent>
          </Card>
        </div>

        <div className='w-20%'>
          <div className='flex flex-col place-items-center w-full self-end'>
            <div className='justify-self-end self-start'>
              <Card className='flex self-start w-[300px]'>
                <CardContent className='w-full'>
                  <Grid style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Montant 1:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                        {formInput?.montant ? formInput?.montant : 0}
                      </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Montant imputé:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                        {totalAmount ? totalAmount : 0}
                      </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Solde Règlement:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                        {totalAmount && formInput?.montant && formInput?.montant - totalAmount > 0
                          ? parseFloat(formInput?.montant - totalAmount)?.toFixed(2)
                          : 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
            <div>
              <img
                alt='avatar'
                height={220}
                className='w-[180px] mt-10'
                src='/images/pages/account-settings-security-illustration.png'
              />
            </div>
            {auth?.user?.resources?.find(item => item.resource_name === `edit reglements`)?.authorized && (
              <div className='mt-20'>
                <LoadingButton
                  loadingPosition='end'
                  endIcon={<IconifyIcon icon='mdi:send' />}
                  loading={createReglementMutation.isLoading}
                  variant='contained'
                  onClick={handleSubmit}
                  type='submit'
                >
                  Valider
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </DatePickerWrapper>
  )
}

export default CreateReglement

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})
