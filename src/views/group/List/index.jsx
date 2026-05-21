import CrudDataGrid from 'src/components/CrudDataGrid'
import CLientColum from './GroupUsersColumn'
import { useAuth } from 'src/hooks/useAuth'
import { useGetUsers } from 'src/services/users.service'
import { useState } from 'react'
import { useGetGroupUsers } from 'src/services/groups.service'
import GroupUsersColumn from './GroupUsersColumn'

const GroupUsersList = ({ grpId }) => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const groupUsersColumns = GroupUsersColumn({ userRole: auth?.user?.role, groupId: grpId })

  /// **DATA
  const usersQuery = useGetGroupUsers({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    grpId: grpId
  })
  const usersData = usersQuery?.data

  return (
    <CrudDataGrid
      query={usersQuery}
      columns={groupUsersColumns}
      data={usersData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={false}
      addNewLink='/colaborator/create'
      rousource='users'
    />
  )
}

export default GroupUsersList
