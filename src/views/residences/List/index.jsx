import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetResidences } from 'src/services/residences.service'
import { memo, useState } from 'react'
import ResidenceColumn from './ResidenceColumn'

const ResidenceList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const residenceColumn = ResidenceColumn({ userRole: auth?.user?.role })

  /// **DATA
  const usersQuery = useGetResidences({ paginated: true, page: page, pageSize: pageSize, search: search })
  const usersData = usersQuery?.data

  return (
    <CrudDataGrid
      query={usersQuery}
      columns={residenceColumn}
      data={usersData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/residences/create'
      rousource='residences'
    />
  )
}

export default memo(ResidenceList)
