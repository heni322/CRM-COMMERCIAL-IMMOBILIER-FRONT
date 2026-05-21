import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetUsers } from 'src/services/users.service'
import { useState } from 'react'
import ColaboratorColumn from './ColaboratorColumn'

const ColabList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const clientColumn = ColaboratorColumn({ userRole: auth?.user?.role })

  /// **DATA
  const usersQuery = useGetUsers({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    role: 'commercial,admin',
    notMe: true
  })
  const usersData = usersQuery?.data

  return (
    <CrudDataGrid
      query={usersQuery}
      columns={clientColumn}
      data={usersData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/collaborators/create'
      rousource='users'
    />
  )
}

export default ColabList
