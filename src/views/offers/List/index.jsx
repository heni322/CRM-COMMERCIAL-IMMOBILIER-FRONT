import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetNatures, useGetOffers } from 'src/services/offers.service'
import { memo, useState } from 'react'
import OfferColumn from './OfferColumn' // Create a new component for OfferColumn
import { useGetResidences } from 'src/services/residences.service'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import ClientDataTable from './DataTable'
import OfferDataTable from './DataTable'
import useOfferTab from 'src/hooks/useOfferTab'

const OfferList = ({ clientId = false, addNew = true, pageSizeParam = 25, disablePageSize = false }) => {
  const { tab, setTab } = useOfferTab()

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  const naturesQuery = useGetNatures({})

  // Normalise to always be an array regardless of API envelope shape
  const raw = naturesQuery?.data
  const naturesData = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []

  return (
    <TabContext value={tab}>
      <Box sx={{ display: 'flex' }}>
        <TabList orientation='vertical' onChange={handleChange} aria-label='vertical tabs example'>
          {naturesData.map((item, index) => (
            <Tab key={index} value={String(item?.nature)} label={item?.entitled} />
          ))}
        </TabList>
        {naturesData.map((item, index) => (
          <TabPanel key={index} value={String(item?.nature)} style={{ width: '100%' }}>
            <OfferDataTable
              nature={tab}
              clientId={clientId}
              addNew={addNew}
              pageSizeParam={pageSizeParam}
              disablePageSize={disablePageSize}
            />
          </TabPanel>
        ))}
      </Box>
    </TabContext>
  )
}

export default memo(OfferList)

