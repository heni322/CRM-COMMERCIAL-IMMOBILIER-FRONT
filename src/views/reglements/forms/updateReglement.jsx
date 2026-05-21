import { useEffect, useState } from 'react'

// material-ui
import { Autocomplete, Box, CardContent, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material'
import { Card } from '@material-tailwind/react'

// project imports
import { LoadingButton } from '@mui/lab'
import AddActions from '../cards/AddActions'
import AddCard from '../cards/AddCard'
import { useRouter } from 'next/navigation'
import MainCard from 'src/components/MainCard'
import { useGetFactures, useGetReglement, useUpdateReglement } from 'src/services/reglements.service'
import { useCancelInvoice, useValidateInvoice } from 'src/services/invoices.service'
import { useGetPreferences } from 'src/services/preferences.service'
import { useAuth } from 'src/hooks/useAuth'
import IconifyIcon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

const UpdateReglement = ({ invoiceId, type = 1, title = 'Editer Reglement', goBackLink = '/reglements' }) => {
  const router = useRouter()
  const reglementId = invoiceId
  const auth = useAuth()

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const [totalHeader, setTotalHeader] = useState({
    montant_HT_total: '',
    montant_TTC_total: '',
    montant_TVA_total: '',
    montant_HTNet_total: '',
    montant_Remise: ''
  })

  // const createInvoiceAvoirMutation = useCreateInvoiceAvoir(invoiceId);
  const updateInvoiceMutation = useUpdateReglement(reglementId)
  const validateInvoiceMutation = useValidateInvoice(reglementId)
  const cancelInvoiceMutation = useCancelInvoice(reglementId)

  const [reglementData, setReglementData] = useState({
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
  const [items, setItems] = useState([])
  const [articles, setArticles] = useState([])
  const [count, setCount] = useState(1)

  const [showInvoice, setShowInvoice] = useState(false)

  const [disabled, setDisabled] = useState(
    !auth?.user?.resources?.find(item => item.resource_name === `edit reglements`)?.authorized
  )

  // const [avoir, setAvoir] = useState(false);
  const [rest, setRest] = useState(0)

  const dossiersQuery = useGetFactures({ idClient: reglementData?.client_id })
  const clientArticlesData = dossiersQuery?.data
  const preferencesQeury = useGetPreferences()
  const preferencesData = preferencesQeury?.data
  const reglementQuery = useGetReglement(reglementId)

  // const reglementData = reglementQuery?.data

  useEffect(() => {
    setReglementData(reglementQuery?.data)
    if (reglementQuery?.isSuccess && reglementData && reglementData?.invoices) {
      if (reglementData?.reste === 0) {
        setDisabled(true)
      }

      setReglementData({ ...reglementData })

      setRest(reglementData?.reste)

      reglementQuery?.isSuccess && setItems([...reglementData?.invoices])
      dossiersQuery?.isSuccess && setArticles([...clientArticlesData])

      setCount(reglementData?.invoices?.length === 0 ? 1 : reglementData?.invoices?.length)
    }
  }, [dossiersQuery?.isSuccess, clientArticlesData, reglementData, reglementQuery?.isSuccess])

  // useEffect(() => {
  // }, [nextRefrenceData])
  const handlePrintInvoice = () => {
    const fileURL = `${process.env.REACT_APP_API_URL}invoices/${invoiceId}/pdf`
    const link = document.createElement('a')
    link.href = fileURL
    link.target = '_blank'
    link.download = 'download.pdf'
    link.click()
  }

  const handleSubmit = async () => {
    const filteredArray = items.filter(value => value !== undefined)

    const form = {
      ...reglementData,
      invoices: [...filteredArray]
    }

    try {
      await updateInvoiceMutation.mutateAsync(form)

      router(goBackLink)
    } catch (error) {
      // toast.error(error?.response?.data?.message);
    }
  }
  const [selectedIds, setSelectedIds] = useState([])
  const [totalAmount, setTotalAmount] = useState()

  useEffect(() => {
    calculateTotalAmount(selectedIds)
  }, [reglementData?.montant])
  useEffect(() => {
  }, [reglementData])

  const calculateTotalAmount = selectedIds => {
    // /* removed */
    let totalAmountCurrent = 0

    for (const id of selectedIds) {
      const selectedRow = reglementData?.invoices?.find(row => row.id === id)
      if (selectedRow && selectedRow.amount_TTC_total) {
        totalAmountCurrent += parseFloat(selectedRow.amount_TTC_total)
      }
    }

    let currentSolde = parseFloat(reglementData?.montant)

    const updatedData = reglementData?.invoices?.map((row, index) => {
      let solde = row?.solde
      var amountTTC = parseFloat(row.amount_TTC_total)

      if (selectedIds.includes(row.id)) {
        currentSolde = currentSolde - amountTTC
        solde =
          currentSolde >= 0
            ? 0
            : currentSolde < 0 && amountTTC + currentSolde >= 0
            ? (-currentSolde)?.toFixed(2)
            : amountTTC
      } else {
        currentSolde = currentSolde + amountTTC
        solde = amountTTC
      }
      solde = parseFloat(solde)

      return { ...row, solde }
    })

    // setInvoicesData({ ...invoicesData, data: updatedData })
    setTotalAmount(totalAmountCurrent?.toFixed(2))

    return totalAmountCurrent?.toFixed(2)
  }

  const [selectAll, setSelectAll] = useState(false)
  useEffect(() => {
    var IDs = reglementData?.invoices?.map(row => row?.id)
    selectedIds?.length == IDs?.length && IDs?.length > 0 && setSelectAll(true)
  }, [selectedIds])

  const handleSelectAll = event => {
    var IDs = reglementData?.invoices?.map(row => row.id)

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
                      <Grid container>
                        <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant='body2'
                              style={{ display: 'flex', color: 'black' }}
                              sx={{ mr: 0, width: '180px' }}
                            >
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='tabler:number' fontSize={20} />
                                <div>Reference :</div>
                              </div>
                            </Typography>
                            <TextField
                              size='small'
                              value={reglementData?.reference}
                              sx={{ width: { sm: '240px', xs: '240px' } }}
                              InputProps={{
                                disabled: true

                                // startAdornment: <InputAdornment position='start'>#</InputAdornment>
                              }}
                            />
                          </Box>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant='body2'
                              style={{ display: 'flex', color: 'black' }}
                              sx={{ mr: 0, width: '180px' }}
                            >
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='ph:user' fontSize={20} />
                                <div>Client :</div>
                              </div>
                            </Typography>
                            <TextField
                              size='small'
                              value={reglementData?.client?.name}
                              style={{ color: 'black' }}
                              sx={{ width: { sm: '240px', xs: '240px' } }}
                              InputProps={{
                                disabled: true
                              }}
                            />
                          </Box>
                          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant='body2'
                              style={{ display: 'flex', color: 'black' }}
                              sx={{ mr: 0, width: '180px' }}
                            >
                              <div className='flex flex-row gap-2'>
                                <IconifyIcon icon='solar:calendar-date-linear' fontSize={20} />
                                <div>Date de creation :</div>
                              </div>
                            </Typography>
                            <TextField
                              size='small'
                              value={reglementData?.created_at}
                              sx={{ width: { sm: '240px', xs: '240px' } }}
                              InputProps={{
                                disabled: true
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xl={6} xs={12}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: { xl: 'flex-end', xs: 'flex-start' }
                            }}
                          >
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              <Typography variant='body2' sx={{ mr: 0, width: '180px', color: 'black' }}>
                                <div className='flex flex-row gap-2'>
                                  <IconifyIcon icon='tdesign:system-regulation' fontSize={20} />
                                  <div>Mode Regelment :</div>
                                </div>
                              </Typography>
                              <TextField
                                size='small'
                                value={reglementData?.mode_de_reglement?.entitled}
                                sx={{ width: { sm: '240px', xs: '240px' } }}
                                InputProps={{
                                  disabled: true
                                }}
                              />
                            </Box>
                            {(reglementData?.mode_de_reglement?.entitled === 'traite' ||
                              reglementData?.mode_de_reglement?.entitled === 'cheque') && (
                              <>
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', color: 'black' }}>
                                  <Typography
                                    variant='body2'
                                    sx={{ mr: 0, display: 'flex', width: '180px', color: 'black' }}
                                  >
                                    <div className='flex flex-row gap-2'>
                                      <IconifyIcon icon='mdi:close' fontSize={20} />
                                      <div>Date échéance :</div>
                                    </div>
                                  </Typography>
                                  <TextField
                                    size='small'
                                    value={reglementData?.date_echeance}
                                    sx={{ width: { sm: '240px', xs: '240px' } }}
                                    InputProps={{
                                      disabled: true
                                    }}
                                  />
                                </Box>
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                  <Typography
                                    variant='body2'
                                    style={{ display: 'flex' }}
                                    sx={{ mr: 0, display: 'flex', width: '180px', color: 'black' }}
                                  >
                                    <div className='flex flex-row gap-2'>
                                      <IconifyIcon icon='mdi:close' fontSize={20} />
                                      <div>Référance :</div>
                                    </div>
                                  </Typography>
                                  <TextField
                                    size='small'
                                    value={reglementData?.reference_cheque || reglementData?.reference_traite}
                                    sx={{ width: { sm: '240px', xs: '240px' } }}
                                    InputProps={{
                                      disabled: true
                                    }}
                                  />
                                </Box>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
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
                          {reglementData &&
                            reglementData?.invoices &&
                            reglementData?.invoices?.length > 0 &&
                            reglementData?.invoices?.map((row, index) => {
                              return (
                                <tr key={index}>
                                  <td class='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    <div class='inline-flex items-center gap-x-3'>
                                      {row.rest_a_payer ? (
                                        <input
                                          id='default-checkbox'
                                          type='checkbox'
                                          checked={selectedIds.includes(row.id) || selectAll}
                                          onChange={e => {
                                            handleChangeChecked(e, row)
                                          }}
                                          class='w-[20px] ml-2 h-[20px] cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                        ></input>
                                      ) : null}
                                      {/* <input
                                        id='default-checkbox'
                                        type='checkbox'
                                        checked={selectedIds.includes(row.id) || selectAll}
                                        onChange={e => {
                                          handleChangeChecked(e, row)
                                        }}
                                        class='w-[20px] ml-2 h-[20px] cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                      ></input> */}
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
                                    {reglementData?.montant > 0 ? (!row.solde ? 0 : row.solde) : row.amount_TTC_total}
                                  </td>
                                </tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                    {((reglementData && !reglementData?.invoices) ||
                      (reglementData && reglementData?.invoices && reglementData?.invoices?.length) == 0) && (
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
                        {reglementData?.montant ? reglementData?.montant : 0}
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
                        {totalAmount && reglementData?.montant && reglementData?.montant - totalAmount > 0
                          ? parseFloat(reglementData?.montant - totalAmount)?.toFixed(2)
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
                {/* <LoadingButton
                  loadingPosition='end'
                  endIcon={<IconifyIcon icon='mdi:send' />}
                  loading={createReglementMutation.isLoading}
                  variant='contained'
                  onClick={handleSubmit}
                  type='submit'
                >
                  Valider
                </LoadingButton> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </DatePickerWrapper>
  )
}

export default UpdateReglement
