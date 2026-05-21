import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import HelpCenterLandingHeader from 'src/views/pages/help-center/landing/HelpCenterLandingHeader'
import HelpCenterLandingFooter from 'src/views/pages/help-center/landing/HelpCenterLandingFooter'
import HelpCenterLandingKnowledgeBase from 'src/views/pages/help-center/landing/HelpCenterLandingKnowledgeBase'
import HelpCenterLandingArticlesOverview from 'src/views/pages/help-center/landing/HelpCenterLandingArticlesOverview'

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingTop: `${theme.spacing(20)} !important`,
  paddingBottom: `${theme.spacing(20)} !important`
}))

const HelpCenter = ({ apiData }) => (
  <Card>
    {apiData !== null ? (
      <>
        <HelpCenterLandingHeader data={apiData?.categories} allArticles={apiData?.allArticles} />
        <StyledCardContent><HelpCenterLandingArticlesOverview articles={apiData?.popularArticles} /></StyledCardContent>
        <StyledCardContent sx={{ backgroundColor: 'action.hover' }}><HelpCenterLandingKnowledgeBase categories={apiData?.categories} /></StyledCardContent>
        <StyledCardContent><HelpCenterLandingArticlesOverview articles={apiData?.keepLearning} /></StyledCardContent>
        <StyledCardContent sx={{ textAlign: 'center', backgroundColor: 'action.hover' }}><HelpCenterLandingFooter /></StyledCardContent>
      </>
    ) : null}
  </Card>
)

export const getStaticProps = () => {
  return { props: { apiData: null } }
}

export default HelpCenter