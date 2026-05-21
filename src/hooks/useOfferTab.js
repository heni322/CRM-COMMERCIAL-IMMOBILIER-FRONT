import { useContext } from 'react'

const { OfferTabContext } = require('src/context/OfferTabContext')

const useOfferTab = () => {
  const { tab, setTab } = useContext(OfferTabContext)

  return { tab, setTab }
}

export default useOfferTab
