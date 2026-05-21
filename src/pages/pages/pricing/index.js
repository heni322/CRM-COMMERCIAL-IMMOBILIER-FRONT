import { useState } from 'react'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent from '@mui/material/CardContent'
import PricingCTA from 'src/views/pages/pricing/PricingCTA'
import PricingTable from 'src/views/pages/pricing/PricingTable'
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import PricingHeader from 'src/views/pages/pricing/PricingHeader'
import PricingFooter from 'src/views/pages/pricing/PricingFooter'

const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: { padding: `${theme.spacing(20)} !important` },
  [theme.breakpoints.down('sm')]: { padding: `${theme.spacing(10, 5)} !important` }
}))

const Pricing = ({ apiData }) => {
  const [plan, setPlan] = useState('annually')
  const handleChange = e => { setPlan(e.target.checked ? 'annually' : 'monthly') }

  return (
    <Card>
      <CardContent>
        <PricingHeader plan={plan} handleChange={handleChange} />
        <PricingPlans plan={plan} data={apiData?.pricingPlans ?? []} />
      </CardContent>
      <PricingCTA />
      <CardContent><PricingTable data={apiData} /></CardContent>
      <CardContent sx={{ backgroundColor: 'action.hover' }}><PricingFooter data={apiData} /></CardContent>
    </Card>
  )
}

export const getStaticProps = () => {
  return { props: { apiData: null } }
}

export default Pricing