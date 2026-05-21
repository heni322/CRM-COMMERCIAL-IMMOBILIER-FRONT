// ** React Imports
import { useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// const CanViewNavLink = props => {
//   // ** Props
//   const { children, navLink } = props

//   // ** Hook
//   const ability = useContext(AbilityContext)

//   return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null
// }
const CanViewNavLink = props => {
  const { children, navLink } = props

  const auth = useAuth()

  // console.log(navLink)
  // console.log(
  //   ,
  //   'test'
  // )
  if (!navLink?.id) return <>{children}</>
  if (auth.user && auth?.user?.resources?.find(item => item.resource_name === `view ${navLink?.id}`)?.authorized) {
    return <>{children}</>
  } else {
    return null
  }

  // if (auth.user || (navLink && navLink.auth === false)) {
  //   return <>{children}</>
  // } else {
  //   return null
  // }
}

export default CanViewNavLink
