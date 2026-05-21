// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ folder }) => {
  return <Email folder={folder} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { folder: 'inbox' } },
      { params: { folder: 'sent' } },
      { params: { folder: 'draft' } },
      { params: { folder: 'spam' } },
      { params: { folder: 'trash' } }
    ],
    fallback: false
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      folder: params?.folder
    }
  }
}

EmailApp.contentHeightFixed = true

export default EmailApp
