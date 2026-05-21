// ** Demo Components Imports
import UserProfile from 'src/views/pages/user-profile/UserProfile'

const UserProfileTab = ({ tab }) => {
  return <UserProfile tab={tab} data={{}} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'profile' } },
      { params: { tab: 'teams' } },
      { params: { tab: 'projects' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      tab: params?.tab ?? null
    }
  }
}

export default UserProfileTab