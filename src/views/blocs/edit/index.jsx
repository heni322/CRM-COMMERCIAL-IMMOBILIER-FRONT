// ** React Imports

// ** Icon Imports
import MainCard from 'src/components/MainCard'
import { useGetBlocsById } from 'src/services/blocs.service'
import { Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { useGetResidences } from 'src/services/residences.service'
import UpdateForm from '../forms/UpdateForm'

// ** Demo Components

const BlocUpdate = ({ blocId }) => {
  // ** Authed User
  const BlocQuery = useGetBlocsById(blocId)
  const blocData = BlocQuery?.data
  const residencesQuery = useGetResidences({ paginated: true, page: '', pageSize: '' })
  const residencesData = residencesQuery?.data?.data

  return (
    <MainCard
      title={` ${blocData?.entitled}`}
      backButton
      goBackLink='/blocs'
      secondary={<Button></Button>}
      headerColor='primary.main'

      // content={false}
    >
      <UpdateForm blocData={blocData} residencesData={residencesData || []} />
    </MainCard>
  )
}

export default BlocUpdate
