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
import FileDialog from 'src/components/FileDialog'
import DialogAlert from 'src/components/DialogAlert'
import moment from 'moment'
import { useDeleteDocument } from 'src/services/properties.service'

const CardUser = ({ documents, deleteDocument }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedFile, setSelectedFile] = useState()
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleCloseFileDialog = () => {
    setSelectedFile(null)
    setIsOpenFileDialog(false)
  }

  const handleDelete = async e => {
    try {
      await deleteDocument(selectedFile?.id)
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  return (
    <div className='overflow-x-auto max-h-[400px]'>
      {documents && documents?.length > 0 ? (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
                Nom du Document
              </th>
              {/* Show Type column on small screens only */}
              <th className='hidden sm:table-cell px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider '>
                Date du création
              </th>
              <th className='px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {documents?.map((item, index) => (
              <tr key={index}>
                <td
                  title={item?.name}
                  className='px-5 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'
                >
                  {item?.name}
                </td>
                {/* Show Type column on small screens only */}
                <td className='hidden sm:table-cell px-5 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                  {moment(item?.created_at)?.format('DD-MM-YYYY')}
                </td>
                <td className='px-5 py-2 whitespace-nowrap'>
                  <div className='flex items-center space-x-1'>
                    {/* See File Icon */}
                    <IconButton>
                      <Icon
                        icon='mdi:eye'
                        style={{ color: '#3B82F6' }}
                        fontSize={20}
                        onClick={() => {
                          setIsOpenFileDialog(true)
                          setSelectedFile(item)
                        }}
                      />
                    </IconButton>
                    {/* Delete File Icon */}
                    <IconButton>
                      <Icon
                        icon='mdi:trash-can'
                        style={{ color: '#EF4444' }}
                        fontSize={20}
                        onClick={() => {
                          setSuspendDialogOpen(true)
                          setSelectedFile(item)
                        }}
                      />
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
            icon='mdi:file-outline'
          />
          <>Aucun document ajouté</>
        </div>
      )}

      {isOpenFileDialog && (
        <FileDialog file={selectedFile} open={isOpenFileDialog} onDialogStatusChange={handleCloseFileDialog} />
      )}
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer le fichier ${selectedFile?.name}?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={e => {

          if (e === true) {
            handleDelete()
          } else setSuspendDialogOpen(false)
        }}
      />
    </div>
  )
}

export default CardUser
