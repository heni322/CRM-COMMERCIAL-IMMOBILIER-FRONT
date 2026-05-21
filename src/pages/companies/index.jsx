import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import CompanyList from 'src/views/companies/list/list'

const companie = () => {
  return (
    <MainCard title='Liste des sociétés' headerColor='primary.main' content={false}>
      <CompanyList />
    </MainCard>
  )
}

export default companie
