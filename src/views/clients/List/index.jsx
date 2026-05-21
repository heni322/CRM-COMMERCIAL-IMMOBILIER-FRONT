import CrudDataGrid from 'src/components/CrudDataGrid'
import CLientColum from './CLientColum'
import { useAuth } from 'src/hooks/useAuth'
import { useGetClientCategories, useGetClientTypes, useGetClients, useGetUsers } from 'src/services/users.service'
import { memo, useEffect, useState } from 'react'

const CLientList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedCommercial, setSelectedCommercial] = useState()

  const [filterArray, setFilterArray] = useState([])

  // **LIST COLUMNS
  const clientColumn = CLientColum({ userRole: auth?.user?.role })

  /// **DATA
  const usersQuery = useGetClients({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    clientType: selectedType?.id,
    clientCategory: selectedCategory?.id,
    commercialId: selectedCommercial?.id,
    role: 'client'
  })
  const usersData = usersQuery?.data

  const userCategoriesQuery = useGetClientCategories()
  const userTypesQuery = useGetClientTypes()
  const commercialQuery = useGetUsers({ role: 'commercial' })

  useEffect(() => {
    setFilterArray([
      {
        title: 'Selectionner un Type',
        option: 'entitled',
        setState: setSelectedType,
        state: selectedType,
        data: userTypesQuery?.data,
        all: true,
        width: 180
      },
      {
        title: 'Selectionner une Catégorie',
        option: 'entitled',
        setState: setSelectedCategory,
        state: selectedCategory,
        data: userCategoriesQuery?.data,
        all: true,
        width: 250
      },
      {
        title: 'Selectionner un Commercial',
        option: 'name',
        setState: setSelectedCommercial,
        state: selectedCommercial,
        data: commercialQuery?.data,
        all: true,
        width: 250
      }
    ])
  }, [userTypesQuery?.isFetched, userCategoriesQuery?.isFetched, commercialQuery?.isFetched])

  return (
    <CrudDataGrid
      query={usersQuery}
      columns={clientColumn}
      data={usersData}
      page={page}
      setPage={setPage}
      enableFilter={true}
      filterArray={filterArray}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/clients/create'
      rousource='clients'
    />
  )
}

export default CLientList
