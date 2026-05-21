// ** React Imports
import { useState, useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import MainCard from 'src/components/MainCard'
import { useGetPropertyById } from 'src/services/properties.service'
import { Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import UpdateForm from '../forms/UpdateForm'
import { useGetBlocs, useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'
import { useGetLocalTypes } from 'src/services/type-locals.service'

// ** Demo Components

const PropertyUpdate = ({ propertyId }) => {
  // ** Authed User
  const auth = useAuth()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // ** React Query
  const propertyQuery = useGetPropertyById(propertyId)
  const propertyData = propertyQuery?.data

  return (
    <MainCard
      title={` ${propertyData?.entitled}`}
      backButton
      goBackLink='/properties'
      secondary={<Button></Button>}
      headerColor='primary.main'

      // content={false}
    >
      <UpdateForm
        propertyData={propertyData}
        propertyDataIsFetching={propertyQuery.isFetching}
        propertyDataIsSuccess={propertyQuery.isSuccess}
      />
    </MainCard>
  )
}

export default PropertyUpdate
