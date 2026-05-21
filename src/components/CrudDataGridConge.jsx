// ** React Imports
import { memo, useContext, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbarQuickFilter, frFR } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import { GridToolbarFilterButton } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'
import {
  Button,
  CardContent,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar
} from '@mui/material'
import Link from 'next/link'
import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import { ArrayContext } from 'src/context/ArrayContext'
import AddCongeDialog from './AddCongeDialog'

// ** renders client column
const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const CrudDataGrid = memo(
  ({
    addNewLink,
    query,
    columns,
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    rousource,
    enableFilter = false,
    filterArray = [],
    selection = false,
    generateLink = '',
    addNew = true,
    generateResources = '',
    generate
  }) => {
    // ** States
    // const [data] = useState(rows)
    // const [pageSize, setPageSize] = useState(7)
    // const [search, setSearch] = useState('')
    // const [filteredData, setFilteredData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowsModel, setSelectedRowsModel] = useState([])

    const theme = useTheme()
    const auth = useAuth()
    const { dataArray, setDataArray } = useContext(ArrayContext)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const handleCloseFileDialog = () => {
      // setSelectedFileId(null)
      // setSelectedFile(null)
      setIsCreateDialogOpen(false)
      console.log('closed')
    }

    return (
      <Box
        sx={{
          paddingLeft: 1,
          paddingRight: 1,

          // height: 650,

          // width: '100%',
          '& .MuiDataGrid-root': {
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
            },
            '& .MuiDataGrid-columnsContainer': {
              color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
              borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
            },
            '& .MuiDataGrid-columnSeparator': {
              color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
            }
          }
        }}
      >
        <DataGrid
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              // backgroundColor: 'secondary.light',
              color: 'secondary.dark',
              fontSize: 16,
              borderRadius: 1
            }
          }}
          disableSelectionOnClick
          onSelectionModelChange={newSelections => {
            setSelectedRowsModel(newSelections)

            const selectedRowsContent = newSelections.map(rowId => {
              return data?.data.find(row => row.id === rowId)
            })
            setDataArray(JSON.stringify(selectedRowsContent))
          }}
          headerHeight={60}
          density='compact'
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          autoHeight
          columns={columns}
          checkboxSelection={selection}
          rowsPerPageOptions={[7, 10, 25, 50]}
          components={{
            Toolbar: () => (
              <Grid container flex justifyContent='space-between' alignItems='center'>
                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      gap: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: theme => theme.spacing(2, 5, 4, 5)
                    }}
                  >
                    <GridToolbarQuickFilter size='small' variant='outlined' key={'filer-key-mode'} autoFocus />
                  </Box>
                  {enableFilter && (
                    <Grid item md={12} style={{ marginTop: '-0.5rem', display: 'flex', gap: 3 }}>
                      {filterArray?.map((filter, index) => (
                        <FormControl key={index} fullWidth>
                          <InputLabel
                            size='small'
                            id='validation-basic-assigned_user'
                            htmlFor='validation-basic-assigned_user'
                          >
                            {filter?.title}
                          </InputLabel>
                          <Select
                            value={filter?.state}
                            size='small'
                            onChange={event => filter?.setState(event?.target?.value)}
                            label='Ingenieur'
                            labelId='validation-basic-assigned_user'
                            aria-describedby='validation-basic-assigned_user'
                          >
                            {filter?.all && (
                              <MenuItem key={0} value={''}>
                                Tous
                              </MenuItem>
                            )}
                            {filter?.data?.map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option[filter?.option]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ))}
                    </Grid>
                  )}
                </Grid>

                <Grid item pr={3} sx={{ display: 'flex', gap: 3 }}>
                  {generate &&
                    selectedRowsModel.length !== 0 &&
                    auth?.user?.resources?.find(item => item.resource_name === `create ${generateResources}`)
                      ?.authorized && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Link href={`${generateLink}`}>
                          <Button variant='contained' color='primary' aria-label='add' size='medium' title='Ajouter'>
                            <IconifyIcon icon='mdi:plus' />
                            <Typography color={'white'}> Generer </Typography>
                          </Button>
                        </Link>
                      </Box>
                    )}
                  {addNew &&
                    auth?.user?.resources?.find(item => item.resource_name === `create ${rousource}`)?.authorized && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {/* <Link href={`${addNewLink}`}> */}
                        <Button
                          variant='contained'
                          onClick={() => {
                            setIsCreateDialogOpen(true)
                          }}
                          color='primary'
                          aria-label='add'
                          size='medium'
                          title='Ajouter'
                        >
                          <IconifyIcon icon='mdi:plus' />
                          <Typography color={'white'}> Ajouter </Typography>
                        </Button>
                        {/* </Link> */}
                      </Box>
                    )}
                </Grid>
              </Grid>
            )
          }}
          rows={data?.data || []}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          paginationMode='server'
          disableColumnFilter
          filterMode='server'
          pageSize={parseInt(data?.per_page) || 10}
          pagination
          loading={query?.isLoading || query?.isFetching}
          componentsProps={{
            columnsPanel: {
              sx: {
                '& .MuiDataGrid-panelFooter button:first-child': {
                  display: 'none'
                }
              }
            },
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 }
            }
          }}
          onFilterModelChange={e => {
            setSearch(e?.quickFilterValues)
          }}
          rowCount={data?.total || 0}
          onPageChange={newPage => setPage(newPage + 1)}
          initialState={[]}
        />

        <AddCongeDialog open={isCreateDialogOpen} onDialogStatusChange={handleCloseFileDialog}></AddCongeDialog>
      </Box>
    )
  }
)

export default CrudDataGrid
