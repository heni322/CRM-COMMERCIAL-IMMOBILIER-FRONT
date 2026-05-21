import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import DossierColum from './DossierColum'
import { useGetDossier, useGetTodayDossiers } from 'src/services/dossier.service'
import { useGetstatesByModel } from 'src/services/states.service'
import { useGetUsers } from 'src/services/users.service'
import { useGetOperations } from 'src/services/operations.service'
import { useCreateInvoice } from 'src/services/invoices.service'
import { useRouter } from 'next/navigation'

const DossierList = ({
  clientId = false,
  filter,
  selection = false,
  addNewButton,
  generateButton,
  columnProfile = false,
  userId = false,
  showMyFolders = false,
  showTodayDossiers = false
}) => {
  const router = useRouter()

  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [selectionstate, setSelectionState] = useState(false)
  const [pageSize, setPageSize] = useState(50)
  const [search, setSearch] = useState('')
  const [state, setState] = useState(null)
  const [type, setType] = useState(null)

  // const [client, setClient] = useState({ id: clientId ? clientId : null })
  const [client, setClient] = useState(null)
  const [operation, setOperation] = useState(null)
  const [isBilled, setIsBilled] = useState(false)
  const [filterArray, setFilterArray] = useState([])
  const columns = columnProfile ? columnProfile : auth?.user?.role

  // **LIST COLUMNS
  const clientColumn = DossierColum({ userRole: columns })

  /// **DATA
  const dossiersQuery = useGetDossier({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    clientId: client?.id,
    userId: userId,
    filterState: filter,
    state: state?.id,
    isBilled: isBilled,
    today: showTodayDossiers,
    myFolders: showMyFolders,
    operation: operation?.id,
    type: type?.id
  })

  const statesQuery = useGetstatesByModel('DFolder')

  const statesData = statesQuery?.data
  const dossiersData = dossiersQuery?.data

  const clientsQuery = useGetUsers({
    role: 'client'
  })
  const clientsData = clientsQuery?.data
  const operationQuery = useGetOperations()
  const operationData = operationQuery?.data
  const createInvoiceMutation = useCreateInvoice()

  useEffect(() => {
    // if (statesQuery?.isSuccess) setStatesData(statesQuery?.data)
    if (auth?.user?.role !== 'accountant') {
      statesQuery?.isSuccess &&
        setFilterArray([
          {
            title: 'Selectionner un statu',
            option: 'entitled',
            setState: setState,
            state: state,
            data: statesData,
            all: true,
            width: 180
          }
        ])
    }
  }, [statesData, statesQuery?.isSuccess, state, auth])
  useEffect(() => {
    if (auth?.user?.role === 'accountant') {
      clientsQuery?.isSuccess &&
        setFilterArray([
          {
            title: 'Selectionner un statu',
            option: 'entitled',
            setState: setType,
            state: type,
            data: statesData?.filter(item => item?.state === 6 || item?.state === 0),
            all: true,
            width: 180
          },
          {
            title: 'Selectionner client',
            option: 'name',
            setState: setClient,
            state: client,
            data: clientsData,
            all: true,
            width: 250
          },
          {
            title: 'Selectionner Operation',
            option: 'name',
            setState: setOperation,
            state: operation,
            data: operationData,
            all: false,
            width: 180
          }
        ])
      setState(-1)

      // setIsBilled(0)
    }
  }, [auth, clientsData, type, statesData, clientsQuery?.isSuccess, client, operationData, operation])

  useEffect(() => {
    if (client?.id && client?.id !== 0 && operation?.id && operation?.id !== 0 && type?.id && type?.id !== 0) {
      setSelectionState(true)
    } else {
      setSelectionState(false)
    }
  }, [client, operation, type])

  const handleGenerateInvoices = async ids => {
    try {
      await createInvoiceMutation.mutateAsync({ folders: ids, type: type?.id })
      router.push('/invoices')
    } catch (error) {}
  }

  return (
    <CrudDataGrid
      query={dossiersQuery}
      columns={clientColumn}
      data={dossiersData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={addNewButton}
      generate={generateButton}
      showTodayDossiers={showTodayDossiers}
      addNewLink='/folders/create'
      rousource='folders'
      enableFilter={filter}
      filterArray={filterArray}
      selection={selection && selectionstate}
      generateLink='/invoices/create'
      generateResources='invoices'
      handleGenerate={handleGenerateInvoices}
      condition={0}
      generateButtonText={`Generer ${type?.entitled}`}
      conditionItem={'sold_out'}
    />
  )
}

export default DossierList
