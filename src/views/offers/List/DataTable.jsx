import { useGetOffers } from 'src/services/offers.service'
import OfferColumn from './OfferColumn'
import { useAuth } from 'src/hooks/useAuth'
import { useState } from 'react'
import CrudDataGrid from 'src/components/CrudDataGrid'

const OfferDataTable = ({
  nature,
  clientId = false,
  addNew = true,
  pageSizeParam = 25,
  disablePageSize = false,
  collaboratorId = false,
  columnProfile = 'list_offers',
  propertyId = false
}) => {

  // **AUTH
  const auth = useAuth()

  // **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeParam)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const offerColumn = OfferColumn({ userRole: auth?.user?.role, columnProfile }) // Use OfferColumn instead of PropertyColumn

  // **DATA
  const offersQuery = useGetOffers({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    nature: nature,
    clientId: clientId,
    collaboratorId,
    propertyId
  })
  const offersData = offersQuery?.data

  return (
    <CrudDataGrid
      query={offersQuery}
      columns={offerColumn}
      data={offersData}
      page={page}
      disablePageSize={disablePageSize}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNew={addNew}
      addNewLink='/offers/create'
      resource='offers'
    />
  )
}

export default OfferDataTable
