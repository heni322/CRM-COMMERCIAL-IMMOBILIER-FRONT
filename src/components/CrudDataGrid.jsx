// ** React Imports
import { memo, useContext, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridToolbarQuickFilter, frFR } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import { GridToolbarFilterButton } from '@mui/x-data-grid'

// import SearchIcon from '@mui/icons-material/Search'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'
import {
  Autocomplete,
  Button,
  CardContent,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Toolbar,
  Select,
  CardActions,
  InputAdornment
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'

import Link from 'next/link'

import IconifyIcon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomDatePicker from './CustomDatePicker'

// ** renders client column
const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row.avatar?.length) {
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
    onTodayButtonAction,
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
    downloadButtonText,
    enableFilter = false,
    filterArray = [],
    buttonsArray = [],
    selection = false,
    generateLink = '',
    addNew = true,
    generateResources = '',
    generate,
    handleActions,
    condition = false,
    disablePageSize = false,
    conditionItem = '',
    generateButtonText = 'Generer'
  }) => {
    const theme = useTheme()
    const auth = useAuth()

    const [selectedRows, setSelectedRows] = useState([])

    const handleRowSelect = rowId => {
      if (selectedRows.includes(rowId)) {
        // Row is already selected, so remove it
        setSelectedRows(selectedRows.filter(id => id !== rowId))
      } else {
        // Row is not selected, so add it
        setSelectedRows([...selectedRows, rowId])
      }
    }

    const handleSelectAll = () => {
      if (selectedRows?.length === data?.data?.length) {
        // If all rows are selected, clear the selection
        setSelectedRows([])
      } else {
        // Select all rows
        const allRowIds = data?.data?.map(item => item.id)
        setSelectedRows(allRowIds)
      }
    }

    const [filtersSelected, setFiltersSelected] = useState(false) // Initialize as false by default

    const checkFiltersSelected = () => {
      // Logic to check if all filters are selected and set filtersSelected to true or false
      const allFiltersSelected = filterArray.every(filter => filter.state !== null)

      // console.log(filterArray)
      setFiltersSelected(allFiltersSelected)

      return filtersSelected
    }

    const handleChange = event => {
      setPageSize(event.target.value)
    }

    const [sortField, setSortField] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')

    const handleSort = field => {
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortOrder('asc')
      }
    }

    // Support both paginated { data: [] } and flat [] responses
    const sortedData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []

    if (sortField) {
      sortedData?.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : 1
        } else {
          return aValue > bValue ? -1 : 1
        }
      })
    }

    // ----------------------------------

    return (
      <div className='flex flex-col p-2'>
        {/* Search and Filters */}
        <DatePickerWrapper>
          <div className=' mx-2 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div className='relative flex items-center'>
              <div className='relative'>
                <TextField
                  placeholder='Recherche...'
                  size='small'
                  variant='outlined'
                  onChange={e => {
                    setSearch(e.target.value)
                  }}
                  InputProps={{
                    startAdornment: <IconifyIcon icon='ic:baseline-search' />
                  }}
                />
              </div>

              {enableFilter && (
                <div className='flex ml-2 gap-2 items-center'>
                  {filterArray?.map((filter, index) => (
                    <div
                      key={index}
                      className='w-[225px]' // You may adjust the width as needed
                    >
                      {filter?.type === 'date' ? (
                        <CustomDatePicker
                          disabled={false}
                          date={filter?.state}
                          setDate={filter?.setState}
                          inputText={filter?.title}
                        />
                      ) : (
                        <Autocomplete
                          ListboxProps={{ style: { maxHeight: '150px' } }}
                          size='small'
                          onChange={(event, newValue) => {
                            if (newValue) {
                              filter?.setState(newValue)
                            } else {
                              filter?.setState(null)
                            }
                            checkFiltersSelected()
                            setSelectedRows([])
                          }}
                          defaultValue={(() => { const d = Array.isArray(filter?.data) ? filter.data : Array.isArray(filter?.data?.data) ? filter.data.data : []; return d.find(item => item?.id === filter?.state?.id) })()} 
                          id={`validation-basic-${filter?.entitled?.toLowerCase()}`}
                          options={Array.isArray(filter?.data) ? filter.data : Array.isArray(filter?.data?.data) ? filter.data.data : []}
                          getOptionLabel={option => option[filter?.option]}
                          renderInput={params => (
                            <TextField {...params} variant='outlined' className='w-full' label={filter?.title} />
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='text-xl text-black font-semibold text-center'></div>
            <div className='flex flex-row items-center gap-4'>
              <div className='text-gray-500 flex gap-2 font-semibold'>
                {buttonsArray?.map(
                  (item, index) =>
                    item?.authorized &&
                    generate &&
                    selection &&
                    selectedRows?.length !== 0 && (
                      <div className='flex items-center justify-end' key={item?.id}>
                        <Button
                          onClick={() => handleActions(selectedRows, item?.type)}
                          variant='contained'
                          color='primary'
                          aria-label='add'
                          size='medium'
                          title={item?.title}
                        >
                          <IconifyIcon icon='mdi:plus' />
                          <Typography color='white'>{item?.title}</Typography>
                        </Button>
                      </div>
                    )
                )}
              </div>
              <div className='text-gray-500 font-semibold'>
                {addNew && (
                  <div className='flex items-center justify-end'>
                    <Link href={`${addNewLink}`}>
                      <Button variant='contained' color='primary' aria-label='add' size='medium' title='Ajouter'>
                        <IconifyIcon icon='mdi:plus' />
                        <Typography color='white'>Ajouter</Typography>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DatePickerWrapper>

        <div className='flex flex-col mt-6'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
              <div className='overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden'>
                  <thead
                    style={{
                      backgroundColor: 'rgb(245, 245, 247)',
                      borderBottom: '1px solid rgb(233, 233, 236)',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                      lineHeight: '24px !important'
                    }}
                    className='rounded-xl bg-red-400 text-gray-900'
                  >
                    {generate &&
                      selection &&
                      auth?.user?.resources?.find(item => item.resource_name === `create ${generateResources}`)
                        ?.authorized &&
                      rousource != 'invoices' && (
                        <th
                          scope='col'
                          style={{ textAlign: '-webkit-center' }}
                          className='px-6 py-3 text-sm font-semibold text-center rtl:text-right cursor-pointer'
                          onClick={() => handleSort('checkbox')}
                        >
                          <div class='inline-flex items-center'>
                            <label
                              class='relative flex cursor-pointer items-center rounded-full p-3'
                              for='checkbox-8'
                              data-ripple-dark='true'
                            >
                              <input
                                type='checkbox'
                                class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                id='checkbox-8'
                                onChange={handleSelectAll}
                                checked={selectedRows?.length === data?.data?.length}
                              />
                              <div class='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  class='h-3.5 w-3.5'
                                  viewBox='0 0 20 20'
                                  fill='currentColor'
                                  stroke='currentColor'
                                  stroke-width='1'
                                >
                                  <path
                                    fill-rule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clip-rule='evenodd'
                                  ></path>
                                </svg>
                              </div>
                            </label>
                          </div>
                        </th>
                      )}
                    {selection && rousource == 'invoices' && (
                      <th
                        scope='col'
                        style={{ textAlign: '-webkit-center' }}
                        className='px-6 py-3 text-sm font-semibold text-center rtl:text-right cursor-pointer'
                        onClick={() => handleSort('checkbox')}
                      >
                        <div class='inline-flex items-center'>
                          <label
                            class='relative flex cursor-pointer items-center rounded-full p-3'
                            for='checkbox-8'
                            data-ripple-dark='true'
                          >
                            <input
                              type='checkbox'
                              class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                              id='checkbox-8'
                              onChange={handleSelectAll}
                              checked={selectedRows?.length === data?.data?.length}
                            />
                            <div class='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                class='h-3.5 w-3.5'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                stroke='currentColor'
                                stroke-width='1'
                              >
                                <path
                                  fill-rule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clip-rule='evenodd'
                                ></path>
                              </svg>
                            </div>
                          </label>
                        </div>
                      </th>
                    )}

                    {columns?.map((column, index) => (
                      <Fragment key={index}>
                        {column?.hide ? null : (
                          <th
                            scope='col'
                            className='px-6 py-3 text-sm font-semibold text-center cursor-pointer'
                            onClick={() => handleSort(column.field)}
                          >
                            <div className='inline-flex items-center'>
                              <span>{column.headerName}</span>
                              {/* Add sorting indicators here */}
                            </div>
                          </th>
                        )}
                      </Fragment>
                    ))}
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {sortedData.map((item, rowIndex) => (
                      <tr key={item?.id ?? rowIndex} className={`hover:bg-gray-200 hover:transition-colors transition-colors`}>
                        {((generate &&
                          selection &&
                          filterArray.every(filter => filter.state !== null) &&
                          auth?.user?.resources?.find(item => item.resource_name === `create ${generateResources}`)
                            ?.authorized) ||
                          (selection && rousource == 'invoices')) && (
                          <td
                            style={{ textAlign: '-webkit-center' }}
                            className={`text-sm whitespace-nowrap text-gray-700 truncate text-center`}
                          >
                            <div className='inline-flex items-center'>
                              <label
                                className='relative flex cursor-pointer items-center rounded-full p-3'
                                htmlFor='checkbox-8'
                                data-ripple-dark='true'
                              >
                                <input
                                  type='checkbox'
                                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-2 border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                  id='checkbox-8'
                                  onChange={() => handleRowSelect(item.id)}
                                  checked={selectedRows.includes(item.id)}
                                />

                                <div
                                  className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100'

                                  // onClick={() => handleCopy(item[column.field])}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-3.5 w-3.5 cursor-pointer'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    strokeWidth='1'
                                  >
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    ></path>
                                  </svg>
                                </div>
                              </label>
                            </div>
                          </td>
                        )}
                        {columns?.map((column, colIndex) => (
                          <Fragment key={colIndex}>
                            {column?.hide ? null : (
                              <td
                                style={{ textAlign: '-webkit-center' }}
                                className={`text-sm whitespace-nowrap text-gray-700 max-w-[${
                                  column.flex * 100
                                }%] truncate text-center`}
                              >
                                {column.renderCell ? column.renderCell({ row: item }) : item[column.field]}
                              </td>
                            )}
                          </Fragment>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {data && sortedData.length === 0 && (
                  <div
                    style={
                      {
                        // backgroundColor: 'rgb(245, 245, 247)'
                      }
                    }
                    className='flex text-center w-full h-64 place-content-center'
                  >
                    <div className='w-[90%] self-center'>
                      <div>Pas de données</div>
                    </div>
                  </div>
                )}
                {(!data || query?.isLoading) && (
                  <div
                    style={
                      {
                        // backgroundColor: 'rgb(245, 245, 247)'
                      }
                    }
                    className='flex text-center w-full h-72 py-4 place-content-center'
                  >
                    <div role='status' className='w-[90%] animate-pulse'>
                      <div className='h-4 bg-gray-200 rounded-full w-full my-8'></div>
                      <div className='h-4 bg-gray-200 rounded-full my-8'></div>
                      <div className='h-4 bg-gray-200 rounded-full my-8'></div>
                      <div className='h-4 bg-gray-200 rounded-full my-8'></div>
                      <div className='h-4 bg-gray-200 rounded-full my-8'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className='sm:flex gap-8 sm:items-center border-t-2  sm:justify-end'>
          {!disablePageSize && (
            <div className='flex gap-2 items-center text-sm text-gray-500'>
              <span className='ml-4 text-gray-400'>Lignes par page : </span>
              <Select className='flex !h-8 w-20' value={pageSize} onChange={e => handleChange(e)} displayEmpty>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={250}>250</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
              </Select>
            </div>
          )}

          <div>
            <span className='gap-1 flex text-gray-500'>
              {data?.per_page && page ? data?.per_page * page - data?.per_page + 1 : 0}-
              {page == data?.last_page && data?.per_page
                ? data?.total
                  ? data?.total
                  : 1
                : data?.per_page && page
                ? data?.per_page * page
                : 1}
              <div>sur</div> {data?.total ? data?.total : 1}
            </span>
          </div>
          <div className='flex items-center mt-4 sm:mt-0 p-2'>
            <IconButton
              disabled={page > 1 ? false : true}
              onClick={e => {
                if (page > 1) {
                  setPage(page - 1)
                }
              }}
            >
              <IconifyIcon icon='mingcute:left-line' />
            </IconButton>
            <IconButton
              disabled={page < data?.last_page ? false : true}
              onClick={e => {
                if (page < data?.last_page) {
                  setPage(page + 1)
                }
              }}
            >
              <IconifyIcon icon='mingcute:right-line' />
            </IconButton>
          </div>
        </div>
      </div>
    )
  }
)

export default CrudDataGrid
