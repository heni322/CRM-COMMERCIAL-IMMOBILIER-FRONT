import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useGetDossier } from 'src/services/dossier.service'
import { useGenerateInvoicesArchive, useGetInvoices, useSendInvoiceEmail } from 'src/services/invoices.service'
import InvoiceColumn from './InvoiceColumn'
import moment from 'moment/moment'
import { useGetUsers } from 'src/services/users.service'

const InvoiceList = ({ payed = false, relance = false, state = false }) => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [user, setUser] = useState('')
  const [filterArray, setFilterArray] = useState([])
  const [date, setDate] = useState(null)
  const [client, setClient] = useState({ id: 0 })
  const [selectionstate, setSelectionState] = useState(false)

  // **LIST COLUMNS
  const invoiceColumn = InvoiceColumn({ type: payed })

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
    user: user,
    clientId: client?.id,
    payed: payed,
    relance: relance,
    state: state,
    date: moment(date)?.format('YYYY-MM-DD')
  })
  const invoicesData = invoicesQuery?.data
  const sendEmailMutation = useSendInvoiceEmail()
  const generateInvoicesMutation = useGenerateInvoicesArchive()

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

  const handleSendMails = async ids => {
    try {
      await sendEmailMutation.mutateAsync({ invoices: ids })
    } catch (error) {}
  }

  const handleDownload = async ids => {
    try {
      const response = await generateInvoicesMutation.mutateAsync({ invoices: ids }, { responseType: 'arraybuffer' })

      if (response) {
        // Create a Blob object from the response data
        const blob = new Blob([response], { type: 'application/zip' })

        // Create a download URL using the blob
        const url = window.URL.createObjectURL(blob)

        // Create an anchor element for the download
        const a = document.createElement('a')
        a.href = url
        a.download = 'downloaded.zip' // You can specify the file name

        // Trigger the download by simulating a click event
        a.click()

        // Revoke the download URL to release resources
        window.URL.revokeObjectURL(url)
      } else {

        // Handle the case when the API response is empty or missing data, e.g., show an error message.
      }
    } catch (error) {

      // Handle the error, e.g., display a toast message or provide a user-friendly error notification.
    }
  }

  useEffect(() => {
    if (client?.id && client?.id !== 0) {
      setSelectionState(true)
    } else {
      setSelectionState(false)
    }
  }, [client])

  return (
    <CrudDataGrid
      query={invoicesQuery}
      columns={invoiceColumn}
      data={invoicesData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={false}
      addNewLink='/invoices/create'
      rousource='invoices'
      filterArray={filterArray}
      enableFilter={true}
      generate={true}
      selection={selectionstate}
      generateLink='/invoices/create'
      generateResources='invoices'
      generateButtonText={`Envoyer email`}
      downloadButtonText={`Télécharger PDF`}
      handleGenerate={handleSendMails}
      handleDownload={handleDownload}
      condition={15}
      conditionItem={'p_state'}
    />
  )
}

export default InvoiceList
