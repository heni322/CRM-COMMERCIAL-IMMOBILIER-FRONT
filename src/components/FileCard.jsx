// ** React Imports
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import { Avatar, Box, Chip, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import { LoadingButton } from '@mui/lab'
import Icon from 'src/@core/components/icon'

//components
import MenuCustomized from 'src/views/components/menu/MenuCustomized'
import CommentsDialog from 'src/components/CommentsDialog'
import MainCard from './MainCard'

import FileDialog from './FileDialog'
import UploadFilesDialog from './UploadFilesDialog'

import { useDeleteFile, useGetDownloadFolderFiles } from 'src/services/dossier.service'
import IconifyIcon from 'src/@core/components/icon'

export default function FilesCard({ files, folder, endpoint, hideDelete, onFilesSelect }) {
  const fileInputRef = useRef(null)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [selectedFile, setSelectedFile] = useState()
  const [fileIndex, setFileIndex] = useState(null)
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [closeMenu, setCloseMenu] = useState(false)
  const [open, setOpen] = useState(false)
  const [downloadClicked, setDownloadClicked] = useState(false)

  const deleteFileMutation = useDeleteFile()
  const downloadFilesMutation = useGetDownloadFolderFiles()

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const getIconForFileType = fileType => {
    if (fileType === 'pdf') {
      return <Icon icon='teenyicons:pdf-outline' fontSize={20} />
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      return <Icon icon='material-symbols:image-outline' fontSize={20} />
    } else {
      return <Icon icon='mdi:file-outline' fontSize={20} />
    }
  }

  const [isOpenDialogs, setIsOpenDialogs] = useState(Array(files?.length).fill(false))

  const handleDownload = () => {
    window.location.href = `${endpoint}/${fileId}/download`
  }

  const handleDelete = async () => {
    // Implement your delete logic here

    await deleteFileMutation?.mutateAsync({ id: selectedFileId })
    setCloseMenu(true)

    // setCurrentFile(fileComments)
  }

  const handleViewDetails = index => {
    // Set the open state for the dialog at the specific index to true
    const updatedIsOpenDialogs = [...isOpenDialogs]
    updatedIsOpenDialogs[fileIndex] = true
    setIsOpenDialogs(updatedIsOpenDialogs)
  }

  const handleFilesSelect = (item, index) => {
    setSelectedFileId(item?.id)
    setSelectedFile(item)
    setFileIndex(index)
  }

  const handleClose = () => {
    setSelectedFileId(null)
    setSelectedFile(null)
    setOpen(false)
  }

  const handleCloseFileDialog = () => {
    setSelectedFileId(null)
    setSelectedFile(null)
    setIsOpenFileDialog(false)
    console.log('closed')
  }

  const handleClickOpen = item => {
    setSelectedFileId(item?.id)
    setSelectedFile(item)
    setOpen(true)
  }

  const handleClickOpenFile = item => {
    setSelectedFileId(selectedFile?.id)
    setSelectedFile(selectedFile)
    setIsOpenFileDialog(true)
  }

  const handleClickOpened = item => {
    setOpen(true)
  }

  const handleCloseDialog = index => {
    const updatedIsOpenDialogs = [...isOpenDialogs]
    updatedIsOpenDialogs[index] = false
    setIsOpenDialogs(updatedIsOpenDialogs)
  }

  const handleFilesDownload = async () => {
    try {
      // Make the API request to fetch the ZIP file
      const response = await downloadFilesMutation?.mutateAsync({
        folderId: folder.id
      })

      // Check if the response is successful
      if (response) {
        // Create a Blob object from the response data
        const blob = new Blob([response], { type: 'application/zip' })

        // Create a download link element
        const downloadLink = document.createElement('a')
        downloadLink.href = window.URL.createObjectURL(blob)
        downloadLink.download = 'downloaded.zip' // You can specify the file name

        // Trigger the download
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // Cleanup: remove the link element
        document.body.removeChild(downloadLink)
      } else {
        console.error('API response is empty or missing data.')
      }
    } catch (error) {
      console.error('Error while downloading ZIP file:', error)
    }
  }
  const hideEdit = false

  const menuItems = [
    {
      label: 'Afficher les details',

      // onClick: () => handleViewDetails()
      onClick: () => handleClickOpenFile()
    },
    {
      label: 'Télécharger',
      onClick: () =>
        (window.location.href = `${process.env.REACT_APP_BASE_URL}/folders/files/${selectedFileId}/download`)
    },
    {
      label: 'Supprimer',
      onClick: () => handleDelete()
    }
  ]

  const [tabIndex, setTabIndex] = useState('1')

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <MainCard
      title={'Liste Des Fichiers'}
      secondary={
        <>
          {!hideEdit && (
            <div className='flex flex-row items-center'>
              <IconButton
                color='secondary'
                size='large'
                onClick={e => {
                  // setDisabled(false)
                  handleFilesDownload()
                }}
              >
                <Icon icon='material-symbols:download' fontSize={20} />
              </IconButton>
              <UploadFilesDialog folder={folder}></UploadFilesDialog>
            </div>
          )}
        </>
      }
    >
      <TabContext headerColor='primary.main' sx={{ background: 'red' }} value={tabIndex}>
        <TabList headerColor='primary.main' onChange={handleTabChange} aria-label='simple tabs example'>
          <Tab value='1' label='Liste des fichiers' />
          <Tab value='2' label='Liste des justificatifs de modifications' />
        </TabList>
        <TabPanel value='1'>
          <List dense={false} style={{ overflow: 'auto', maxHeight: '400px' }}>
            {files && files?.length == 0 ? (
              <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
                <IconifyIcon
                  className='w-[400px] h-40 self-center text-gray-600 max-w-[400px] max-h-40 min-w-[400px] min-h-40 '
                  icon='mdi:file-outline'
                />
                <>Aucun fichier ajouté</>
              </div>
            ) : null}
            {files?.map((file, index) =>
              !file?.rapport && !file?.file_comment ? (
                <ListItem
                  key={index}
                  secondaryAction={
                    <MenuCustomized
                      items={menuItems}
                      close={closeMenu}
                      onSelectFile={() => handleFilesSelect(file, index)}
                    ></MenuCustomized>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{getIconForFileType(file?.name?.split('.').pop().toLowerCase())}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={file?.name}
                    secondary={''}
                    secondaryTypographyProps={{ component: 'div' }}
                    style={{
                      flex: '1',
                      minWidth: '60%',
                      paddingRight: '20px'
                    }}
                  />
                  <CustomChip
                    label={file?.state?.entitled}
                    style={{
                      marginRight: '20px',
                      minWidth: '140px',
                      maxWidth: '140px'
                    }}
                    skin='light'
                    color={file?.state?.color}
                  />

                  <Box position='relative' onClick={() => handleClickOpen(file)}>
                    <IconButton>
                      {file?.comments?.length == 0 ? (
                        <Icon icon='mingcute:message-2-line' fontSize={20} />
                      ) : (
                        <Icon icon='mingcute:message-2-fill' fontSize={20} />
                      )}
                    </IconButton>
                    {file?.all_seen ? null : (
                      <Box
                        position='absolute'
                        top={-4}
                        right={2}
                        fontSize='15px' // Adjust font size as needed
                        fontWeight='bold'
                        color='#e57373'
                      >
                        &bull;
                      </Box>
                    )}
                  </Box>
                  {/* <FileDialog
              file={file}
              isOpen={isOpenDialogs[index]}
              dialogType={'FilesComments'}
              onClose={() => handleCloseDialog(index)}
            /> */}
                </ListItem>
              ) : null
            )}
          </List>
        </TabPanel>
        <TabPanel value='2'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='rounded-xl '>
              <th
                scope='col'
                className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Fichier
              </th>
              <th
                scope='col'
                className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Commentaire
              </th>
              <th
                scope='col'
                className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Ingénieur
              </th>
              <th
                scope='col'
                className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Date du création
              </th>
              <th
                scope='col'
                className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Actions
              </th>
            </thead>
            <tbody>
              {files?.map((file, index) => {
                if (!file?.rapport && file?.file_comment) {
                  return (
                    <tr key={index} className='text-[15px]'>
                      <td className='px-1 py-2 whitespace-nowrap'>
                        <div className='flex gap-1 text-center text-gray-900 whitespace-nowrap items-center'>
                          <Avatar>{getIconForFileType(file?.name?.split('.').pop().toLowerCase())}</Avatar>
                          {file?.name}
                        </div>
                      </td>
                      <td
                        className='px-1 py-2 whitespace-nowrap text-[15px] text-center relative'
                        style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {file?.file_comment}
                        {file?.file_comment.length > 200 && (
                          <div className='absolute left-0 bottom-8 bg-white text-black border rounded-lg p-2 hidden group-hover:block'>
                            {file?.file_comment}
                          </div>
                        )}
                      </td>

                      <td className='px-1 py-2 text-center whitespace-nowrap'>{file?.user?.name}</td>
                      <td className='px-1 py-2 text-center whitespace-nowrap'>{file?.created_at}</td>
                      <td className='px-1 py-2 text-center whitespace-nowrap items-center'>
                        <div className='flex justify-center'>
                          <Box position='relative' onClick={() => handleClickOpen(file)}>
                            <IconButton>
                              {file?.comments?.length == 0 ? (
                                <Icon icon='mingcute:message-2-line' fontSize={20} />
                              ) : (
                                <Icon icon='mingcute:message-2-fill' fontSize={20} />
                              )}
                            </IconButton>
                            {file?.all_seen ? null : (
                              <Box
                                position='absolute'
                                top={-4}
                                right={2}
                                fontSize='15px' // Adjust font size as needed
                                fontWeight='bold'
                                color='#e57373'
                              >
                                &bull;
                              </Box>
                            )}
                          </Box>
                          <MenuCustomized
                            items={menuItems}
                            close={closeMenu}
                            onSelectFile={() => handleFilesSelect(file, index)}
                          ></MenuCustomized>
                        </div>
                      </td>
                    </tr>
                  )
                } else {
                  return null
                }
              })}
            </tbody>
          </table>
        </TabPanel>
      </TabContext>
      {open ? (
        <CommentsDialog
          open={open}
          file={selectedFile}
          onDialogStatusChange={handleClose}
          dialogType={'FilesComments'}
        />
      ) : null}
      {isOpenFileDialog ? (
        <FileDialog file={selectedFile} open={isOpenFileDialog} onDialogStatusChange={handleCloseFileDialog} />
      ) : null}
    </MainCard>
  )
}
