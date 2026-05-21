import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import ColabList from '../../views/colaborator/list/list'

const collaborator = () => {
  return (
    <MainCard title='Liste des Collaborateurs' headerColor='primary.main' content={false}>
      {/* <CardContent> */}
      <ColabList />
      {/* </CardContent> */}
    </MainCard>
  )
}

export default collaborator
