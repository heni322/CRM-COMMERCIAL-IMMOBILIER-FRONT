// ** Demo Components Imports
import HelpCenterSubcategory from 'src/views/pages/help-center/subcategory'

const HelpCenterSubcategoryPage = ({ category, subcategory }) => {
  return <HelpCenterSubcategory data={null} activeTab={subcategory} />
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
      category: params?.category ?? null,
      subcategory: params?.subcategory ?? null
    }
  }
}

export default HelpCenterSubcategoryPage