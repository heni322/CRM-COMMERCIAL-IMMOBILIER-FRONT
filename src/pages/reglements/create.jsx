import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import CreateForm from 'src/views/invoices/forms/CreateForm'
import CreateReglement from 'src/views/reglements/forms/createReglement'

// import MainCard from 'src/components/MainCard'

const CreateInvoice = () => {
  return (
    <MainCard title='Ajouter Reglement' headerColor='primary.main' backButton goBackLink='/reglements'>
      <CreateReglement />
    </MainCard>
  )
}

export default CreateInvoice
