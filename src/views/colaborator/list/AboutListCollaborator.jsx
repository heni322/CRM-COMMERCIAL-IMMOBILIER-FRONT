import { Typography, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { useGetGroupById } from 'src/services/groups.service'
import CustomAvatar from 'src/@core/components/mui/avatar'

const AboutListCollaborator = ({ client }) => {
  const collabGrp = useGetGroupById(client?.d_group_id)

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
    </>
  )
}

export default AboutListCollaborator
