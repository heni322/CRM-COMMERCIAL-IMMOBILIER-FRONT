// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import MainCard from 'src/components/MainCard'
import AboutListCollaborator from 'src/views/colaborator/list/AboutListCollaborator'
import ContactList from '../../List/ContactList'
import AboutListClient from '../../List/AboutListClient'
import IconTitleText from 'src/components/IconTitleText'

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
      <Box sx={{ mb: 7 }}>
        <Typography variant='h6' sx={{ mb: 4, textTransform: 'uppercase' }}>
          A propos
        </Typography>
        <AboutListClient client={data} />
      </Box>
      <Box sx={{ mb: 7 }}>
        <Typography variant='h6' sx={{ mb: 4, textTransform: 'uppercase' }}>
          Contact
        </Typography>
        <ContactList client={data} />
      </Box>
      <Box sx={{ mb: 7 }}>
        <Typography variant='h6' sx={{ mb: 4, textTransform: 'uppercase' }}>
          Person de Contact
        </Typography>

        <IconTitleText icon='mdi:account-outline' title='Intitulée' text={data?.contact} />
        <IconTitleText icon='mdi:phone-outline' title='Numéro de Téléphone' text={data?.contact_number} />
      </Box>
      {/* <div>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Teams
              </Typography>
              {renderTeams(teams)}
            </div> */}
    </MainCard>
  )
}

export default AboutOverivew
