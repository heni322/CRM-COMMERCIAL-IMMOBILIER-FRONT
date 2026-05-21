import { Typography, Box } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { useGetGroupById } from 'src/services/groups.service'
import CustomAvatar from 'src/@core/components/mui/avatar'
import IconTitleText from 'src/components/IconTitleText'

const AboutListClient = ({ client }) => {
  return (
    <>
      <IconTitleText icon='mdi:account-outline' title='Catégorie' text={client?.client_category?.entitled} />
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

      <IconTitleText
        icon='mdi:account-outline'
        title={client?.client_type_person?.entitled === 'Personne physique' ? 'Cin/Passport' : 'Identifiant fiscale'}
        text={client?.identifier_number}
      />
      <IconTitleText icon='mdi:account-outline' title='Nature' text={client?.client_type_person?.entitled} />
      <IconTitleText icon='mdi:account-outline' title='Commerciale' text={client?.commercial} />
    </>
  )
}

export default AboutListClient
