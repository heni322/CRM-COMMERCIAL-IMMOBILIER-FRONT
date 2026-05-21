import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import CreateForm from 'src/views/invoices/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateInvoice = () => {
  return (
    <MainCard title='Ajouter Facture' headerColor='primary.main' backButton goBackLink='/invoices'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateInvoice
