import { useRouter } from 'next/router'
import { useGetResidencesById } from 'src/services/residences.service'
import Residence from 'src/views/residences/show/details'

// ** Demo Components Imports

const ResidenceView = () => {
  const router = useRouter()
  const residenceId = router.query?.id

  return <Residence />
}

export default ResidenceView
