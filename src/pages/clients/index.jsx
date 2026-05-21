import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import CLientList from 'src/views/clients/List'

const Clients = () => {
  return (
    <MainCard title='Liste des Clients' headerColor='primary.main' content={false}>
      {/* <CLientList /> */}
      <CLientList />
      {/* </CardContent> */}
    </MainCard>
  )
}

export default Clients
