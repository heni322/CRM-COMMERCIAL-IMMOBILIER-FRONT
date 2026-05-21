// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { Avatar } from '@mui/material'
import { useGetSubRoles } from 'src/services/role.service'
import { useAuth } from 'src/hooks/useAuth'
import moment from 'moment'
import Chip from 'src/components/CustomChip'
import useStates from 'src/hooks/useStates'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UserProfileHeader = ({ userData }) => {
  // ** State

  const designationIcon = userData?.designationIcon || 'mdi:briefcase-outline'
  const router = useRouter()
  const auth = useAuth()
  const { getStateByModel } = useStates()

  const state = useMemo(() => {
    const rowState = getStateByModel('User', userData?.state)

    return rowState
  }, [userData?.state, getStateByModel])

  return userData !== null ? (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image='/images/pages/profile-banner.png'
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture src='/images/avatars/1.png' alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 4, fontSize: '1.375rem' }}>
              {userData?.name}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon={designationIcon} />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{userData?.reference}</Typography>
              </Box>

              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:user-outline' />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Role: {userData?.role}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                <Icon icon='mdi:web' />
                <Chip
                  skin='light'
                  color={state?.color}
                  sx={{
                    fontWeight: '600',
                    fontSize: '.75rem',
                    height: '26px'
                  }}
                  label={state?.entitled}
                />
              </Box>
            </Box>
          </Box>

          <div sx={{ display: 'flex', gap: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                '& svg': { mr: 1, color: 'text.secondary' },
                marginBottom: '1.5rem'
              }}
            >
              {/* <Icon icon='mdi:calendar-blank-outline' sx /> */}
              <Typography sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 12 }}>
                Crée le {moment(userData?.created_at).format('DD-MM-YYYY')}
              </Typography>
            </Box>
            {auth?.user?.resources?.find(item => item.resource_name === `edit collaborators`)?.authorized && (
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:account-edit-outline' fontSize={20} />}
                onClick={() => {
                  router.push(`/collaborators/${userData?.id}/update`)
                }}
              >
                Modifier
              </Button>
            )}
          </div>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default UserProfileHeader
