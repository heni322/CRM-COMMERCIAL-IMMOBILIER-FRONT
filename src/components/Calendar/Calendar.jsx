// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import frLocale from '@fullcalendar/core/locales/fr'

import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useGetAppointment, useGetAppointmentsTypes, useUpdateAppointment } from 'src/services/appointments.service'
import moment from 'moment'
import useStates from 'src/hooks/useStates'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = props => {
  // ** Props
  const {
    eventContent,
    offer,
    events,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    handleUpdateEventSidebarToggle
  } = props

  const [currentEvent, setCurrentEvent] = useState()

  const getAppointment = useGetAppointment({ appId: currentEvent?.id })
  const appointmentData = getAppointment?.data
  const updateAppMutation = useUpdateAppointment()

  const getAppointmentsTypesQuery = useGetAppointmentsTypes()

  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const states = getStatesByModel('DOpointment')

  const onSubmit = async data => {
    let modifiedEvent = {
      id: +(data?.id ?? undefined),
      entitled: data?.title,
      start_date: moment(data?.start)?.format('YYYY-MM-DD hh:mm:ss'),
      end_date: moment(data?.end)?.format('YYYY-MM-DD hh:mm:ss'),
      d_document_header_id: offer?.information?.id ?? null,
      p_appointment_type_id:
        currentEvent?.p_appointment_type_id?.id ||
        (getAppointmentsTypesQuery?.data && getAppointmentsTypesQuery?.data?.length
          ? getAppointmentsTypesQuery?.data[0]?.id
          : null),
      state: currentEvent?.state?.state || (states && states?.length ? states[0]?.state : null),
      description: currentEvent?.description,
      d_client_id: appointmentData?.d_client_id
    }
    console.log(currentEvent)
    if (currentEvent?.id)
      modifiedEvent = {
        id: +(currentEvent?.id ?? 0),
        entitled: data?.title ? data?.title : appointmentData?.title,
        start_date: data?.start
          ? moment(data?.start)?.format('YYYY-MM-DD hh:mm:ss')
          : moment(appointmentData?.start)?.format('YYYY-MM-DD hh:mm:ss'),
        end_date: data?.end
          ? moment(data?.end)?.format('YYYY-MM-DD hh:mm:ss')
          : moment(appointmentData?.end)?.format('YYYY-MM-DD hh:mm:ss'),
        description: currentEvent?.description ? currentEvent?.description : appointmentData?.description,
        p_appointment_type_id: currentEvent?.p_appointment_type_id?.id
          ? currentEvent?.p_appointment_type_id?.id
          : appointmentData?.p_appointment_type_id,
        d_document_header_id: offer?.information?.id ?? null,

        state: currentEvent?.state?.state ? currentEvent?.state?.state : appointmentData?.state,
        d_client_id: appointmentData?.d_client_id
      }
    if (currentEvent?.id) {
      try {
        await updateAppMutation?.mutateAsync({ data: modifiedEvent, id: currentEvent?.id })
        handleSidebarClose()
      } catch (error) {}
    }
  }

  // ** Refs
  const calendarRef = useRef()
  if (events) {
    // ** calendarOptions(Props)
    const calendarOptions = {
      // eventContent: eventContent,
      events: events.length ? events : [],
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      locales: [frLocale],
      locale: 'fr',
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'sidebarToggle, prev, next, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      views: {
        week: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
        }
      },

      /*
            Enable dragging and resizing event
            ? Docs: https://fullcalendar.io/docs/editable
          */
      editable: true,

      /*
            Enable resizing event from start
            ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
          */
      eventResizableFromStart: true,

      /*
            Automatically scroll the scroll-containers during event drag-and-drop and date selecting
            ? Docs: https://fullcalendar.io/docs/dragScroll
          */
      dragScroll: true,

      /*
            Max number of events within a given day
            ? Docs: https://fullcalendar.io/docs/dayMaxEvents
          */
      dayMaxEvents: 2,

      /*
            Determines if day names and week names are clickable
            ? Docs: https://fullcalendar.io/docs/navLinks
          */
      navLinks: true,
      eventContent: function ({ event }) {
        return (
          <div
            className={` text-white p-2 w-full h-full rounded shadow-lg ${
              event.extendedProps?.specialEvent ? 'text-xl font-bold' : ''
            } ${event.backgroundColor ? event.backgroundColor : 'bg-gray-500'}`}
          >
            {event.title}
          </div>
        )
      },
      eventClick({ event: clickedEvent }) {
        console.log('eventClick')
        handleSelectEvent(clickedEvent)
        handleUpdateEventSidebarToggle()

        // * Only grab required field otherwise it goes in infinity loop
        // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
        // event.value = grabEventDataFromEventApi(clickedEvent)
        // isAddNewEventSidebarActive.value = true
      },
      customButtons: {
        sidebarToggle: {
          text: <Icon icon='mdi:menu' />,
          click() {
            handleLeftSidebarToggle()
          }
        }
      },
      dateClick(info) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true
        console.log(ev)

        handleSelectEvent(ev)
        handleAddEventSidebarToggle()
      },

      /*
            Handle event drop (Also include dragged event)
            ? Docs: https://fullcalendar.io/docs/eventDrop
            ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
          */
      eventDrop({ event: droppedEvent }) {
        console.log('drag', droppedEvent)
        setCurrentEvent(droppedEvent)
        updateEvent(droppedEvent)
        onSubmit(droppedEvent)
      },

      /*
            Handle event resize
            ? Docs: https://fullcalendar.io/docs/eventResize
          */
      eventResize({ event: resizedEvent }) {
        console.log('drag')
        updateEvent(resizedEvent)
      },
      ref: calendarRef,

      // Get direction from app state (store)
      direction
    }

    // @ts-ignore
    return <FullCalendar {...calendarOptions} />
  } else {
    return (
      <div class='flex justify-center items-center mt-10'>
        <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    )
  }
}

export default Calendar
