import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import DossierList from 'src/views/folder/List'
import ReglementList from 'src/views/reglements/list'

const Invoice = () => {
  return (
    <MainCard title='Liste Des Reglements' headerColor='primary.main' content={false}>
      <ReglementList />
    </MainCard>
  )
}

export default Invoice
