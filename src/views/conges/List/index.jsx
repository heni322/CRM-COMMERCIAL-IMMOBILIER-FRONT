// export default UserList
// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'
import { useGetDossier } from 'src/services/dossier.service'
import { useGetCongesByUserId } from 'src/services/shifts.service'
import { useGetUsersById } from 'src/services/users.service'
import { Button, Fab, IconButton, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import CongeColum from 'src/layouts/components/conge-column'
import AddCongeDialog from 'src/components/AddCongeDialog'
import IconifyIcon from 'src/@core/components/icon'
import CustomList from 'src/components/CustomList'

const HolidayList = ({ user }) => {
  const [page, setPage] = useState(1)
  const auth = useAuth()
  const [pageSize, setPageSize] = useState(25)
  const [searchFilter, setSearchFilter] = useState('')
  const congesQuery = useGetCongesByUserId(user?.id)
  const congeList = congesQuery?.data

  const [columns, setColumns] = useState([
    { name: '#', key: 'index' },
    { name: 'Date debut', key: 'start_date' },
    { name: 'Date fin', key: 'end_date' }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCloseFileDialog = () => {
    // setSelectedFileId(null)
    // setSelectedFile(null)
    setIsCreateDialogOpen(false)
    console.log('closed', user)
  }

  return (
    <div>
      {auth?.user?.resources?.find(item => item.resource_name !== `create `)?.authorized && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* <Link href={`${addNewLink}`}> */}
          <Box
            onClick={() => {
              setIsCreateDialogOpen(true)
            }}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Fab color='primary' aria-label='add' size='small'>
              <Icon icon='mdi:plus' />
            </Fab>
          </Box>
        </Box>
      )}

      <CustomList dataType='conge' user={user} data={congeList} columns={columns} />
      {isCreateDialogOpen && (
        <AddCongeDialog
          user={user}
          open={isCreateDialogOpen}
          onDialogStatusChange={handleCloseFileDialog}
        ></AddCongeDialog>
      )}
    </div>
  )
}

export default HolidayList
