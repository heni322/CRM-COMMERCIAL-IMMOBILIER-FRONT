import MainCard from 'src/components/MainCard'
import OfferList from 'src/views/offers/List/index'

const Locals = () => {
  return (
    <MainCard title='Liste des documents' headerColor='primary.main' marginContent='5px' content={false} backButton>
      <OfferList />
    </MainCard>
  )
}

export default Locals
