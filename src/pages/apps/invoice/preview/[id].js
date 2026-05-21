// ** Demo Components Imports
import Preview from 'src/views/apps/invoice/preview/Preview'

const InvoicePreview = ({ id }) => {
  return <Preview id={id} />
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      id: params?.id ?? null
    }
  }
}

export default InvoicePreview