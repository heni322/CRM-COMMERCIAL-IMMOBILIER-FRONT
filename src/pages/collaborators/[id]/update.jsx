import { useRouter } from 'next/router'
import MainCard from 'src/components/MainCard'
import UpdateForm from 'src/views/colaborator/forms/UpdateForm'

const UpdateCollaborator = () => {
  const router = useRouter()
  const colaboratorId = router?.query?.id

  return (
    <MainCard title='Modifier collaborateur' backButton goBackLink='/collaborators' headerColor='primary.main'>
      <UpdateForm colaboratorId={colaboratorId} />
    </MainCard>
  )
}

export default UpdateCollaborator
