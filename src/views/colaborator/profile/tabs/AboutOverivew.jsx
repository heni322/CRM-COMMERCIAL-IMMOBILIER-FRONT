// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import AboutListCollaborator from '../../list/AboutListCollaborator'
import MainCard from 'src/components/MainCard'
import ContactListColaborator from '../../list/ContactListColaborator'

const renderTeams = arr => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: `${item.color}.main` }
          }}
        >
          <Icon icon='item.icon' />

          <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>
            {item.property?.charAt(0).toUpperCase() + item.property?.slice(1)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
          </Typography>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverivew = ({ data }) => {
  // const { teams, about, contacts, overview } = props

  return (
    <MainCard sx={{ minHeight: '100%' }} title={`Informations Générales`} headerColor='primary.main'>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ mb: 7 }}>
            <Typography variant='h6' sx={{ mb: 4, textTransform: 'uppercase' }}>
              A propos
            </Typography>
            <AboutListCollaborator client={data} />
          </Box>
          <Box sx={{ mb: 7 }}>
            <Typography variant='h6' sx={{ mb: 4, textTransform: 'uppercase' }}>
              Contact
            </Typography>
            <ContactListColaborator client={data} />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default AboutOverivew
