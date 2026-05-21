// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ label }) => {
  return <Email label={label} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { label: 'personal' } },
      { params: { label: 'company' } },
      { params: { label: 'important' } },
      { params: { label: 'private' } }
    ],
    fallback: false
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      ...(params && params.label ? { label: params.label } : {})
    }
  }
}

EmailApp.contentHeightFixed = true

export default EmailApp
