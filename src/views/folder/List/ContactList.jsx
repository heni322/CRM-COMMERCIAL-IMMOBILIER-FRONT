import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'

const ContactList = client => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='mdi:phone-outline' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Numéro de Téléphone 1:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.phone_number}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='mdi:phone-outline' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Numéro de Téléphone 2:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.phone_number_2}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='ic:outline-email' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Email:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.email}</Typography>
      </Box>
    </>
  )
}

export default ContactList
