import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'

// import MainCard from 'src/components/MainCard'
import CreateForm from 'src/views/clients/forms/Form'

const CreateClient = () => {
  return (
    <MainCard title='Ajouter Client' headerColor='primary.main' backButton goBackLink='/clients'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateClient
