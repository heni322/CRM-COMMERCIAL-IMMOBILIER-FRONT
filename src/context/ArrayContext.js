import { createContext, useState } from 'react'

export const ArrayContext = createContext()

export const ArrayProvider = ({ children }) => {
  const [dataArray, setDataArray] = useState([])

  return <ArrayContext.Provider value={{ dataArray, setDataArray }}>{children}</ArrayContext.Provider>
}
