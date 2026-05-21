import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormGroup from '@mui/material/FormGroup'

import { useRouter } from 'next/router'
import { useAvailableResidence, useUpdateResidence } from 'src/services/residences.service'
import moment from 'moment'
import CustomCurrency from 'src/components/CustomCurrency'

const CardDescription = ({ displayImage, residence, handleOpen, images }) => {
  const router = useRouter()
  const [residenceForUpdate, setResidenceForUpdate] = useState(residence)
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const updateResidenceMutation = useUpdateResidence()
  const availableResidenceMutation = useAvailableResidence()

  const handleSave = async () => {
    const updatedResidence = { ...residence }

    // /* removed */

    updatedResidence.availability = updatedResidence.availability == 0 ? 1 : 0

    // /* removed */

    setResidenceForUpdate(updatedResidence)

    // /* removed */
    await updateResidenceMutation?.mutateAsync({
      id: residence?.id,
      values: updatedResidence
    })
  }

  const handleAvailability = async () => {
    await availableResidenceMutation?.mutateAsync({
      id: residence?.id
    })
  }

  return (
    <MainCard content={false} sx={{ backgroundColor: '#FDFDFD' }} title={residence?.entitled}>
      <div className='flex flex-col p-4 pt-0'>
        <div className='relative'>
          <img
            className='object-cover w-full h-44 rounded-xl cursor-pointer hover:opacity-50 filter transition duration-300'
            alt={images?.[displayImage]?.entitled}
            src={
              images?.[displayImage]?.assets_file
                ? images?.[displayImage]?.assets_file
                : 'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            onClick={handleOpen}
          />
          <div
            onClick={handleOpen}
            className='absolute inset-0 flex items-center rounded-xl bg-black cursor-pointer justify-center opacity-0 hover:opacity-[30%] transition-opacity duration-300'
          >
            <p className='text-white text-lg font-semibold opacity-100'>Cliquez pour ouvrir les images</p>
          </div>
        </div>
        <Divider></Divider>
        <div className='mt-4 text-sm gap-2 flex flex-col text-gray-600'>
          {/* Display reference */}
          <div className='flex items-center'>
            <IconifyIcon icon='mdi:id-card' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Référence:</span>
            <span className='ml-1'>{residence?.reference}</span>
          </div>

          <div className='flex items-center'>
            <IconifyIcon icon='mdi:floor-plan' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Etages:</span>
            <span className='ml-1'>{residence?.floors_number}</span>
          </div>
          {/* Count Blocs */}
          <div className='flex items-center'>
            <IconifyIcon icon='mdi:counter' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Nombre de blocs :</span>
            <span className='ml-1'>{residence?.count_blocs}</span>
          </div>

          {/* Count Properties */}
          <div className='flex items-center'>
            <IconifyIcon icon='mdi:counter' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Nombre de biens :</span>
            <span className='ml-1'>{residence?.count_properties}</span>
          </div>

          {/* Display address */}
          <div className='flex items-center'>
            <IconifyIcon icon='mdi:home' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Adresse:</span>
            <span className='ml-1'>{residence?.address}</span>
          </div>

          <div className='flex items-center'>
            <IconifyIcon icon='mdi:city' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Ville:</span>
            <span className='ml-1'>{residence?.city}</span>
          </div>

          {/* Display zip_code */}
          <div className='flex items-center'>
            <IconifyIcon icon='mdi:map-marker' width='24' height='24' className='text-gray-600 fill-current mr-2' />
            <span className='font-bold text-gray-800'>Code Postale:</span>
            <span className='ml-1'>{residence?.zip_code}</span>
          </div>
        </div>

        <Divider />

        {/* Description */}
        <div className='mt-4 text-wrap'>
          <Typography variant='body1' color='textPrimary'>
            <span className='font-bold text-gray-800'>Description:</span>
            <span className='ml-1 break-words'>{residence?.description}</span>
          </Typography>
        </div>

        <p className='mt-5 text-xs self-end text-gray-500'>
          Crée le {moment(residence?.created_at)?.format('DD-MM-YYYY')}
        </p>
      </div>
    </MainCard>
  )
}

export default CardDescription
