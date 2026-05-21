// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'
import AboutOverivew from './AboutOverivew'
import CongeList from 'src/views/conges/List'
import MainCard from 'src/components/MainCard'
import { Button } from '@mui/material'
import { useState } from 'react'
import OfferDataTable from 'src/views/offers/List/DataTable'

const Profile = ({ data }) => {
  const [showTodayDossiers, setShowTodayDossiers] = useState(false)

  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item xl={12} md={5} xs={12}>
        <AboutOverivew data={data} />
      </Grid>
      <Grid item xl={7} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MainCard title={`Liste des offres`} headerColor='primary.main'>
              <OfferDataTable
                columnProfile='fiche_collaborator'
                filter={false}
                pageSizeParam={10}
                selection={false}
                disablePageSize={true}
                addNew={false}
                generateButton={false}
                showTodayDossiers={showTodayDossiers}
                collaboratorId={data?.id}
              />
            </MainCard>
            {/* <ProjectsTable /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default Profile
