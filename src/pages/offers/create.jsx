import MainCard from 'src/components/MainCard'
import CreateForm from 'src/views/offers/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateBloc = () => {
  return (
    <MainCard title='Ajouter document' headerColor='primary.main' backButton goBackLink='/blocs'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateBloc
