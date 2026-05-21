// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'
import CollabProfile from 'src/views/colaborator/profile'

// ** Demo Components Imports

const UserProfileTab = () => {
  const router = useRouter()

  return <CollabProfile tab={router.query.tab} userId={router.query.id} />
}

export default UserProfileTab
