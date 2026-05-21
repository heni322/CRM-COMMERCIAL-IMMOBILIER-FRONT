// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import AddActions from 'src/views/apps/invoice/add/AddActions'
import AddNewCustomers from 'src/views/apps/invoice/add/AddNewCustomer'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AddCard from '../cards/AddCard'
import {
  useCancelInvoice,
  useCreateInvoice,
  useCreateInvoiceAvoir,
  useGetHeaderTotal,
  useGetInvoiceById,
  useGetNextRefrence,
  useUpdateInvoice,
  useValidateInvoice
} from 'src/services/invoices.service'
import { useRouter } from 'next/router'
import { useGetClientArticles, useGetDossier } from 'src/services/dossier.service'
import { useGetPreferences } from 'src/services/preferences.service'
import { ArrayContext } from 'src/context/ArrayContext'
import { toast } from 'react-hot-toast'
import moment from 'moment/moment'
import InvoicePdfDialog from '../dialog/InvoicePdfDialog'
import MainCard from 'src/components/MainCard'
import { LoadingButton } from '@mui/lab'
import { useAuth } from 'src/hooks/useAuth'

const EditForm = ({ invoiceId }) => {
  const auth = useAuth()
  const router = useRouter()

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const createInvoiceAvoirMutation = useCreateInvoiceAvoir(invoiceId)
  const updateInvoiceMutation = useUpdateInvoice(invoiceId)
  const validateInvoiceMutation = useValidateInvoice(invoiceId)
  const cancelInvoiceMutation = useCancelInvoice(invoiceId)
  const [items, setItems] = useState([])
  const [articles, setArticles] = useState([])
  const [count, setCount] = useState(1)
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [date, setDate] = useState(new Date())
  const [showInvoice, setShowInvoice] = useState(false)
  const [object, setObject] = useState('')

  const [disabled, setDisabled] = useState(true)
  const [avoir, setAvoir] = useState(false)
  const [numeroPiece, setNumeroPiece] = useState('')
  const [operation, setOperation] = useState(null)

  const dossiersQuery = useGetDossier({
    clientId: selectedClient?.id,
    state: -1,
    filterState: true,
    isBilled: 0
  })
  const clientArticlesData = dossiersQuery?.data
  const preferencesQeury = useGetPreferences()
  const preferencesData = preferencesQeury?.data
  const nextRefrenceQuery = useGetNextRefrence()
  const nextRefrenceData = nextRefrenceQuery?.data
  const invoiceQuery = useGetInvoiceById(invoiceId)
  const invoiceData = invoiceQuery?.data
  const headerTotalQeury = useGetHeaderTotal(items)
  const headerTotalData = headerTotalQeury?.data
  useEffect(() => {
    if (invoiceQuery?.isSuccess) {
      if (
        invoiceData?.state?.state == 0 &&
        auth?.user?.resources?.find(item => item.resource_name === `edit invoices`)?.authorized
      ) {
        setDisabled(false)
      }
      if (invoiceData?.state?.state !== 0 && invoiceData?.nature?.nature === '1') {
        setAvoir(true)
      }
      setinvoiceNumber(invoiceData?.reference)
      setSelectedClient(invoiceData?.user)
      setSelectedCompany(invoiceData?.society)
      setObject(invoiceData?.object)
      setOperation(invoiceData?.operation)
      setNumeroPiece(invoiceData?.num_piece)

      setDate(new Date(moment(invoiceData?.date_invoice, 'YYYY-MM-DD HH:mm:ss').format()))
      invoiceQuery?.isSuccess && setItems([...invoiceData?.invoice_lines])
      dossiersQuery?.isSuccess && setArticles([...clientArticlesData])
      setCount(invoiceData?.invoice_lines?.length === 0 ? 1 : invoiceData?.invoice_lines?.length)
    }
  }, [dossiersQuery?.isSuccess, clientArticlesData, invoiceData, invoiceQuery?.isSuccess])

  // useEffect(() => {
  // }, [nextRefrenceData])
  const handlePrintInvoice = () => {
    const fileURL = `${process.env.REACT_APP_BASE_URL}/invoices/${invoiceId}/pdf`
    const link = document.createElement('a')
    link.href = fileURL
    link.target = '_blank'
    link.download = 'download.pdf'
    link.click()
  }

  const handleSubmit = async () => {
    const filteredArray = items.filter(value => value !== undefined)

    const form = {
      object: object,
      client_id: selectedClient?.id,
      p_society_id: selectedCompany?.id,
      date_invoice: moment(date, 'YYYY-MM-DD HH:mm:ss').format(),
      num_piece: numeroPiece,
      comment: '',
      invoiceLines: [...filteredArray]
    }

    try {
      await updateInvoiceMutation.mutateAsync(form)

      router.push('/invoices')
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <MainCard
      title='Editer Facture'
      headerColor='primary.main'
      backButton
      goBackLink='/invoices'
      secondary={
        <>
          {auth?.user?.resources?.find(item => item.resource_name === `edit invoices`)?.authorized && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {!disabled && (
                <>
                  <LoadingButton
                    loadingPosition='end'
                    loading={validateInvoiceMutation.isLoading}
                    onClick={async () => {
                      try {
                        await validateInvoiceMutation.mutateAsync()
                        router.push('/invoices')
                      } catch {}
                    }}
                    variant='contained'
                    type='submit'
                    sx={{
                      backgroundColor: '#2ea50d'
                    }}
                  >
                    Valider
                  </LoadingButton>
                  <LoadingButton
                    sx={{
                      backgroundColor: 'rgb(239, 68, 68)'
                    }}
                    loadingPosition='end'
                    loading={cancelInvoiceMutation.isLoading}
                    onClick={async () => {
                      try {
                        await cancelInvoiceMutation.mutateAsync()
                        router.push('/invoices')
                      } catch {}
                    }}
                    variant='contained'
                    type='submit'
                  >
                    Annuler
                  </LoadingButton>
                </>
              )}
              {/* {invoiceData?.state?.state === 1 && invoiceData?.nature?.nature === '1' && (
            <LoadingButton
              loadingPosition='end'
              loading={validateInvoiceMutation.isLoading}
              onClick={async () => {
                try {
                  await createInvoiceAvoirMutation.mutateAsync()
                  router.push('/invoices')
                } catch {}
              }}
              variant='contained'
              type='submit'
              sx={{
                backgroundColor: 'rgb(239, 68, 68)'
              }}
            >
              Facture AVoir
            </LoadingButton>
          )} */}
            </div>
          )}
        </>
      }
    >
      <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <AddCard
              dossiersQuery={dossiersQuery}
              numeroPiece={numeroPiece}
              setNumeroPiece={setNumeroPiece}
              operation={operation}
              setOperation={setOperation}
              disabled={disabled}
              items={items}
              setItems={setItems}
              invoiceNumber={invoiceNumber}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              date={date}
              setDate={setDate}
              object={object}
              setObject={setObject}
              clientArticlesData={articles}
              preferencesData={preferencesData}
              headerTotalData={headerTotalData}
              headerTotalQeury={headerTotalQeury}
              count={count}
              setCount={setCount}
            />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <AddActions
              auth={auth}
              disabled={disabled}
              edit={true}
              mainAction='Editer'
              handleSubmit={handleSubmit}
              showInvoice={showInvoice}
              setShowInvoice={setShowInvoice}
              printInvoice={handlePrintInvoice}
            />
          </Grid>
        </Grid>
      </DatePickerWrapper>
      <div style={{ width: 1300 }}>
        <InvoicePdfDialog reference={invoiceNumber} invoiceId={invoiceId} setOpen={setShowInvoice} open={showInvoice} />
      </div>
    </MainCard>
  )
}

export const getStaticProps = async () => {
  const clientResponse = await axios.get('/apps/invoice/clients')
  const apiClientData = clientResponse.data
  const allInvoicesResponse = await axios.get('/apps/invoice/invoices', { params: { q: '', status: '' } })
  const lastInvoiceNumber = Math.max(...allInvoicesResponse.data.allData.map(i => i.id))

  return {
    props: {
      apiClientData,
      invoiceNumber: lastInvoiceNumber + 1
    }
  }
}

export default EditForm
