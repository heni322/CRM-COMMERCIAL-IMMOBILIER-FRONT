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
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const PropertyDescription = ({ property }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const lineBreak = <br />

  return (
    <>
      <h3 className='text-3xl font-bold text-gray-900 mb-4'>
        <IconifyIcon icon='mdi:description' width='30' height='30' className='text-indigo-500 mr-2' />
      </h3>
      <p className='text-gray-700 mb-4'>
        <IconifyIcon icon='mdi-home-city' width='18' height='18' className='text-indigo-500 mr-2' />
        Bienvenue à <strong>{property?.residenceName}</strong>, une maison de{' '}
        <strong>{property?.bedrooms} chambres à coucher</strong>, <strong>{property?.bathrooms} salles de bains</strong>{' '}
        de type <strong>{property?.type?.toLowerCase()}</strong> située à{' '}
        <strong>
          {property?.street}, {property?.address}, {property?.city}
        </strong>
        . Cette résidence magnifiquement conçue sur <strong>{property?.floors} étages</strong> offre un espace de vie
        spacieux de <strong>{property?.size}</strong> et est répertoriée pour{' '}
        <strong>{property?.status?.toLowerCase()}</strong>.
      </p>

      <p className='text-gray-700 mb-4'>
        <IconifyIcon icon='mdi-fire' width='18' height='18' className='text-indigo-500 mr-2' />
        Profitez du confort du <strong>{property?.heatingSystem}</strong> et du{' '}
        <strong>{property?.coolingSystem}</strong> tout au long de l'année. La maison dispose d'un intérieur
        impressionnant avec un revêtement de sol en <strong>{property?.flooringType}</strong>, créant une atmosphère
        chaleureuse et accueillante. La cuisine est équipée d'appareils modernes, dont{' '}
        {property?.appliances?.map((appliance, index) => (
          <span key={index}>
            {index > 0 && ', '}
            <strong>{appliance}</strong>
          </span>
        ))}{' '}
        . Les équipements supplémentaires comprennent une{' '}
        {property?.amenities?.map((amenity, index) => (
          <span key={index}>
            {index > 0 && ', '}
            <strong>{amenity}</strong>
          </span>
        ))}{' '}
        , faisant de cette Bien un lieu idéal pour la détente et le divertissement.
      </p>

      <p className='text-gray-700 mb-4'>
        <IconifyIcon icon='mdi-history' width='18' height='18' className='text-indigo-500 mr-2' />
        Cette <strong>{property?.type?.toLowerCase()}</strong> a une histoire fascinante. Elle a été mise en vente le{' '}
        <strong>{property?.propertyHistory[0]?.date}</strong>, a subi une réduction de prix le{' '}
        <strong>{property?.propertyHistory[1]?.date}</strong> à <strong>{property?.propertyHistory[1]?.price}</strong>,
        a reçu une document le <strong>{property?.propertyHistory[2]?.date}</strong>, et a finalement été vendue le{' '}
        <strong>{property?.propertyHistory[3]?.date}</strong> pour{' '}
        <strong>{property?.propertyHistory[3]?.price}</strong>.
      </p>

      <p className='text-gray-700 mb-4'>
        <IconifyIcon icon='mdi-account' width='18' height='18' className='text-indigo-500 mr-2' />
        Pour plus d'informations ou pour planifier une visite, contactez notre agent{' '}
        <strong>{property?.agent?.name}</strong> à <strong>{property?.agent?.email}</strong> ou{' '}
        <strong>{property?.agent?.phone}</strong>.
      </p>
    </>
  )
}

export default PropertyDescription
