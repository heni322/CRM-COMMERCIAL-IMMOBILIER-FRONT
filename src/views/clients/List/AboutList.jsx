import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'

const AboutList = client => {
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
        <Icon icon='mdi:account-outline' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Intitulée:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.name}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='mdi:account-outline' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Reference:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.reference}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='fluent:status-24-regular' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Statu:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.state?.entitled}</Typography>
        {/* <CustomChip rounded label={client?.state?.description} skin='light' color={client?.state?.color} /> */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='tabler:receipt-tax' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>Identifiant:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.tax_identifier}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '&:not(:last-of-type)': { mb: 4 },
          '& svg': { color: 'text.secondary' }
        }}
      >
        <Icon icon='tabler:receipt-tax' />

        <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>SIREN:</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{client?.siren_number}</Typography>
      </Box>
    </>
  )
}

export default AboutList
