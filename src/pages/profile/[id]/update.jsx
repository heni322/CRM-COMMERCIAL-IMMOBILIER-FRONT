import { useRouter } from 'next/router'
import MainCard from 'src/components/MainCard'
import Form from 'src/views/clients/forms/Form'
import UpdateForm from 'src/views/profile/forms/UpdateForm'

const CreateClient = () => {
  const router = useRouter()
  const clientId = router?.query?.id

  return (
    <MainCard title='Réinitialiser le mot de passe' backButton goBackLink='/clients' headerColor='primary.main'>
      <UpdateForm clientId={clientId} />
    </MainCard>
  )
}

export default CreateClient
