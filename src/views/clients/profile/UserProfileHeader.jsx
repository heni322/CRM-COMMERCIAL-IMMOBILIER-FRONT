// ** React Imports
import { useState, useEffect, Fragment, useRef, useMemo } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import toast from 'react-hot-toast'

// ** Third Party Imports
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import ButtonGroupSplit from 'src/views/components/button-group/ButtonGroupSplit'

// import { Tooltip } from '@mui/material'
import { Popover, PopoverContent, PopoverHandler, Tooltip } from '@material-tailwind/react'
import { useGenerateToken } from 'src/services/users.service'
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

const CLientProfileHeader = ({ clientData }) => {
  // ** State

  const designationIcon = clientData?.designationIcon || 'mdi:briefcase-outline'
  const router = useRouter()

  const { getStateByModel } = useStates()

  const state = useMemo(() => {
    const rowState = getStateByModel('User', clientData?.state)

    return rowState
  }, [clientData?.state, getStateByModel])

  return clientData !== null ? (
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
              {clientData?.name}
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
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{clientData?.reference}</Typography>
              </Box>
              <Box
                sx={{
                  mr: 4,
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  '& svg': { mr: 1, color: 'text.secondary' }
                }}
              >
                <Icon icon='mdi:web' />
                <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {clientData?.client_type?.entitled}
                </Typography>
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

          <div className='flex flex-col'>
            <div className='self-end'>
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
                  Crée le {moment(clientData?.created_at).format('DD-MM-YYYY')}
                </Typography>
              </Box>
            </div>
            <div className='flex flex-row gap-2'>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:account-edit-outline' fontSize={20} />}
                onClick={() => {
                  router.push(`/clients/${clientData?.id}/update`)
                }}
              >
                Modifier
              </Button>
            </div>
          </div>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default CLientProfileHeader
