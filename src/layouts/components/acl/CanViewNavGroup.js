// ** React Imports
import { useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// code with acl module
// const CanViewNavGroup = props => {
//   // ** Props
//   const { children, navGroup } = props

//   // ** Hook
//   const ability = useContext(AbilityContext)

//   // ability.update([{ subject: 'all', actions: 'manage' }])

//   const checkForVisibleChild = arr => {
//     return arr.some(i => {
//       if (i.children) {
//         return checkForVisibleChild(i.children)
//       } else {
//         return ability?.can(i.action, i.subject)
//       }
//     })
//   }

//   const canViewMenuGroup = item => {
//     const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)
//     if (!(item.action && item.subject)) {
//       return hasAnyVisibleChild
//     }

//     return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
//   }

//   return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
// }
const CanViewNavGroup = props => {
  const { children, navGroup } = props

  const auth = useAuth()

  // console.log(navGroup)
  if (auth.user || (navGroup && navGroup.auth === false)) {
    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavGroup
