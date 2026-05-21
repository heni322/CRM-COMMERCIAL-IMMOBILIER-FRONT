import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetBlocs } from 'src/services/blocs.service'
import { memo, useState } from 'react'
import BlocColum from './BlocColum'

const BlocList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const blocColumn = BlocColum({ userRole: auth?.user?.role })

  /// **DATA
  const usersQuery = useGetBlocs({ paginated: true, page: page, pageSize: pageSize, search: search })
  const usersData = usersQuery?.data

  return (
    <CrudDataGrid
      query={usersQuery}
      columns={blocColumn}
      data={usersData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/blocs/create'
      rousource='blocs'
    />
  )
}

export default memo(BlocList)
