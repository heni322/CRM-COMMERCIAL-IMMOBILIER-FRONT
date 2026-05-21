// ** Icon Imports
import { Box, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'

const IconTitleText = ({ icon, title, text }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        '&:not(:last-of-type)': { mb: 4 },
        '& svg': { color: 'text.secondary' }
      }}
    >
      <Icon icon={icon} />

      <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>{title}:</Typography>
      <Typography sx={{ color: 'text.secondary' }}>{text}</Typography>
    </Box>
  )
}

export default IconTitleText
