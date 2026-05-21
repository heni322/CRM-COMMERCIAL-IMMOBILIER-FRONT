// ** React Imports
import { useState, forwardRef, useEffect, memo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
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
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import { useGetUsers } from 'src/services/users.service'
import { useGetCompanies } from 'src/services/companies.service'
import { useCreateInvoice, useGetHeaderTotal, useGetNextRefrence } from 'src/services/invoices.service'
import { useGetClientArticles } from 'src/services/dossier.service'
import { FormControl } from '@mui/material'
import { MONTANTHT, MONTANTHTNET, MONTANTTTC, PUHTNET, PUTTC } from '../calculate/calcule'
import { useGetPreferences } from 'src/services/preferences.service'
import Image from 'next/image'

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
    marginTop: theme.spacing(12)
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

const AddCard = ({
  items,
  setItems,
  invoiceNumber,
  selectedClient,
  setSelectedClient,
  selectedCompany,
  setSelectedCompany,
  date,
  setDate,
  object,
  setObject,
  clientArticlesData,
  preferencesData,
  headerTotalData,
  headerTotalQeury,
  count,
  setCount,
  disabled = false,
  operation,
  setOperation,
  setNumeroPiece,
  numeroPiece,
  dossiersQuery
}) => {
  // ** States
  const [selected, setSelected] = useState('')
  const [localeArticles, setLocaleArticles] = useState([])

  // ** React Query
  const clientsQuery = useGetUsers({
    role: 'client'
  })
  const clientsData = clientsQuery?.data
  const companiesQuery = useGetCompanies({})
  const companiesData = companiesQuery?.data

  useEffect(() => {
    setLocaleArticles([...getDistinctObjects(items, clientArticlesData)])
  }, [clientArticlesData, items])

  // ** Hook
  const theme = useTheme()

  // ** Deletes form
  const deleteForm = async (e, i) => {
    e.preventDefault()
    const updatedItems = [...items]
    updatedItems[i] = undefined

    // /* removed */
    setItems([...updatedItems])

    // @ts-ignore
    await e.target.closest('.repeater-wrapper').remove()

    // setCount(updatedItems.length)
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === event.target.value)[0])
    }
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }

  const updateFields = (index, fieldName, fieldValue) => {
    const updatedItems = [...items]

    if (fieldName === 'd_folder_id') {
      const item = localeArticles?.find(e => e?.id === fieldValue)

      updatedItems[index] = {
        ...updatedItems[index],
        id: fieldValue,
        designation_article: item?.reference,
        name: item?.name,
        tva_rate: preferencesData?.tva,
        qte: 1,
        discount: 0,
        d_folder_id: fieldValue
      }

      // setLocaleArticles([...newLocaleARticles])
    } else {
      if (!(fieldName === 'designation_article')) {
        for (let index = 0; index < updatedItems.length; index++) {
          updatedItems[index] = {
            ...updatedItems[index],
            [fieldName]: fieldValue
          }
          updatedItems[index] = {
            ...updatedItems[index],
            price_unitaire_HTNet:
              updatedItems[index]?.price_unitaire_HT &&
              PUHTNET(updatedItems[index]?.price_unitaire_HT, updatedItems[index]?.discount)
          }
          updatedItems[index] = {
            ...updatedItems[index],
            price_unitaire_TTC:
              updatedItems[index]?.price_unitaire_HTNet &&
              updatedItems[index]?.tva_rate &&
              PUTTC(updatedItems[index]?.price_unitaire_HTNet, updatedItems[index]?.tva_rate)
          }
          updatedItems[index] = {
            ...updatedItems[index],
            amount_HT:
              updatedItems[index]?.price_unitaire_HT &&
              updatedItems[index]?.qte &&
              MONTANTHT(updatedItems[index]?.price_unitaire_HT, updatedItems[index]?.qte)
          }
          updatedItems[index] = {
            ...updatedItems[index],
            amount_HTNet:
              updatedItems[index]?.price_unitaire_HTNet &&
              updatedItems[index]?.qte &&
              MONTANTHTNET(updatedItems[index]?.price_unitaire_HTNet, updatedItems[index]?.qte)
          }
          updatedItems[index] = {
            ...updatedItems[index],
            amount_TTC:
              updatedItems[index]?.price_unitaire_TTC &&
              updatedItems[index]?.qte &&
              MONTANTTTC(updatedItems[index]?.price_unitaire_TTC, updatedItems[index]?.qte)
          }
          updatedItems[index] = {
            ...updatedItems[index],
            amount_TVA:
              updatedItems[index]?.amount_TTC &&
              updatedItems[index]?.amount_HTNet &&
              updatedItems[index]?.amount_TTC - updatedItems[index]?.amount_HTNet
          }
        }
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          [fieldName]: fieldValue
        }
      }
    }
    setItems([...updatedItems])

    // setItems([...updatedItems])
  }

  return (
    <>
      {dossiersQuery.isSuccess && !dossiersQuery.isFetching ? (
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                    {selectedCompany?.logo_url && (
                      <img src={selectedCompany?.logo_url} height={200} style={{ maxWidth: 500 }} alt='Logo' />
                    )}
                    {/* <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                  {themeConfig.templateName}
                </Typography> */}
                  </Box>
                  {/* <div>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Office 149, 450 South Brand Brooklyn
                </Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  San Diego County, CA 91905, USA
                </Typography>
                <Typography variant='body2'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div> */}
                </Box>
              </Grid>
              <Grid item xl={6} xs={12}>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}
                >
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 1, width: '105px' }}>
                      Reference
                    </Typography>
                    <TextField
                      size='small'
                      value={invoiceNumber}
                      sx={{ width: { sm: '250px', xs: '170px' } }}
                      InputProps={{
                        disabled: true,
                        startAdornment: <InputAdornment position='start'>#</InputAdornment>
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 1, width: '105px' }}>
                      N° Document:
                    </Typography>
                    <TextField
                      disabled={disabled}
                      onChange={event => setNumeroPiece(event?.target?.value)}
                      size='small'
                      value={numeroPiece}
                      sx={{ width: { sm: '250px', xs: '170px' } }}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>#</InputAdornment>
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 1, width: '105px' }}>
                      Operation:
                    </Typography>
                    <TextField
                      size='small'
                      value={operation?.name}
                      sx={{ width: { sm: '250px', xs: '170px' } }}
                      InputProps={{
                        disabled: true
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                      Date :
                    </Typography>
                    <DatePicker
                      disabled={disabled}
                      id='issue-date'
                      dateFormat='dd/MM/yyyy'
                      selected={date}
                      customInput={<CustomInput />}
                      onChange={date => setDate(date)}
                    />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                      Objet :
                    </Typography>
                    <TextField
                      disabled={disabled}
                      size='small'
                      value={object || 'Audit energitique'}
                      sx={{ width: { sm: '250px', xs: '170px' } }}
                      onChange={event => setObject(event?.target?.value)}
                    />
                  </Box>
                  {/* <Box sx={{ display: 'flex' }}>
                <Typography variant='body2' sx={{ mr: 2, width: '100px' }}>
                  Date Due:
                </Typography>
                <DatePicker
                  id='due-date'
                  selected={dueDate}
                  customInput={<CustomInput />}
                  onChange={date => setDueDate(date)}
                />
              </Box> */}
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

          <CardContent sx={{ pb: 2 }}>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={3} sm={3}>
                {!selectedCompany && !disabled && (
                  <>
                    <InputLabel>Societé</InputLabel>
                    <Select
                      defaultValue={selectedCompany}
                      displayEmpty
                      size='small'
                      value={selectedCompany}
                      onChange={event => setSelectedCompany(event?.target?.value)}
                      sx={{ mb: 4 }}
                    >
                      {(Array.isArray(companiesData) ? companiesData : (companiesData?.data ?? [])).map(company => (
                        <MenuItem key={company?.id} value={company}>
                          {company?.entitled}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
                {selectedCompany !== null && selectedCompany !== undefined ? (
                  <div>
                    <Typography
                      variant='body2'
                      sx={{ mr: 2, color: 'text.primary', fontWeight: 900, letterSpacing: '.25px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <span style={{ justifySelf: 'flex-start' }}>{`${selectedCompany?.entitled}`}</span>
                        {!disabled && (
                          <IconButton size='small' onClick={event => setSelectedCompany(null)}>
                            <Icon icon='mdi:close' color='wrong' fontSize={20} />
                          </IconButton>
                        )}
                      </div>
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {`${selectedCompany?.adress}`}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {`${selectedCompany?.zip_code} ${selectedCompany?.city}`}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {selectedCompany?.siren_number && `N° Siret: ${selectedCompany?.siren_number}`}
                    </Typography>
                  </div>
                ) : null}
              </Grid>
              <Grid
                item
                xs={3}
                sm={3}
                sx={{
                  mb: { lg: 0, xs: 4 }
                }}
              >
                {!selectedClient && (
                  <Select
                    size='small'
                    value={selectedClient}
                    onChange={event => setSelectedClient(event?.target?.value)}
                    sx={{ mb: 4 }}
                  >
                    {clientsQuery?.isSuccess &&
                      (Array.isArray(clientsData) ? clientsData : (clientsData?.data ?? [])).map(client => (
                        <MenuItem key={client.name} value={client}>
                          {client.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                {selectedClient !== null && selectedClient !== undefined ? (
                  <div>
                    <Typography
                      variant='body2'
                      sx={{ mr: 2, color: 'text.primary', fontWeight: 900, letterSpacing: '.25px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <span style={{ justifySelf: 'flex-start' }}>{`${selectedClient?.name}`}</span>
                        {!disabled && (
                          <IconButton size='small' onClick={event => setSelectedClient(null)}>
                            <Icon icon='mdi:close' color='wrong' fontSize={20} />
                          </IconButton>
                        )}
                      </div>
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {`${selectedClient?.address}`}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {`${selectedClient?.zip_code} ${selectedClient?.city}`}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {selectedClient?.siren_number && `SIREN : ${selectedClient?.siren_number}`}
                    </Typography>
                  </div>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ mb: theme => `${theme.spacing(1.25)} !important` }} />

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
                          gap={2}
                          sx={{ py: 2, width: '100%', pr: { lg: 0, xs: 2 }, pl: { lg: 0, xs: 2 } }}
                          flex
                        >
                          <Grid item>
                            <Typography
                              variant='subtitle2'
                              className='col-title'
                              sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                            >
                              Dossier
                            </Typography>
                            {!item?.d_folder_id ? (
                              <FormControl sx={{ minWidth: 120, ml: '1rem' }}>
                                <InputLabel>Dossier</InputLabel>
                                <Select
                                  displayEmpty
                                  label='Dossier'
                                  size='small'
                                  value={item?.d_folder_id}
                                  onChange={event => updateFields(i, 'd_folder_id', event?.target?.value)}
                                >
                                  {localeArticles?.map(article => (
                                    <MenuItem key={article?.id} value={article?.id}>
                                      {article?.name}
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
                                  value={item?.name || item?.folder?.name}
                                  InputProps={{ inputProps: { min: 0 } }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </>
                            )}
                          </Grid>
                          <Grid item>
                            {/* <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Designation
                        </Typography> */}
                            <TextField
                              disabled={disabled}
                              label='Designation'
                              onChange={event => updateFields(i, 'designation_article', event?.target?.value)}
                              size='small'
                              sx={{ width: 200 }}
                              value={item?.designation_article}
                              InputProps={{ inputProps: { min: 0 } }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <Typography
                              variant='subtitle2'
                              className='col-title'
                              sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                            >
                              Quentité
                            </Typography>
                            <TextField
                              disabled={disabled}
                              label='Qte'
                              onChange={event => updateFields(i, 'qte', parseInt(event?.target?.value))}
                              size='small'
                              type='number'
                              sx={{ width: 70 }}
                              value={item?.qte}
                              InputProps={{ inputProps: { min: 0 } }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            {/* <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Prix Unitaire HT
                        </Typography> */}
                            <TextField
                              disabled={disabled}
                              label='PU HT'
                              onChange={event => {
                                const inputValue = event.target.value
                                const numbersOnly = inputValue.replace(/[^0-9.]/g, '')
                                updateFields(i, 'price_unitaire_HT', parseFloat(numbersOnly) || 0)
                              }}
                              size='small'
                              sx={{ width: 100 }}
                              value={item?.price_unitaire_HT}
                              InputProps={{ inputProps: { min: 0 } }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            {/* <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Remise
                        </Typography> */}
                            <TextField
                              disabled={disabled}
                              label='Remise'
                              onChange={event => {
                                const inputValue = event.target.value
                                const numbersOnly = inputValue.replace(/[^0-9.]/g, '')
                                updateFields(i, 'discount', parseFloat(numbersOnly) || 0)
                              }}
                              size='small'
                              sx={{ width: 80 }}
                              value={item?.discount}
                              InputProps={{
                                inputProps: { min: 0 },
                                endAdornment: <InputAdornment position='end'>%</InputAdornment>
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          {/* <Grid item> */}
                          {/* <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Tva
                        </Typography> */}
                          {/* <TextField
                          label='TVA'
                          sx={{ width: 80 }}
                          onChange={event => {
                            const inputValue = event.target.value
                            const numbersOnly = inputValue.replace(/[^0-9.]/g, '')
                            updateFields(i, 'tva_rate', numbersOnly)
                          }}
                          size='small'
                          value={item?.tva_rate}
                          InputProps={{
                            inputProps: { min: 0 },
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>
                          }}
                        />
                      </Grid> */}
                          {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          PU HTNet
                        </Typography>
                        <TextField
                          disabled
                          size='small'
                          sx={{ width: 100 }}
                          value={item?.price_unitaire_HTNet}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                          {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          PU TTC
                        </Typography>
                        <TextField
                          disabled
                          sx={{ width: 100 }}
                          size='small'
                          value={item?.price_unitaire_TTC}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                          {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant HT
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_HT}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                          <Grid item>
                            <Typography
                              variant='subtitle2'
                              className='col-title'
                              sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                            >
                              Montant HTNet
                            </Typography>
                            <TextField
                              sx={{ width: 120 }}
                              disabled
                              size='small'
                              type='number'
                              value={item?.amount_HTNet}
                              InputProps={{ inputProps: { min: 0 } }}
                            />
                          </Grid>
                          {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant tva
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_TVA}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                          {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant TTC
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_TTC}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                        </Grid>
                        <InvoiceAction>
                          {!disabled && (
                            <IconButton size='small' onClick={event => deleteForm(event, i)}>
                              <Icon icon='mdi:close' fontSize={20} />
                            </IconButton>
                          )}
                        </InvoiceAction>
                      </RepeatingContent>
                    </Grid>
                  </Tag>
                )
              }}
            </Repeater>

            {/* <Grid container sx={{ mt: 4.75 }}>
              <Grid item xs={12} sx={{ px: 0 }}>
                {!disabled && (
                  <Button
                    size='small'
                    variant='contained'
                    startIcon={<Icon icon='mdi:plus' fontSize={20} />}
                    onClick={() => setCount(count + 1)}
                  >
                    Ajouter Ligne
                  </Button>
                )}
              </Grid>
            </Grid> */}
          </RepeaterWrapper>

          <Divider />

          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    variant='body2'
                    sx={{ mr: 2, color: 'text.primary', fontWeight: 900, letterSpacing: '.25px' }}
                  >
                    COORDONNEES BANCAIRES :
                  </Typography>
                  <Typography variant='body2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    IBAN : {selectedCompany?.iban}
                  </Typography>
                  <Typography variant='body2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    BIC : {selectedCompany?.bic}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
                <CalcWrapper>
                  <Typography variant='body2'>Montant HT:</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                    {headerTotalQeury?.isSuccess
                      ? Math.round((headerTotalData?.amount_HT_total + Number.EPSILON) * 100) / 100
                      : 0}
                  </Typography>
                </CalcWrapper>
                <CalcWrapper>
                  <Typography variant='body2'>Remise:</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                    {/* {headerTotalData?.amount_discount} */}
                    {/* {Math.round((headerTotalData?.amount_discount + Number.EPSILON) * 100) / 100} */}
                    {headerTotalQeury?.isSuccess
                      ? Math.round((headerTotalData?.amount_discount + Number.EPSILON) * 100) / 100
                      : 0}
                  </Typography>
                </CalcWrapper>
                <CalcWrapper>
                  <Typography variant='body2'>Tva:</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                    {preferencesData?.tva}
                  </Typography>
                </CalcWrapper>
                <Divider
                  sx={{
                    mt: theme => `${theme.spacing(6)} !important`,
                    mb: theme => `${theme.spacing(1.5)} !important`
                  }}
                />
                <CalcWrapper>
                  <Typography variant='body2'>Total:</Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                    {/* {headerTotalData?.amount_TTC_total} */}
                    {headerTotalQeury?.isSuccess
                      ? Math.round((headerTotalData?.amount_TTC_total + Number.EPSILON) * 100) / 100
                      : 0}
                  </Typography>
                </CalcWrapper>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

          <CardContent sx={{ pt: 4 }}>
            <InputLabel htmlFor='invoice-note'>Pieds de page:</InputLabel>
            <TextField
              disabled
              rows={2}
              fullWidth
              multiline
              id='invoice-note'
              sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              defaultValue={selectedCompany?.footer1}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xl={6} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant='rect' width={200} height={200} style={{ marginRight: '16px' }} />
                    <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                      {/* {themeConfig.templateName} */}
                      <Skeleton width={100} />
                    </Typography>
                  </Box>
                  {/* ... */}
                </Box>
              </Grid>
              <Grid item xl={6} xs={12}>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}
                >
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ mr: 1, width: '105px' }}>
                      Reference
                    </Typography>
                    <Skeleton width={150} />
                  </Box>
                  {/* ... */}
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

          <CardContent sx={{ pb: 2 }}>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={3} sm={3}>
                {/* ... */}
              </Grid>
              <Grid item xs={3} sm={3}>
                {/* ... */}
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ mb: theme => `${theme.spacing(1.25)} !important` }} />

          <Box sx={{ px: 2 }}>
            <Grid container flex>
              <Grid item>
                <Typography
                  variant='subtitle2'
                  className='col-title'
                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                >
                  Dossier
                </Typography>
                <Skeleton width={100} />
              </Grid>
              <Grid item>
                <Typography
                  variant='subtitle2'
                  className='col-title'
                  sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                >
                  Designation
                </Typography>
                <Skeleton width={100} />
              </Grid>
              {/* ... Add Skeletons for other fields ... */}
            </Grid>
          </Box>

          <Divider />

          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={9}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    variant='body2'
                    sx={{ mr: 2, color: 'text.primary', fontWeight: 900, letterSpacing: '.25px' }}
                  >
                    COORDONNEES BANCAIRES :
                  </Typography>
                  <Typography variant='body2' sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                    IBAN : <Skeleton width={100} />
                  </Typography>
                  {/* ... */}
                </Box>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ mb: { sm: 0 } }}>
                <Skeleton variant='rect' width={100} height={30} />
                {/* ... */}
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

          <CardContent sx={{ pt: 4 }}>
            <InputLabel htmlFor='invoice-note'>Pieds de page:</InputLabel>
            <Skeleton variant='rect' width='100%' height={40} />
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default AddCard
