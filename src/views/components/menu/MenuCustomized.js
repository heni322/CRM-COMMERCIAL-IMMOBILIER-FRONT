// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// Styled Menu component
const Menu = styled(MuiMenu)(({ theme, items }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  '&:focus': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white
    }
  }
}))

const MenuCustomized = ({ items, onSelectFile, close }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    if (onSelectFile) {
      onSelectFile()
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (close) handleClose()
  }, [close])

  return (
    <div>
      {items ? (
        <IconButton
          aria-label='menu'
          aria-haspopup='true'
          onClick={handleClick}
          aria-controls='customized-menu'
          color='primary' // Customize the color as needed
        >
          <Icon icon='mdi:dots-vertical' /> {/* Replace with your preferred icon */}
        </IconButton>
      ) : (
        <Button variant='outlined' aria-haspopup='true' onClick={handleClick} aria-controls='customized-menu'>
          Open Menu
        </Button>
      )}

      <Menu
        keepMounted
        elevation={0}
        anchorEl={anchorEl}
        id='customized-menu'
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {items ? (
          items?.map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              <ListItemIcon>
                <Icon icon={item.icon} fontSize={20} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))
        ) : (
          <>
            <MenuItem>
              <ListItemIcon>
                <Icon icon='mdi:send' fontSize={20} />
              </ListItemIcon>
              <ListItemText primary='Sent mail' />
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Icon icon='mdi:email-open' fontSize={20} />
              </ListItemIcon>
              <ListItemText primary='Drafts' />
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Icon icon='mdi:inbox-arrow-down' fontSize={20} />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}

export default MenuCustomized
