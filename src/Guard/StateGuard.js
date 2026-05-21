// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import useStates from 'src/hooks/useStates'

// ** Hooks Import

const StateGuard = props => {
  const { children, fallback } = props
  const { loading } = useStates()

  if (loading) {
    return fallback
  }

  return <>{children}</>
}

export default StateGuard
