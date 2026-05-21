import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import { useAuth } from 'src/hooks/useAuth'
import CreateForm from 'src/views/folder/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateClient = () => {
  return (
    <MainCard title='Ajouter Dossiers' headerColor='primary.main' backButton goBackLink='/folders'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateClient
