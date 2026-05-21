import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import DossierList from 'src/views/folder/List'
import InvoiceList from 'src/views/invoices/list'

const Invoice = () => {
  return (
    <MainCard title='Liste Des Factures' headerColor='primary.main' content={false}>
      <InvoiceList />
    </MainCard>
  )
}

export default Invoice
