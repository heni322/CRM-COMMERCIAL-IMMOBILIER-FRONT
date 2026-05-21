import React, { useState } from 'react'
import { useRouter } from 'next/router'

import IconifyIcon from 'src/@core/components/icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useDeleteProperty } from 'src/services/properties.service'
import DialogAlert from './DialogAlert'
import CustomCurrency from './CustomCurrency'
import useStates from 'src/hooks/useStates'

// Map PState integer → display config so we never fall through to a catch-all "Indisponible".
// Keys match the state integers in p_states for model "DProperty":
//   4 = Disponible, 5 = Réservé, 6 = Vendu
const PROPERTY_STATE_CONFIG = {
  4: { label: 'Disponible', icon: 'mdi:checkbox-marked-circle',      color: 'text-green-500' },
  5: { label: 'Réservé',    icon: 'mdi:clock-outline',               color: 'text-orange-500' },
  6: { label: 'Vendu',      icon: 'mdi:close-circle-outline',        color: 'text-red-500' },
}

const DEFAULT_STATE_CONFIG = { label: 'Indisponible', icon: 'mdi:checkbox-blank-circle-outline', color: 'text-red-500' }

const PropertyCard = ({ property }) => {
  const router = useRouter()
  const deleteProperty = useDeleteProperty()

  // property.state is the raw integer (4/5/6) — guaranteed by DPropertyResource which
  // explicitly sets 'state' => getRawOriginal('state') to prevent the Eloquent
  // relation (also named 'state') from overwriting the column value.
  const stateConfig = PROPERTY_STATE_CONFIG[property?.state] ?? DEFAULT_STATE_CONFIG

  const [anchorEl, setAnchorEl] = useState(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    await deleteProperty?.mutateAsync({ id: property?.id })
    setSuspendDialogOpen(false)
    setAnchorEl(null)
  }

  const getTypeBadge = () => {
    const typeColors = {
      Appartement: 'bg-indigo-500',
      Villa:       'bg-purple-500',
      House:       'bg-red-500',
      Garage:      'bg-yellow-500',
      Commercial:  'bg-teal-500',
      Parking:     'bg-green-500',
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-white ${
          typeColors[property?.property_type?.entitled] || 'bg-gray-500'
        }`}
      >
        {property?.property_type?.entitled}
      </span>
    )
  }

  return (
    <div className='relative group bg-white border shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition max-w-sm my-4'>
      {/* Image */}
      <div
        onClick={() => router.push(`properties/${property?.id}/details`)}
        className='cursor-pointer relative pb-[56.25%] rounded-t-lg overflow-hidden'
      >
        <img
          src={
            property?.images?.[0]?.assets_file ||
            'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt='Property Image'
          className='w-full h-full absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-t-lg'
        />
      </div>

      {/* Body */}
      <div className='p-4'>
        <div className='flex justify-between w-full'>
          <h3
            onClick={() => router.push(`properties/${property?.id}/details`)}
            className='cursor-pointer text-lg font-bold text-gray-800'
          >
            {property?.entitled}
          </h3>
          <div className='flex items-center'>{getTypeBadge()}</div>
        </div>

        <div className='flex flex-wrap gap-4 mt-2'>
          <div className='flex w-full justify-around'>
            <div>
              <span className='text-gray-600'>
                <CustomCurrency value={property?.selling_price} prefix={'TN '} allowNegative={false} />
              </span>
            </div>
            <div className='flex items-center'>
              <IconifyIcon icon='mdi:ruler' width='24' height='24' className='text-gray-600' />
              <span className='text-gray-600'>{property?.surface} m²</span>
            </div>
          </div>

          {/* State badge — driven by PROPERTY_STATE_CONFIG, no more hardcoded "Indisponible" */}
          <div className='flex items-center gap-2'>
            <IconifyIcon
              icon={stateConfig.icon}
              width='24'
              height='24'
              className={stateConfig.color}
            />
            <span className={stateConfig.color}>
              {stateConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Context menu */}
      <div className='absolute top-4 right-4'>
        <div className='relative group'>
          <button
            onClick={handleClick}
            className='bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-gray-300'
          >
            <IconifyIcon icon='mingcute:menu-fill' width='24' height='24' />
          </button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => router.push(`properties/${property?.id}/update`)}>Modifier</MenuItem>
            <MenuItem onClick={() => setSuspendDialogOpen(true)}>Supprimer</MenuItem>
          </Menu>
        </div>
      </div>

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={() => setSuspendDialogOpen}
        title={`Voulez vous supprimer "${property?.entitled}" ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={e => {
          if (e === true) {
            handleDelete()
            setAnchorEl(null)
          } else {
            setSuspendDialogOpen(false)
          }
        }}
      />
    </div>
  )
}

export default PropertyCard
