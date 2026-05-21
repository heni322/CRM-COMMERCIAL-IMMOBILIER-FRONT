import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import { useAuth } from 'src/hooks/useAuth'
import CreateForm from 'src/views/companies/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateCompanie = () => {
  return (
    <MainCard title='Ajouter sociétés' headerColor='primary.main' backButton goBackLink='/companies'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateCompanie
