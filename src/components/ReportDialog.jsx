// ** React Imports
import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { useAuth } from 'src/hooks/useAuth'

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import PDFViewer from './PDFViewer'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

import {
  useChangeStateFile,
  useGetFileStates,
  useGetFilePreview,
  useReadFolderReport,
  useValidateReport
} from 'src/services/dossier.service'
import UploadFilesDialog from './UploadFilesDialog'
import UploadReport from './UploadReport'

const ReportDialog = ({ file, folder, isOpen, open, onClose, onDialogStatusChange }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const auth = useAuth()

  const [fileState, setFileState] = useState([])

  const [selectedStatus, setSelectedStatus] = useState(1)

  const changeStateFileMutation = useChangeStateFile()
  const useValidateReportMutation = useValidateReport()
  const getFilesStatesMutation = useGetFileStates()
  const getFilePreviewQuery = useGetFilePreview(file?.d_file_id)

  const readFolderReportMutation = useReadFolderReport()
  const [isLoading, setIsLoading] = useState(false)

  const saveStatus = async () => {
    setIsLoading(true)
    try {
      await useValidateReportMutation?.mutateAsync({
        id: file?.id
      })
    } catch (error) {
      // console.log('Comment:', comment)
      // console.log(error)
    }
    setIsLoading(false)
  }

  //Function

  const handleClose = () => {
    // setOpen(false)
    // onClose()
    onDialogStatusChange()
  }

  const getFilesStates = async () => {
    // Implement your delete logic here

    const states = await getFilesStatesMutation?.mutateAsync()
    const targetState = states.find(state => state.state === 1)
    setFileState(targetState)
    console.log(targetState)

    // setCurrentFile(fileComments)
  }

  const seeComment = async () => {
    try {
      if (folder?.id) {
        await readFolderReportMutation?.mutateAsync({
          id: folder.id
        })
      } else if (file?.id) {
        await readFolderReportMutation?.mutateAsync({
          id: file.id
        })
      }
    } catch (error) {}
  }

  // const fileURL = '1.png'

  // const isDocument = ['pdf', 'doc', 'docx'].includes(fileExtension)

  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0) // State to store scroll position
  const contentRef = useRef(null)

  return (
    <div>
      <Dialog
        onClose={handleClose}
        scroll='paper'
        aria-labelledby='customized-dialog-title'
        maxWidth={'md'}
        fullWidth={'md'}
        open={open}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <div className='flex flex-row'>
            <Typography variant='h6' component='span'>
              {file?.name}
            </Typography>
            <div className='flex flex-row mt-[-7px] items-center'>
              <IconButton
                color='secondary'
                size='large'
                onClick={e => {
                  // setDisabled(false)
                  window.location.href = `${process.env.REACT_APP_BASE_URL}/files/${file?.id}/version/view`
                }}
              >
                <Icon icon='material-symbols:download' fontSize={20} />
              </IconButton>
            </div>
          </div>

          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 4,
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '650px'
          }}
        >
          <PDFViewer
            fileURL={`${process.env.REACT_APP_BASE_URL}/files/${file?.id}/version/view`}
            fileName={file?.name}
          />
          {/* <PDFViewer fileURL={`${process.env.REACT_APP_BASE_URL}/${file?.id}`} fileName={file?.name} /> */}
        </DialogContent>
        <DialogActions className={`${scrollPosition != 0 ? 'block' : 'hidden'}  `}>
          {auth?.user?.resources?.find(item => item.resource_name === `validate rapports`)?.authorized ? (
            <div className=''>
              <div className='flex flex-row items-end self-end p-4'>
                <LoadingButton
                  loading={isLoading}
                  loadingPosition='start'
                  style={{ marginLeft: '20px', padding: '12px' }}
                  startIcon={<Icon icon={file?.validate !== 1 ? 'pajamas:task-done' : 'ph:x-bold'} fontSize={20} />}
                  color={file?.validate !== 1 ? 'secondary' : 'error'}
                  variant='contained'
                  onClick={() => {
                    saveStatus()
                  }}
                >
                  {file && file?.validate !== 1 ? <>{'Valider le rapport'}</> : <>{'Non Valider le rapport'}</>}
                </LoadingButton>
              </div>
            </div>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ReportDialog
