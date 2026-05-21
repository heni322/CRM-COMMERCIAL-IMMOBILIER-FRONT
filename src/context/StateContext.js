import { createContext, useEffect, useState } from 'react'
import axiosClient from 'src/axiosClient'
import { useGetPreferences } from 'src/services/preferences.service'

const StateContext = createContext()

const StateProvider = ({ children }) => {
  const getPreferencesQuery = useGetPreferences()
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initState = async () => {
      await axiosClient
        .get('/states')
        .then(async response => {
          setStates([...response.data])
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
    initState()
  }, [])

  const getStateByModel = (model, state) => {
    return states.find(item => item.state === state && item.model === model)
  }

  const getStatesByModel = model => {
    return states.filter(item => item.model === model)
  }

  const getPreferences = () => {
    return getPreferencesQuery?.data
  }

  return (
    <StateContext.Provider value={{ states, loading, getStateByModel, getStatesByModel, getPreferences }}>
      {children}
    </StateContext.Provider>
  )
}

export { StateContext, StateProvider }
