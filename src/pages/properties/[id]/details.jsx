import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import Property from 'src/views/properties/show/details'
import { useGetPropertyById } from 'src/services/properties.service'

const PropertyView = () => {
  const router = useRouter()

  return <Property />
}

export default PropertyView
