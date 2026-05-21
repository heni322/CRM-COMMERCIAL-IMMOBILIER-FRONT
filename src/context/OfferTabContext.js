import { createContext, useState } from 'react'

export const OfferTabContext = createContext()

export const OfferTabProvider = ({ children }) => {
  const [tab, setTab] = useState('0')

  return <OfferTabContext.Provider value={{ tab, setTab }}>{children}</OfferTabContext.Provider>
}

