// ** MUI Components
import Grid from '@mui/material/Grid'
import AboutOverivew from './AboutOverivew'
import ActivityTimeline from './ActivityTimeline'
import ConnectionsTeams from './ConnectionsTeams'
import ProfileTable from './ProjectsTable'

// ** Demo Components

const ProfileTab = ({ data }) => {
  return (
    <Grid container spacing={6} sx={{ marginTop: '5px' }}>
      <Grid item xl={4} md={5} xs={12}>
        <AboutOverivew about={[]} contacts={[]} teams={[]} overview={[]} />
      </Grid>
      <Grid item xl={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProfileTable data={data?.blocs || []} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileTab
