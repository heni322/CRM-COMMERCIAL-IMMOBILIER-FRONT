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
import { useGetUsersById } from 'src/services/users.service'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import DossierColum from 'src/layouts/components/dossier-column'

const FolderList = () => {
  const [page, setPage] = useState(1)
  const auth = useAuth()
  const [pageSize, setPageSize] = useState(25)
  const [searchFilter, setSearchFilter] = useState('')
  const foldersQuery = useGetDossier({ paginated: true, page: page, pageSize: pageSize })
  const folderList = foldersQuery?.data?.data
  const [columns, SetColumns] = useState([])

  const dossierColumn = DossierColum({ userRole: auth?.user?.role })

  // useEffect(() => {
  //   SetColumns([...DossierColum({ userRole: auth?.user?.role })])
  // }, [folderList])

  return (
    <Card>
      <CardHeader title='Liste des Dossiers' />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* <Typography variant='body2' sx={{ mr: 2 }}>
            Rechercher:
          </Typography> */}
          <Link href='/apps/dossiers/add-dossier'>
            <Fab color='primary' aria-label='add' size='small'>
              <Icon icon='mdi:plus' />
            </Fab>
          </Link>
          {/* <TextField size='small' placeholder='chercher unDossier' value={value} onChange={e => setValue(e.target.value)} /> */}
        </Box>
      </CardContent>

      {foldersQuery?.isSuccess && (
        <DataGrid
          autoHeight
          rows={folderList || []}
          columns={dossierColumn}
          disableSelectionOnClick
          loading={foldersQuery.isLoading || foldersQuery.isFetching}
          pageSize={pageSize}
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          checkboxSelection={false}
          rowCount={foldersQuery.data?.total || 0}
          pagination
          componentsProps={{
            baseButton: {
              variant: 'outlined'
            },
            toolbar: {
              value: 'azeaz',
              clearSearch: () => handleSearch(''),
              onChange: event => handleSearch(event.target.value)
            }
          }}
          paginationMode='server'
          filterMode='server'
          onFilterModelChange={e => {
            setSearchFilter(e?.quickFilterValues)
          }}
          onPageChange={newPage => setPage(newPage + 1)}
        />
      )}
    </Card>
  )
}

export default FolderList
