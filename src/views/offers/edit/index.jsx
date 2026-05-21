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
  const [residence, setResidence] = useState()
  const [desabledAssign, setDisabledAssign] = useState(true)
  const [desabledChangeState, setDisabledChangeState] = useState(true)
  const [hideEdit, setHideEdit] = useState(true)
  const [hideDelete, setHideDelete] = useState(true)

  const blocsQuery = useGetBlocsByResidenceId({ residenceId: residence?.id })
  const blocsData = blocsQuery?.data

  const residencesQuery = useGetResidences({ paginated: false, search: search })
  const residencesData = residencesQuery?.data

  const typesQuery = useGetLocalTypes({ paginated: true, page: page, pageSize: pageSize, search: search })
  const typesData = typesQuery?.data?.data

  // ** React Query
  const propertyQuery = useGetPropertyById(propertyId)
  const propertyData = propertyQuery?.data
  useEffect(() => {
    if (auth?.user?.resources?.find(item => item.resource_name === `edit locals`)?.authorized) {
      if (propertyData?.permissions?.edit) {
        setHideEdit(false)
        setDisabledAssign(propertyData?.state <= 1 && false)
        setDisabledChangeState(propertyData?.state == 7 && false)
      }
    }
    if (auth?.user?.resources?.find(item => item.resource_name === `delete locals`)?.authorized) {
      if (propertyData?.permissions?.delete) {
        setHideDelete(false)
      }
    }
  }, [propertyData, auth])

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
        residence={residence}
        residencesData={residencesData ? residencesData : []}
        setResidence={setResidence}
        typesData={typesData}
        propertyData={propertyData}
        blocsData={blocsData || []}
      />
    </MainCard>
  )
}

export default PropertyUpdate
