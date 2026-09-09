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

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton, Select, MenuItem } from '@mui/material'
import FileDialog from 'src/components/FileDialog'
import DialogAlert from 'src/components/DialogAlert'
import moment from 'moment'
import { useDeleteDocument } from 'src/services/properties.service'
import { useUpdateDocumentStatus } from 'src/services/documents.service'

const STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente', color: '#F59E0B' },
  { value: 'en_cours', label: 'En cours', color: '#3B82F6' },
  { value: 'valide', label: 'Validé', color: '#10B981' },
  { value: 'refuse', label: 'Refusé', color: '#EF4444' }
]

const CardDocuments = ({ documents }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedFile, setSelectedFile] = useState()
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const deleteImageMutation = useDeleteDocument()
  const updateStatusMutation = useUpdateDocumentStatus()

  const handleCloseFileDialog = () => {
    setSelectedFile(null)
    setIsOpenFileDialog(false)
  }

  const handleDelete = async e => {
    try {
      await deleteImageMutation.mutateAsync(selectedFile?.id)
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  const handleStatusChange = async (documentId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: documentId, status: newStatus })
    } catch (error) {}
  }

  return (
    <div className='overflow-x-auto max-h-[400px]'>
      {documents && documents?.length > 0 ? (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nom du Document
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Statut
              </th>
              <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date du création
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {documents?.map((item, index) => (
              <tr key={index}>
                <td className='px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                  {item?.path}
                </td>
                <td className='px-6 py-2 whitespace-nowrap text-sm'>
                  <Select
                    size='small'
                    value={item?.status || 'en_attente'}
                    onChange={e => handleStatusChange(item?.id, e.target.value)}
                    sx={{ minWidth: 130, fontSize: '0.8rem' }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <span style={{ color: opt.color, fontWeight: 500 }}>{opt.label}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </td>
                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm max-w-[100px] overflow-hidden truncate'>
                  {moment(item?.created_at)?.format('DD-MM-YYYY')}
                </td>
                <td className='px-6 py-2 whitespace-nowrap'>
                  <div className='flex items-center space-x-4'>
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
        title={`Supprimer le fichier ${selectedFile?.path}?`}
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

export default CardDocuments
