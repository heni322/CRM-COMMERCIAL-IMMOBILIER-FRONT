// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import Calendar from 'src/components/Calendar/Calendar'
import SidebarLeft from 'src/components/Calendar/SidebarLeft'
import AddEventSidebar from 'src/components/Calendar/AddEventSidebar'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Actions
import {
  addEvent,
  fetchEvents,
  deleteEvent,
  updateEvent,
  handleSelectEvent,
  handleAllCalendars,
  handleCalendarsUpdate
} from 'src/store/apps/calendar'
import { useCreateAppointment, useGetAppointments } from 'src/services/appointments.service'
import UpdateEventSidebar from 'src/components/Calendar/UpdateEventSidebar'

// ** CalendarColors
const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const AppCalendar = ({ client, offer, resource }) => {
  // ** States
  const [calendarApi, setCalendarApi] = useState(null)
  const [statesFilter, setStatesFilter] = useState(null)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)
  const [updateEventSidebarOpen, setUpdateEventSidebarOpen] = useState(false)

  // ** Hooks
  const { settings } = useSettings()

  const getAppointmentsByClient = useGetAppointments({
    states: statesFilter,
    id: offer?.information?.id ?? client?.id,
    resource: resource
  })
  const appointmentsData = getAppointmentsByClient?.data

  // ** Vars
  const leftSidebarWidth = 260
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)
  const handleUpdateEventSidebarToggle = () => setUpdateEventSidebarOpen(!updateEventSidebarOpen)

  const handleSelectEvent = (state, action) => {
    setCurrentEvent(state)

    // state.selectedEvent = action.payload
  }

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6

        // ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        mdAbove={mdAbove}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        handleStatesFilter={data => setStatesFilter(data)}
        leftSidebarWidth={leftSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={handleAllCalendars}
        handleCalendarsUpdate={handleCalendarsUpdate}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
      <Box
        sx={{
          px: 5,
          pt: 3.75,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Calendar
          events={appointmentsData}
          offer={offer}
          direction={direction}
          updateEvent={updateEvent}
          calendarApi={calendarApi}
          setCalendarApi={setCalendarApi}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          handleUpdateEventSidebarToggle={handleUpdateEventSidebarToggle}
        />
      </Box>

      {updateEventSidebarOpen && (
        <UpdateEventSidebar
          client={client}
          offer={offer}
          updateEvent={updateEvent}
          currentEvent={currentEvent}
          deleteEvent={deleteEvent}
          calendarApi={calendarApi}
          drawerWidth={addEventSidebarWidth}
          handleSelectEvent={handleSelectEvent}
          updateEventSidebarOpen={updateEventSidebarOpen}
          handleUpdateEventSidebarToggle={handleUpdateEventSidebarToggle}
        />
      )}
      {addEventSidebarOpen && (
        <AddEventSidebar
          client={client}
          offer={offer}
          updateEvent={updateEvent}
          currentEvent={currentEvent}
          deleteEvent={deleteEvent}
          calendarApi={calendarApi}
          drawerWidth={addEventSidebarWidth}
          handleSelectEvent={handleSelectEvent}
          addEventSidebarOpen={addEventSidebarOpen}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        />
      )}
    </CalendarWrapper>
  )
}

export default AppCalendar
