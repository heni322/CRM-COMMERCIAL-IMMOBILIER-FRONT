import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetOffers } from 'src/services/offers.service'
import { memo, useState } from 'react'
import { useGetResidences } from 'src/services/residences.service'
import OfferColumn from 'src/views/offers/List/OfferColumn'

const OfferList = ({
  clientId = false,
  propertyId = false,
  addNew = false,
  pageSizeParam = 10,
  disablePageSize = true
}) => {
  // **AUTH
  const auth = useAuth()

  // **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeParam)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const offerColumn = OfferColumn({ userRole: auth?.user?.role }) // Use OfferColumn instead of PropertyColumn

  // **DATA
  const offersQuery = useGetOffers({
    paginated: true,
    page: page,
    pageSize: pageSize,
    search: search,
    propertyId: propertyId,
    clientId: clientId
  }) // Use useGetOffers
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
      addNewLink='/offers/create' // Change to the correct link for creating offers
      resource='offers' // Correct the resource name
    />
  )
}

export default memo(OfferList)
