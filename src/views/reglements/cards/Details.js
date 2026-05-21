// ** React Imports
import { useState, forwardRef, useEffect, memo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports

// import { useGetCompanies } from 'src/services/companies.service';

import { FormControl } from '@mui/material'
import { MONTANTHT, MONTANTHTNET, MONTANTTTC, PUHTNET, PUTTC, totalHeaderCalcule } from '../calculate/calcule'
import { DatePicker, DateTimePicker, frFR, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment/moment'
import { reference } from '@popperjs/core'
import IconifyIcon from 'src/@core/components/icon'
import Repeater from 'src/@core/components/repeater'
import { useGetUsers } from 'src/services/users.service'
import toast from 'react-hot-toast'

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

const getDistinctObjects = (array1, array2) => {
  const uniqueIds = new Set()
  const distinctArray = []

  // Process array1
  for (const obj of array1) {
    const id = obj?.id

    if (id && !uniqueIds.has(id)) {
      uniqueIds.add(id)
      distinctArray.push(obj)
    }
  }

  // Process array2 and remove common items
  for (const obj of array2) {
    const id = obj?.id

    if (id && !uniqueIds.has(id)) {
      uniqueIds.add(id)
      distinctArray.push(obj)
    } else if (id && uniqueIds.has(id)) {
      const index = distinctArray.findIndex(item => item.id === id)
      if (index !== -1) {
        distinctArray.splice(index, 1)
      }
    }
  }

  return distinctArray
}

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(5)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const Details = ({
  items,
  setItems,
  clientArticlesData,
  setClientArticlesData,
  preferencesData,
  count,
  setCount,
  disabled = false,
  totalHeader,
  setTotalHeader,
  reglementData,
  rest,
  setRest
}) => {
  // ** States
  const [localeArticles, setLocaleArticles] = useState([])

  useEffect(() => {
    setLocaleArticles([...getDistinctObjects(items, clientArticlesData)])
  }, [clientArticlesData, items])

  // ** Hook

  // ** Deletes form
  const deleteForm = async (e, i) => {
    e.preventDefault()
    const updatedItems = [...items]
    const item = updatedItems[i]
    updatedItems[i] = undefined
    const itemBack = (Array.isArray(clientArticlesData)?clientArticlesData:(clientArticlesData?.data??[])).find(checkItem => checkItem?.reference === item?.reference)
    setLocaleArticles(prev => [...prev, itemBack])

    // /* removed */
    setItems([...updatedItems])
    setRest(prev => prev + item?.amount_TTC_total)

    // @ts-ignore
    await e.target.closest('.repeater-wrapper').remove()

    // setCount(updatedItems.length)
  }

  const updateFields = (index, fieldName, fieldValue) => {
    const updatedItems = [...items]
    const newIndex = localeArticles?.findIndex(e => e?.id === fieldValue)
    const item = localeArticles[newIndex]
    const articles = [...localeArticles]
    if (rest === 0) {
      toast.error('m')

      return 0
    }

    articles.splice(index, 1)
    setLocaleArticles([...articles])
    updatedItems[index] = {
      ...updatedItems[index],
      ...item,
      rest_a_payer: rest - item?.amount_TTC_total >= 0 ? 0 : item?.amount_TTC_total - rest
    }
    setRest(prev => (prev - item?.amount_TTC_total <= 0 ? 0 : prev - item?.amount_TTC_total))
    setItems([...updatedItems])

    // setItems([...updatedItems])
  }

  return (
    <div className='bg-white rounded-lg p-6  shadow-lg ring-1 ring-gray-300'>
      <Card className='!bg-white'>
        <CardContent>
          <Grid container>
            <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' style={{ display: 'flex' }} sx={{ mr: 0, width: '180px' }}>
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
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' style={{ display: 'flex' }} sx={{ mr: 0, width: '180px' }}>
                  <div className='flex flex-row gap-2'>
                    <IconifyIcon icon='ph:user' fontSize={20} />
                    <div>Client :</div>
                  </div>
                </Typography>
                <TextField
                  size='small'
                  value={reglementData?.client?.name}
                  sx={{ width: { sm: '240px', xs: '240px' } }}
                  InputProps={{
                    disabled: true
                  }}
                />
              </Box>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant='body2' style={{ display: 'flex' }} sx={{ mr: 0, width: '180px' }}>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 0, width: '180px' }}>
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
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Typography variant='body2' sx={{ mr: 0, display: 'flex', width: '180px' }}>
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
                        sx={{ mr: 0, display: 'flex', width: '180px' }}
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
        </CardContent>

        <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

        <CardContent sx={{ pb: 2 }}>
          <Grid container justifyContent={'space-around'}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 0, width: '180px' }}>
                <div className='flex flex-row gap-2'>
                  <IconifyIcon
                    icon='streamline:money-cash-dollar-coin-accounting-billing-payment-cash-coin-currency-money-finance'
                    fontSize={20}
                  />
                  <div>MONTANT :</div>
                </div>
              </Typography>
              <span
                style={{
                  fontSize: '1.25rem',
                  color: '#212121'
                }}
              >
                {reglementData?.montant}
              </span>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 0, width: '180px' }}>
                <div className='flex flex-row gap-2'>
                  <IconifyIcon icon='streamline:money-cash-bag-bag-payment-cash-money-finance' fontSize={20} />
                  <div>RESTE :</div>
                </div>
              </Typography>
              <span
                style={{
                  fontSize: '1.25rem',
                  color: '#212121'
                }}
              >
                {rest}
              </span>
            </Box>
          </Grid>
        </CardContent>

        <Divider />

        <RepeaterWrapper>
          <Repeater ml={2} count={count}>
            {i => {
              const Tag = i === 0 ? Box : Collapse

              const item = items[i]

              // let LocalItems = [...items]
              // LocalItems.push(item)
              // setItems(LocalItems)

              return (
                <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                  <Grid container flex>
                    <RepeatingContent item xs={12}>
                      <Grid
                        container
                        alignItems={'center'}
                        justifyContent={'space-evenly'}
                        gap={0}
                        sx={{ py: 2, width: '100%', pr: { lg: 0, xs: 2 }, pl: { lg: 0, xs: 2 } }}
                        flex
                      >
                        <Grid item>
                          <Typography
                            variant='subtitle2'
                            className='col-title'
                            sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                          >
                            Factures
                          </Typography>
                          {!item?.reference ? (
                            <FormControl sx={{ minWidth: 200, ml: '1rem' }}>
                              <InputLabel>Facture</InputLabel>
                              <Select
                                displayEmpty
                                label='Facture'
                                size='small'
                                value={item?.id}
                                onChange={event => updateFields(i, 'p_operation_id', event?.target?.value)}
                              >
                                {localeArticles?.map(article => (
                                  <MenuItem key={article?.id} value={article?.id}>
                                    {article?.reference}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <>
                              <TextField
                                disabled
                                size='small'
                                sx={{ width: 200 }}
                                value={item?.reference}
                                InputProps={{ inputProps: { min: 0 } }}
                                InputLabelProps={{ shrink: true }}
                              />
                            </>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            variant='subtitle2'
                            className='col-title'
                            sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                          >
                            Montant TTC
                          </Typography>
                          <TextField
                            sx={{ width: 120 }}
                            disabled
                            size='small'
                            type='number'
                            value={item?.amount_TTC_total}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography
                            variant='subtitle2'
                            className='col-title'
                            sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                          >
                            Reste a payer
                          </Typography>
                          <TextField
                            sx={{ width: 120 }}
                            disabled
                            size='small'
                            type='number'
                            value={item?.rest_a_payer}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Grid>
                      </Grid>
                      <InvoiceAction>
                        {!disabled && (
                          <IconButton size='small' onClick={event => deleteForm(event, i)}>
                            <IconifyIcon icon='mdi:close' fontSize={20} />
                          </IconButton>
                        )}
                      </InvoiceAction>
                    </RepeatingContent>
                  </Grid>
                </Tag>
              )
            }}
          </Repeater>

          <Grid container sx={{ mt: 4.75 }}>
            <Grid item xs={12} sx={{ px: 0 }}>
              {!disabled && (
                <Button
                  disabled={rest === 0}
                  size='small'
                  variant='contained'
                  startIcon={<IconifyIcon icon='mdi:plus' fontSize={20} />}
                  onClick={() => {
                    setItems(prev => [
                      ...prev,
                      { nom: '', tva_rate: preferencesData?.taux_tva, qte: 0, remise: 0, p_operation_id: null }
                    ])
                    setCount(count + 1)
                  }}
                >
                  Ajouter Facture
                </Button>
              )}
            </Grid>
          </Grid>
        </RepeaterWrapper>

        {/* <Divider /> */}
      </Card>
    </div>
  )
}

export default Details
