import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetUsers } from 'src/services/users.service'
import { useState } from 'react'
import CompanyColumn from './CompanyColumn'
import { useGetCompanies } from 'src/services/companies.service'

const CompanyList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const companyColumn = CompanyColumn({ userRole: auth?.user?.role })

  /// **DATA
  const companiesQuery = useGetCompanies({
    paginated: true,
    page: page,
    pageSize: pageSize
  })
  const companiesData = companiesQuery?.data

  return (
    <CrudDataGrid
      query={companiesQuery}
      columns={companyColumn}
      data={companiesData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/companies/create'
      rousource='societies'
    />
  )
}

export default CompanyList
