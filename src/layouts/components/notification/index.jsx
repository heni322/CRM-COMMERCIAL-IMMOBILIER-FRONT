import React, { useEffect } from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from 'axios'
import axiosClient from 'src/axiosClient'
import { useAuth } from 'src/hooks/useAuth'

const NotificationComponent = () => {
  const auth = useAuth()

  useEffect(() => {
    axiosClient
      .get('bba/xsrf-token')
      .then(response => {
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: 'cf22662af4ad4f9fc676',
          cluster: 'eu',
          forceTLS: false,
          withCredentials: true
        })

        window.Echo.channel('App.Models.User.' + auth?.user?.id).listen('manager-reminder', e => {
          console.log(e)
        })
      })
      .catch(err => {
        console.error('Failed to get CSRF token:', err)
      })
  })

  return (
    <div>
      <p>Waiting for notifications...</p>
    </div>
  )
}

export default NotificationComponent
