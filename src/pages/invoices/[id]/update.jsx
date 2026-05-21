import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import MainCard from 'src/components/MainCard'
import EditForm from 'src/views/invoices/forms/EditForm'

// import MainCard from 'src/components/MainCard'

const UpdateInvoice = () => {
  const router = useRouter()
  const invoiceId = router?.query?.id

  return <EditForm invoiceId={invoiceId} />
}

export default UpdateInvoice
