import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import CreateForm from 'src/views/colaborator/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateClient = () => {
  return (
    <MainCard title='Ajouter Collaborateur' headerColor='primary.main' backButton goBackLink='/collaborators'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateClient
