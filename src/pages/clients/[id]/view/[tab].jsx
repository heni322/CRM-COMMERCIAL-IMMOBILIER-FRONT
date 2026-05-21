// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'
import UserProfile from 'src/views/clients/profile'

// ** Demo Components Imports

const UserProfileTab = () => {
  const router = useRouter()

  return <UserProfile tab={router.query.tab} clientId={router.query.id} />
}

export default UserProfileTab
