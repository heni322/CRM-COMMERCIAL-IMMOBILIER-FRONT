// ** React Imports
import { useContext } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// const CanViewNavSectionTitle = props => {
//   // ** Props
//   const { children, navTitle } = props

//   // ** Hook
//   const ability = useContext(AbilityContext)

//   return ability && ability.can(navTitle?.action, navTitle?.subject) ? <>{children}</> : null
// }
const CanViewNavSectionTitle = props => {
  const { children, navTitle } = props

  const auth = useAuth()
  console.log(navTitle, 'title')

  if (auth.user || (navTitle && navTitle.auth === false)) {
    return <>{children}</>
  } else {
    return null
  }
}

export default CanViewNavSectionTitle
