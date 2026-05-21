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
import Icon from 'src/@core/components/icon'

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from '@mui/material'

const CardImages = ({ images }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const lineBreak = <br />

  return (
    <div className='overflow-x-auto max-h-[400px]'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
              Nom d'image
            </th>
            {/* Show Type column on small screens only */}
            <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
              Type
            </th>
            {/* Show Size column on small screens only */}
            <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Taille
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {images?.map((item, index) => (
            <tr key={index}>
              <td className='px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                {item?.path}
              </td>
              {/* Show Type column on small screens only */}
              <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                {item?.path}
              </td>
              {/* Show Size column on small screens only */}
              <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                {item?.path}
              </td>
              <td className='px-6 py-2 whitespace-nowrap'>
                <div className='flex items-center space-x-4'>
                  {/* See File Icon */}
                  <IconButton>
                    <Icon icon='mdi:eye' style={{ color: '#3B82F6' }} fontSize={20} />
                  </IconButton>
                  {/* Delete File Icon */}
                  <IconButton>
                    <Icon icon='mdi:trash-can' style={{ color: '#EF4444' }} fontSize={20} />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  )
}

export default CardImages
