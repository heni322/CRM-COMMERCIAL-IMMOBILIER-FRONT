import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material'
import CustomCurrency from 'src/components/CustomCurrency'
import moment from 'moment'

const CardDescription = ({ property, handleOpen, images, displayImage }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const lineBreak = <br />

  return (
    <div className='flex flex-col p-4'>
      <div className='relative'>
        <img
          className='object-cover w-full h-44 rounded-xl cursor-pointer hover:opacity-50 filter transition duration-300'
          alt={images?.[displayImage]?.entitled}
          src={
            images?.[displayImage]?.assets_file
              ? images?.[displayImage].assets_file
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
      <Divider />

      <div className='mt-4 text-sm gap-2 flex flex-col text-gray-600'>
        <div className='flex  items-start'>
          <IconifyIcon icon='mdi:currency-eur' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <div>
            <div className='flex items-center'>
              <h2 className='text-lg font-semibold text-gray-900'>Prix :</h2>
              <p className='text-xl font-bold text-blue-800'>
                <CustomCurrency value={property?.selling_price} suffix={' TND'} allowNegative={false} />
              </p>
            </div>
            {property?.m_price && (
              <div className='flex items-center '>
                <h2 className='text-base  text-gray-900'> m²:</h2>
                <p className='text-base  text-blue-800'>
                  <CustomCurrency value={property?.m_price} suffix={' TND'} allowNegative={false} />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Display reference */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:id-card' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Référence:</span>
          <span className='ml-1'>{property?.reference}</span>
        </div>

        {/* Project */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:home-modern' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Residence :</span>
          <span className='ml-1'>{property?.project?.entitled}</span>
        </div>
        {/* block  */}
        <div className='flex items-center'>
          <IconifyIcon icon='hugeicons:block-game' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Bloc :</span>
          <span className='ml-1'>{property?.bloc?.entitled}</span>
        </div>
        {/* Type de Bien */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:home-modern' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Type du Bien :</span>
          <span className='ml-1'>{property?.property_type?.entitled}</span>
        </div>

        {/* Type d'usage */}
        <div className='flex items-center'>
          <IconifyIcon
            icon='mdi:file-document-outline'
            width='24'
            height='24'
            className='text-gray-600 fill-current mr-2'
          />
          <span className='font-bold text-gray-800'>Type d'usage :</span>
          <span className='ml-1'>{property?.usage_type?.entitled}</span>
        </div>

        {/* Surface */}
        <div className='flex items-center'>
          <IconifyIcon
            icon='mdi:image-size-select-large'
            width='24'
            height='24'
            className='text-gray-600 fill-current mr-2'
          />
          <span className='font-bold text-gray-800'>Surface :</span>
          <span className='ml-1'>{property?.surface}</span>
        </div>
        {/* coveredSurface Surface */}
        <div className='flex items-center'>
          <IconifyIcon
            icon='arcticons:microsoft-surface'
            width='24'
            height='24'
            className='text-gray-600 fill-current mr-2'
          />
          <span className='font-bold text-gray-800'>Surface Couvert :</span>
          <span className='ml-1'>{property?.covered_surface}</span>
        </div>

        {/* Surface Couverte */}
        {/* <div className='flex items-center'>
          <IconifyIcon icon='mdi:floor-plan' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Surface Couverte :</span>
          <span className='ml-1'>{property?.covered_surface}</span>
        </div> */}

        {/* Étage */}
        <div className='flex items-center'>
          <IconifyIcon
            icon='mdi:elevator-passenger'
            width='24'
            height='24'
            className='text-gray-600 fill-current mr-2'
          />
          <span className='font-bold text-gray-800'>Étage :</span>
          <span className='ml-1'>{property?.floor}</span>
        </div>

        {/* Nombre de Pièces */}
        <div className='flex items-center'>
          <IconifyIcon
            icon='mdi:seat-individual-suite'
            width='24'
            height='24'
            className='text-gray-600 fill-current mr-2'
          />
          <span className='font-bold text-gray-800'>Nombre de Pièces :</span>
          <span className='ml-1'>{property?.piece_number}</span>
        </div>

        {/* Lotiss Fees */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:cash' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Frais de lotissement :</span>
          <span className='ml-1'>
            <CustomCurrency value={property?.lotiss_fees ?? 0} allowNegative={false} suffix={' TND'} />
          </span>
        </div>

        {/* Trustee Fees */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:cash' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Frais de syndic :</span>
          <span className='ml-1'>
            <CustomCurrency value={property?.trustee_fees ?? 0} allowNegative={false} suffix={' TND'} />
          </span>
        </div>

        {/* Folder Fees */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:cash' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Frais de dossier :</span>
          <span className='ml-1'>
            <CustomCurrency value={property?.folder_fees ?? 0} allowNegative={false} suffix={' TND'} />
          </span>
        </div>

        {/* Lawyer Fees */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:cash' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Frais d'avocat :</span>
          <span className='ml-1'>
            <CustomCurrency value={property?.lawyer_fees ?? 0} allowNegative={false} suffix={' TND'} />
          </span>
        </div>

        {/* Others Fees */}
        <div className='flex items-center'>
          <IconifyIcon icon='mdi:cash' width='24' height='24' className='text-gray-600 fill-current mr-2' />
          <span className='font-bold text-gray-800'>Autres frais :</span>
          <span className='ml-1'>
            <CustomCurrency value={property?.others_fees ?? 0} allowNegative={false} suffix={' TND'} />
          </span>
        </div>
      </div>

      <Divider />

      {/* Description */}
      <div className='mt-4'>
        <Typography variant='body1' color='textPrimary'>
          <span className='font-bold text-gray-800'>Description:</span>
          <span className='ml-1'>{property?.description}</span>
        </Typography>
      </div>

      <p className='mt-5 text-xs self-end text-gray-500'>
        Crée le {moment(property?.created_at)?.format('DD-MM-YYYY')}
      </p>
    </div>
  )
}

export default CardDescription
