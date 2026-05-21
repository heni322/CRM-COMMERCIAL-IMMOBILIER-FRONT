import { useRouter } from 'next/router'
import MainCard from 'src/components/MainCard'
import Form from 'src/views/clients/forms/Form'
import UpdateForm from 'src/views/clients/forms/UpdateForm'

const CreateClient = () => {
  const router = useRouter()
  const clientId = router?.query?.id

  return (
    <MainCard
      title='Editer Client'
      backButton
      goBackLink={`/clients/${clientId}/view/profile/`}
      headerColor='primary.main'
    >
      <UpdateForm clientId={clientId} />
    </MainCard>
  )
}

export default CreateClient
