// ** React Imports
import { useState, useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import MainCard from 'src/components/MainCard'
import { useGetResidencesById } from 'src/services/residences.service'
import { Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import UpdateForm from '../forms/UpdateForm'

// ** Demo Components

const ResidenceUpdate = ({ residenceId }) => {
  // ** Authed User
  const auth = useAuth()

  // ** States
  const [desabledAssign, setDisabledAssign] = useState(true)
  const [desabledChangeState, setDisabledChangeState] = useState(true)
  const [hideEdit, setHideEdit] = useState(true)
  const [hideDelete, setHideDelete] = useState(true)

  // ** React Query
  const residenceQuery = useGetResidencesById({ residenceId: residenceId })
  const residenceData = residenceQuery?.data

  return (
    <MainCard
      title={` ${residenceData?.entitled}`}
      backButton
      goBackLink='/residences'
      secondary={<Button></Button>}
      headerColor='primary.main'

      // content={false}
    >
      <UpdateForm residenceData={residenceData} />
    </MainCard>
  )
}

export default ResidenceUpdate
