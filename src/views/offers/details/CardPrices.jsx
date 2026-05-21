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

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  TextField
} from '@mui/material'
import FileDialog from 'src/components/FileDialog'
import DialogAlert from 'src/components/DialogAlert'
import moment from 'moment'
import { useDeleteDocument, useUpdatePropertyPrice } from 'src/services/properties.service'
import AddPriceDialog from './AddPriceDialog'
import CustomCurrency from 'src/components/CustomCurrency'

const CardPrices = ({ property, prices }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedFile, setSelectedFile] = useState()
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const updatePriceProperty = useUpdatePropertyPrice()

  const [editableIndex, setEditableIndex] = useState(null)
  const [editedPrice, setEditedPrice] = useState('')

  const handleEdit = (index, currentPrice) => {
    setEditableIndex(index)
    setEditedPrice(currentPrice)
  }

  const handleSave = async (index, item) => {
    try {
      await updatePriceProperty?.mutateAsync({
        id: item?.id,
        values: {
          d_property_id: item?.d_property_id,
          p_client_category_id: item?.p_client_category_id,
          selling_price: editedPrice
        }
      })
      setSuspendDialogOpen(false)
    } catch (error) {}
    setEditableIndex(null)
  }

  const handleInputChange = event => {
    setEditedPrice(event.target.value)
  }

  return (
    <div className='overflow-x-auto max-h-[400px]'>
      {prices && prices?.length > 0 ? (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
              Nom du Catégorie
            </th>
            {/* Show Type column on small screens only */}
            <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
              Prix
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {prices?.map((item, index) => (
              <tr key={index}>
                <td className='px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                  {item?.entitled}
                </td>
                <td className='px-6 py-2 whitespace-nowrap'>
                  <div className='flex items-center space-x-4'>
                    {editableIndex === index ? (
                      <>
                        {/* Input field for editing the selling price */}
                        <TextField
                          value={editedPrice}
                          onChange={handleInputChange}
                          size='small'
                          variant='outlined'
                          InputProps={{
                            style: { width: '100%' },
                            endAdornment: (
                              <IconButton onClick={() => handleSave(index, item)} aria-label='Save' size='small'>
                                <Icon icon='ic:round-check' />
                              </IconButton>
                            )
                          }}
                        />
                      </>
                    ) : (
                      <div>
                        <CustomCurrency value={item?.selling_price} prefix={'TN '} allowNegative={false} />
                      </div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-2 whitespace-nowrap'>
                  <div className='flex items-center space-x-4'>
                    {/* Edit Icon */}
                    <IconButton onClick={() => handleEdit(index, item?.selling_price)}>
                      <Icon icon='mingcute:edit-line' style={{ color: '#3B82F6' }} fontSize={20} />
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
            icon='solar:tag-price-broken'
          />
          <>Aucun Prix ajouté</>
        </div>
      )}
    </div>
  )
}

export default CardPrices
