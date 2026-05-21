// ** MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import useStates from 'src/hooks/useStates'
import { useState } from 'react'

const SidebarLeft = props => {
  const {
    mdAbove,
    calendarsColor,
    leftSidebarOpen,
    leftSidebarWidth,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
    handleStatesFilter,
    handleAddEventSidebarToggle
  } = props
  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()

    // dispatch(handleSelectEvent(null))
  }

  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const states = getStatesByModel('DOpointment')

  const [selectedItems, setSelectedItems] = useState([])
  console.log(selectedItems)

  // Function to handle checkbox change
  const handleCheckboxChange = (event, stateValue) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, stateValue])
      handleStatesFilter([...selectedItems, stateValue])
    } else {
      const updatedSelectedItems = selectedItems?.filter(selected => selected !== stateValue)
      setSelectedItems(updatedSelectedItems)
      handleStatesFilter(updatedSelectedItems)
    }
  }

  const handleViewAllChange = event => {
    if (event.target.checked) {
      const allStateValues = states?.map(item => item.state)
      setSelectedItems(allStateValues)
      handleStatesFilter(allStateValues)
    } else {
      setSelectedItems([])
      handleStatesFilter([])
    }
  }

  const renderFilters = states?.length
    ? states?.map((item, key) => (
        <FormControlLabel
          key={key}
          label={item?.entitled}
          sx={{ mb: 0.5 }}
          control={
            <Checkbox
              color={item.color}
              checked={selectedItems?.includes(item?.state)}
              onChange={event => handleCheckboxChange(event, item?.state)}
            />
          }
        />
      ))
    : null

  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 2,
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            borderRadius: 1,
            boxShadow: 'none',
            width: leftSidebarWidth,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderBottomRightRadius: 0,
            p: theme => theme.spacing(5),
            zIndex: mdAbove ? 2 : 'drawer',
            position: mdAbove ? 'static' : 'absolute'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        <Button fullWidth variant='contained' onClick={handleSidebarToggleSidebar}>
          Ajouter Evenement
        </Button>

        <Typography variant='body2' sx={{ mt: 7, mb: 2.5, textTransform: 'uppercase' }}>
          Calendriers
        </Typography>
        {/* "View All" checkbox */}
        <FormControlLabel
          label='Séléctioner tous'
          sx={{ mr: 0, mb: 0.5 }}
          control={
            <Checkbox
              color='secondary'
              checked={selectedItems?.length === states?.length}
              onChange={handleViewAllChange}
            />
          }
        />
        {renderFilters}
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
