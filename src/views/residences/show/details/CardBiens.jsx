import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Router, { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import Icon from 'src/@core/components/icon'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from '@mui/material'
import CustomCurrency from 'src/components/CustomCurrency'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteProperty } from 'src/services/properties.service'

const CardBiens = ({ properties, residence }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState()

  const deletePropertyMutation = useDeleteProperty()

  // const handleDelete = () => {
  //   setSuspendDialogOpen(true)
  // }

  const handleDelete = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      await deletePropertyMutation.mutateAsync({ id: selectedProperty?.id })
    }
  }

  return (
    <div className='overflow-x-auto max-h-[400px]'>
      {properties && properties?.length > 0 ? (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Intitulé Bien
              </th>
              <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Prix
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {properties?.map((property, index) => (
              <tr key={index}>
                <td className='px-6 py-2 whitespace-nowrap text-sm'>{property?.entitled}</td>
                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                  <CustomCurrency value={property?.m_price} prefix={'TN '} allowNegative={false} />
                </td>
                <td className='px-6 py-2 whitespace-nowrap'>
                  <div className='flex items-center space-x-4'>
                    {/* See File Icon */}

                    <IconButton onClick={() => router.push(`/properties/${property?.id}/details`)}>
                      <Icon icon='mdi:eye' style={{ color: '#3B82F6' }} fontSize={20} />
                    </IconButton>
                    {/* Delete File Icon */}
                    <IconButton
                      onClick={() => {
                        setSelectedProperty(property)
                        setSuspendDialogOpen(true)
                      }}
                    >
                      <Icon icon='mdi:trash-can' style={{ color: '#EF4444' }} fontSize={20} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
          <IconifyIcon
            className='w-[200px] md:w-[400px] h-20 md:h-28 self-center text-gray-600'
            icon='bi:building-add'
          />
          <>Aucun Bien ajouté</>
        </div>
      )}
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer residence ${selectedProperty?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={handleDelete}
      />
    </div>
  )
}

export default CardBiens
