import React from 'react'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

// Shared placeholder so a bien with no photo still renders a clean card.
const PLACEHOLDER_IMAGE = '/images/placeholders/property.svg'

/**
 * One "bien" of a commercial document: thumbnail + label + link to the bien detail page.
 *
 * `line` is a d_document_lines row as serialised by DDocumentLineResource, which
 * exposes a compact `property` payload (id, entitled, reference, surface, state, image).
 * We fall back to the line's own denormalised columns (entitled_property /
 * reference_property) so historical documents keep rendering even if the bien was removed.
 */
const PropertyLineCard = ({ line, index, onOpen }) => {
  const property = line?.property
  const propertyId = line?.d_property_id ?? property?.id
  const title = property?.entitled || line?.entitled_property || `Bien ${index + 1}`
  const reference = property?.reference || line?.reference_property
  const image = property?.image || PLACEHOLDER_IMAGE

  return (
    <div className='flex items-center gap-3 p-2 transition duration-200 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm'>
      <img
        src={image}
        alt={title}
        onError={event => {
          event.currentTarget.src = PLACEHOLDER_IMAGE
        }}
        onClick={propertyId ? onOpen : undefined}
        className={`object-cover w-16 h-16 rounded-md shrink-0 bg-gray-100 ${propertyId ? 'cursor-pointer' : ''}`}
      />

      <div className='flex flex-col min-w-0 grow'>
        <span className='font-bold text-gray-800 truncate'>
          Bien {index + 1}: {title}
        </span>
        <span className='text-xs text-gray-500 truncate'>
          {reference}
          {line?.property_type ? ` • ${line.property_type}` : ''}
          {property?.surface ? ` • ${property.surface} m²` : ''}
        </span>
      </div>

      <Button
        size='small'
        variant='outlined'
        disabled={!propertyId}
        onClick={onOpen}
        startIcon={<Icon icon='mdi:home-search-outline' fontSize={18} />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Détail du bien
      </Button>
    </div>
  )
}

export default PropertyLineCard
