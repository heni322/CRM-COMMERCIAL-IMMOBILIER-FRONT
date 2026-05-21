import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetProperties } from 'src/services/properties.service'
import { memo, useEffect, useState } from 'react'
import PropertyColumn from './PropertyColumn'
import { useGetResidences } from 'src/services/residences.service'
import { useCreateOffer } from 'src/services/offers.service'
import { useRouter } from 'next/router'
import PropertyCard from 'src/components/PropertyCard'
import { Autocomplete, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import Link from 'next/link'
import useStates from 'src/hooks/useStates'
import { useGetPropertyTypes, useGetUsages } from 'src/services/settings.service'
import { extractList } from 'src/lib/api'

// Helper: always returns a flat array regardless of API response shape
const toArray = data => (Array.isArray(data) ? data : data?.data ?? [])

const PropertyList = () => {
  const auth = useAuth()
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState(null)
  const [state, setState] = useState(null)
  const [usageType, setUsageType] = useState(null)
  const [residence, setResidence] = useState(null)
  const [displayType, setDisplayType] = useState(0)
  const [filterArray, setFilterArray] = useState([])

  const { getStatesByModel } = useStates()
  const states = getStatesByModel('DProperty') ?? []

  const propertyColumn = PropertyColumn({ userRole: auth?.user?.role })

  // ── Data queries ──────────────────────────────────────────────────────────
  const propertiesQuery = useGetProperties({
    paginated: true,
    page,
    pageSize,
    search,
    propertyType: propertyType?.id,
    project: residence?.id,
    state: state?.state,
    usageType: usageType?.id
  })
  const propertiesData = propertiesQuery?.data // paginated shape: { data:[], total, last_page, ... }
  console.log('propertiesData :', propertiesData)
  const residencesQuery = useGetResidences({})
  const usagesQuery = useGetUsages()
  const typesQuery = useGetPropertyTypes()

  // Normalise: always flat arrays regardless of { data:[] } vs [] response shape
  const residenceList = toArray(residencesQuery?.data)
  const usagesList = toArray(usagesQuery?.data)
  const typesList = toArray(typesQuery?.data)

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createOfferMutation = useCreateOffer()

  const handleGenerate = async ids => {
    try {
      await createOfferMutation.mutateAsync({ d_residence_id: residence?.id, properties: ids })
      router.push('/offers')
    } catch (_) {}
  }

  const handleActions = async (ids, buttonType) => {
    if (buttonType === 'generateFacture') handleGenerate(ids)
  }

  // ── Filter array for CrudDataGrid ─────────────────────────────────────────
  useEffect(() => {
    if (!residencesQuery?.isSuccess) return
    setFilterArray([
      {
        title: 'Selectionner une Résidence',
        option: 'entitled',
        setState: setResidence,
        state: residence,
        data: residenceList,
        all: true,
        width: 180
      },
      {
        title: 'Selectionner un Statut',
        option: 'entitled',
        setState: setState,
        state: state,
        data: states,
        all: true,
        width: 180
      },
      {
        title: 'Selectionner type bien',
        option: 'entitled',
        setState: setPropertyType,
        state: propertyType,
        data: typesList,
        all: true,
        width: 180
      },
      {
        title: "Selectionner type d'usage",
        option: 'entitled',
        setState: setUsageType,
        state: usageType,
        data: usagesList,
        all: true,
        width: 180
      }
    ])
  }, [residencesQuery?.isSuccess, residenceList.length, residence, auth])

  return (
    <div className='bg-[#F5F5F5] rounded-xl p-8'>
      {/* ── Filters bar ── */}
      {displayType === 0 && (
        <div className='relative grid grid-cols-1 lg:grid-cols-6 gap-4 bg-gradient-to-b from-blue-100 to-violet-100 rounded-lg shadow-md mb-4 p-4'>
          <div className='grid lg:grid-cols-4 grid-cols-1 gap-2 lg:col-span-4'>
            <TextField
              placeholder='Recherche...'
              size='small'
              variant='outlined'
              onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <IconifyIcon icon='ic:baseline-search' /> }}
            />

            <Autocomplete
              size='small'
              onChange={(_, v) => setResidence(v ?? null)}
              value={residence}
              options={residenceList}
              getOptionLabel={o => o?.entitled ?? ''}
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              renderInput={p => <TextField {...p} variant='outlined' label='Résidence' />}
            />

            <Autocomplete
              size='small'
              onChange={(_, v) => setState(v ?? null)}
              value={state}
              options={states}
              getOptionLabel={o => o?.entitled ?? ''}
              isOptionEqualToValue={(o, v) => o?.state === v?.state}
              renderInput={p => <TextField {...p} variant='outlined' label='Statut' />}
            />

            <Autocomplete
              size='small'
              onChange={(_, v) => setPropertyType(v ?? null)}
              value={propertyType}
              options={typesList}
              getOptionLabel={o => o?.entitled ?? ''}
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              renderInput={p => <TextField {...p} variant='outlined' label='Type bien' />}
            />

            <Autocomplete
              size='small'
              onChange={(_, v) => setUsageType(v ?? null)}
              value={usageType}
              options={usagesList}
              getOptionLabel={o => o?.entitled ?? ''}
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              renderInput={p => <TextField {...p} variant='outlined' label="Type d'usage" />}
            />
          </div>

          <div className='flex items-center lg:col-span-2 justify-end'>
            <Link href='/properties/create'>
              <Button variant='contained' color='primary' size='medium'>
                <IconifyIcon icon='mdi:plus' className='w-6 h-6' />
                <Typography color='white'>Ajouter</Typography>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── View toggle ── */}
      <div className='flex justify-end mb-4'>
        <IconButton disabled={displayType === 0} onClick={() => setDisplayType(0)}>
          <IconifyIcon icon='ic:baseline-view-column' />
        </IconButton>
        <IconButton disabled={displayType === 1} onClick={() => setDisplayType(1)}>
          <IconifyIcon icon='ic:baseline-view-list' />
        </IconButton>
      </div>

      {/* ── Card grid view ── */}
      {displayType === 0 && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
            {(propertiesData?.data ?? []).map((property, index) => (
              <PropertyCard key={property?.id ?? index} property={property} />
            ))}
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
            <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
              <p className='text-sm text-gray-700'>
                Affichage{' '}
                <span className='font-medium'>
                  {propertiesData?.per_page && page ? propertiesData.per_page * page - propertiesData.per_page + 1 : 0}
                </span>
                {' – '}
                <span className='font-medium'>
                  {page === propertiesData?.last_page
                    ? propertiesData?.total ?? 1
                    : propertiesData?.per_page && page
                    ? propertiesData.per_page * page
                    : 1}
                </span>
                {' sur '}
                <span className='font-medium'>{propertiesData?.total ?? 0}</span>
              </p>

              <div className='flex gap-8'>
                <div className='flex gap-2 items-center text-sm text-gray-500'>
                  <span className='ml-4 text-gray-400'>Lignes par page :</span>
                  <Select className='flex !h-8 w-20' value={pageSize} onChange={e => setPageSize(e.target.value)}>
                    {[25, 50, 100, 250, 1000].map(n => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className='flex items-center mt-4 sm:mt-0 p-2'>
                  <IconButton disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <IconifyIcon icon='mingcute:left-line' />
                  </IconButton>
                  <IconButton disabled={page >= (propertiesData?.last_page ?? 1)} onClick={() => setPage(p => p + 1)}>
                    <IconifyIcon icon='mingcute:right-line' />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Table view ── */}
      {displayType === 1 && (
        <CrudDataGrid
          query={propertiesQuery}
          columns={propertyColumn}
          data={propertiesData}
          page={page}
          setPage={setPage}
          enableFilter={true}
          filterArray={filterArray}
          pageSize={pageSize}
          setPageSize={setPageSize}
          search={search}
          setSearch={setSearch}
          addNewLink='/properties/create'
        />
      )}
    </div>
  )
}

export default memo(PropertyList)
