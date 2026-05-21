import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'

import ReglementColumn from './ReglementColumn'
import { useGetReglements } from 'src/services/reglements.service'
import moment from 'moment/moment'

const ReglementList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [filterArray, setFilterArray] = useState([])
  const [date, setDate] = useState(null)

  // **LIST COLUMNS
  const reglementColumn = ReglementColumn({})

  /// **DATA
  const reglementsQuery = useGetReglements({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    date: moment(date)?.format('YYYY-MM-DD')
  })
  const reglementsData = reglementsQuery?.data

  useEffect(() => {
    setFilterArray([
      {
        title: 'Selectionner Date',
        setState: setDate,
        state: date,
        type: 'date'
      }
    ])
  }, [auth, date])

  return (
    <CrudDataGrid
      query={reglementsQuery}
      columns={reglementColumn}
      data={reglementsData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={true}
      addNewLink='/reglements/create'
      rousource='reglements'
      filterArray={filterArray}
      enableFilter={true}
    />
  )
}

export default ReglementList
