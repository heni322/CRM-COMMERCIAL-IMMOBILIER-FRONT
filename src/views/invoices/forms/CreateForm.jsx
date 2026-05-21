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
import { useCreateInvoice, useGetHeaderTotal, useGetNextRefrence } from 'src/services/invoices.service'
import { useRouter } from 'next/router'
import { useGetClientArticles, useGetDossier } from 'src/services/dossier.service'
import { useGetPreferences } from 'src/services/preferences.service'
import { ArrayContext } from 'src/context/ArrayContext'
import { toast } from 'react-hot-toast'

const CreateForm = ({}) => {
  const router = useRouter()

  const { dataArray, setDataArray } = useContext(ArrayContext)

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const createInvoiceMutation = useCreateInvoice()
  const [items, setItems] = useState([])
  const [articles, setArticles] = useState([])
  const [invoiceNumber, setinvoiceNumber] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [date, setDate] = useState(new Date())
  const [object, setObject] = useState('Audit energétique')
  const [count, setCount] = useState(1)
  const [operation, setOperation] = useState(null)
  const [parsedArray, setParsedArray] = useState(null)
  const [numeroPiece, setNumeroPiece] = useState('')

  const dossiersQuery = useGetDossier({
    clientId: selectedClient?.id,
    state: -1,
    filterState: true,
    isBilled: 0,
    operation: operation
  })
  const clientArticlesData = dossiersQuery?.data
  const preferencesQeury = useGetPreferences()
  const preferencesData = preferencesQeury?.data
  const nextRefrenceQuery = useGetNextRefrence(selectedCompany?.id)
  const nextRefrenceData = nextRefrenceQuery?.data
  const headerTotalQeury = useGetHeaderTotal(items)
  const headerTotalData = headerTotalQeury?.data

  useEffect(() => {
    try {
      setParsedArray(JSON.parse(dataArray))
    } catch {}

    return () => {
      setDataArray([])
    }
  }, [])

  useEffect(() => {
    if (dossiersQuery?.isSuccess && !dossiersQuery.isFetching) {
      if (parsedArray.length !== 0) {
        setSelectedClient(parsedArray[0]?.client_object)
      }

      const newArray = parsedArray.map(obj => ({
        ...obj,
        designation_article: obj?.reference,
        tva_rate: preferencesData?.tva,
        qte: 1,
        discount: 0,
        d_folder_id: obj?.id
      }))

      setItems([...newArray])
      setArticles([...clientArticlesData])
      setCount(newArray?.length === 0 ? 1 : newArray?.length)
      newArray.length > 0 && setOperation(newArray[0]?.operation)
    }
  }, [dossiersQuery.isSuccess, dossiersQuery.isFetching])

  useEffect(() => {
    setinvoiceNumber(nextRefrenceData?.prochaine_prefacture)
    setNumeroPiece(nextRefrenceData?.prochaine_prefacture)
  }, [nextRefrenceData])
  useEffect(() => {
    setinvoiceNumber(nextRefrenceData?.prochaine_prefacture)
    setNumeroPiece(nextRefrenceData?.prochaine_prefacture)
  }, [nextRefrenceData])

  const handleSubmit = async () => {
    const filteredArray = items.filter(value => value !== undefined)

    const form = {
      object: object,
      client_id: selectedClient?.id,
      p_society_id: selectedCompany?.id,
      date_invoice: date,
      comment: '',
      num_piece: numeroPiece,
      invoiceLines: [...filteredArray]
    }

    try {
      await createInvoiceMutation.mutateAsync({ values: form })
      router.push('/invoices')
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            numeroPiece={numeroPiece}
            setNumeroPiece={setNumeroPiece}
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
            headerTotalQeury={headerTotalQeury}
            headerTotalData={headerTotalData}
            count={count}
            setCount={setCount}
            operation={operation}
            setOperation={setOperation}
            dossiersQuery={dossiersQuery}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions handleSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </DatePickerWrapper>
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

export default CreateForm
