// ** Demo Components Imports
import HelpCenterArticle from 'src/views/pages/help-center/article'

const HelpCenterArticlePage = ({ article }) => {
  return <HelpCenterArticle articles={[]} activeArticle={article} activeSubcategory={null} />
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
      subcategory: params?.subcategory ?? null,
      article: params?.article ?? null
    }
  }
}

export default HelpCenterArticlePage