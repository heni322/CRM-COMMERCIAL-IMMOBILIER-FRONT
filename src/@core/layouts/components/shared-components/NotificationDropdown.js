// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Services
import {
  useGetNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead
} from 'src/services/users.service'

import { Divider, Grid, ListItem, ListItemText } from '@mui/material'

// ─── Styled components ────────────────────────────────────────────────────────

const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: { width: '100%' }
  },
  '& .MuiMenu-list': { padding: 0 }
}))

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344
})

const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
  },
  '& .MuiListItem-root': { padding: 0 }
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return (
      <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    )
  }
  
return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children}
    </PerfectScrollbar>
  )
}

/**
 * Safely extract the notifications array from whatever shape the API returns.
 *
 * The backend controller returns:  { data: [ ...notifications ] }
 * React Query stores this as:      queryResult.data = { data: [...] }
 * So the array lives at:           queryResult.data.data
 *
 * This helper handles both that shape and a flat array, so the component
 * never crashes regardless of API response shape changes.
 */
function extractNotifications(queryData) {
  const raw = queryData?.data
  if (!raw) return []
  if (Array.isArray(raw)) return raw          // flat array shape
  if (Array.isArray(raw?.data)) return raw.data // { data: [...] } shape
  
return []
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationDropdown = ({ settings }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const { direction } = settings

  // ── Data ──────────────────────────────────────────────────────────────────
  const notificationsQuery          = useGetNotifications()
  const markOneAsRead               = useMarkNotificationAsRead()
  const markAllAsRead               = useMarkAllNotificationsAsRead()

  const notifications               = extractNotifications(notificationsQuery)
  const unread                      = notifications.filter(n => n?.read_at === null)

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDropdownOpen  = e => setAnchorEl(e.currentTarget)
  const handleDropdownClose = ()  => setAnchorEl(null)

  const handleMarkOne = async (id) => {
    if (!id) return
    await markOneAsRead.mutateAsync({ id })
  }

  const handleMarkAll = async () => {
    await markAllAsRead.mutateAsync()
    handleDropdownClose()
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='notifications-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={unread.length === 0}
          sx={{
            '& .MuiBadge-badge': {
              top: 4,
              right: 4,
              boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
            }
          }}
        >
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>

      <Menu
        id='notifications-menu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        {/* ── Header ── */}
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`${unread.length} Nouveau${unread.length !== 1 ? 'x' : ''}`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>

        {/* ── List ── */}
        <ScrollWrapper hidden={hidden}>
          {notificationsQuery.isLoading && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>Chargement…</Typography>
            </Box>
          )}

          {notificationsQuery.isSuccess && notifications.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='body2' color='text.secondary'>Aucune notification</Typography>
            </Box>
          )}

          {notifications.map((notification, index) => (
            <Fragment key={notification?.id ?? index}>
              <ListItemWrapper>
                <ListItem alignItems='center'>
                  <ListItemText
                    primary={
                      <Typography variant='subtitle2' fontWeight={notification?.read_at === null ? 700 : 400}>
                        {notification?.data?.titre ?? notification?.data?.title ?? 'Notification'}
                      </Typography>
                    }
                  />
                </ListItem>

                <Grid container direction='column'>
                  <Grid item xs={12} sx={{ pb: 1 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {notification?.data?.description ?? notification?.data?.body ?? ''}
                    </Typography>
                  </Grid>

                  {notification?.read_at === null && (
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Typography
                        variant='caption'
                        color='primary'
                        sx={{ cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => handleMarkOne(notification?.id)}
                      >
                        {markOneAsRead.isLoading ? 'En cours…' : 'Marquer comme lu'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ListItemWrapper>
              <Divider />
            </Fragment>
          ))}
        </ScrollWrapper>

        {/* ── Footer ── */}
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button
            fullWidth
            variant='contained'
            disabled={unread.length === 0 || markAllAsRead.isLoading}
            onClick={handleMarkAll}
          >
            {markAllAsRead.isLoading ? 'En cours…' : 'Tout marquer comme lu'}
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
