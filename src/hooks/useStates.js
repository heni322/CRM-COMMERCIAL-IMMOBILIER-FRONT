import { useContext } from 'react'
import { StateContext } from 'src/context/StateContext'

const useStates = () => {
  const { states, loading, getStateByModel, getPreferences, getStatesByModel } = useContext(StateContext)

  return {
    states,
    loading,
    getPreferences,
    getStateByModel,
    getStatesByModel
  }
}

export default useStates
