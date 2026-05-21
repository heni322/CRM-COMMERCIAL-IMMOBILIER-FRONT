import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import ResidenceList from 'src/views/residences/List/index'

const Residences = () => {
  return (
    <MainCard title='Liste des Résidences' headerColor='primary.main' content={false} backButton>
      {/* <CardContent> */}
      <ResidenceList />
      {/* </CardContent> */}
    </MainCard>
  )
}

export default Residences
