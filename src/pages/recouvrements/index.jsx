// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import MainCard from 'src/components/MainCard'
import DossierList from 'src/views/folder/List'
import InvoiceList from 'src/views/invoices/list'
import Tab from '@mui/material/Tab'
import MuiTabList from '@mui/lab/TabList'

import { styled } from '@mui/material/styles'

// import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import TabList from '@mui/lab/TabList'

const Invoice = () => {
  // ** State
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card style={{ padding: '4px' }}>
      <TabContext headerColor='primary.main' sx={{ background: 'red' }} value={value}>
        <TabList headerColor='primary.main' onChange={handleChange} aria-label='simple tabs example'>
          <Tab value='1' label='Liste Des Recouvrements' />
          <Tab value='2' label='Liste Des Relances 1' />
          <Tab
            value='3'
            label='Liste Des Relances 2'

            // disabled
          />
        </TabList>
        <TabPanel value='1'>
          <InvoiceList payedFilter={true} payed={0} state={15} />
        </TabPanel>
        <TabPanel value='2'>
          <InvoiceList payedFilter={true} payed={0} relance={2} state={15} />
        </TabPanel>
        <TabPanel value='3'>
          <InvoiceList payedFilter={true} payed={0} relance={3} state={15} />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default Invoice
