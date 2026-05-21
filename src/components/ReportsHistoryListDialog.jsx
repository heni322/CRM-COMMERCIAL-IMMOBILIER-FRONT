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

import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

import {
  useChangeStateFile,
  useGetFileStates,
  useGetFilePreview,
  useReadFolderReport,
  useValidateReport,
  useGetReportHistory
} from 'src/services/dossier.service'
import UploadFilesDialog from './UploadFilesDialog'
import ReportDialog from 'src/components/ReportDialog'
import UploadReport from 'src/components/UploadReport'
import IconifyIcon from 'src/@core/components/icon'

const ReportsHistoryListDialog = ({ report, file, title, isOpen, open, onClose, onDialogStatusChange }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const auth = useAuth()

  const [fileState, setFileState] = useState([])

  const [selectedStatus, setSelectedStatus] = useState(1)

  const changeStateFileMutation = useChangeStateFile()
  const useValidateReportMutation = useValidateReport()
  const getFilesStatesMutation = useGetFileStates()

  // const getFilePreviewQuery = useGetFilePreview(file?.id)
  const getReportHistoryQuery = useGetReportHistory(report?.id)
  const reportHistoryFiles = getReportHistoryQuery?.data

  const readFolderReportMutation = useReadFolderReport()

  const handleStatusChange = event => {
    console.log(event.target.value)
    setSelectedStatus(event.target.value)
  }

  const [isLoading, setIsLoading] = useState(false)

  const saveStatus = async id => {
    setIsLoading(true)
    try {
      await useValidateReportMutation?.mutateAsync({
        id: id
      })
    } catch (error) {
      // console.log('Comment:', comment)
      // console.log(error)
    }
    setIsLoading(false)
  }

  //Function
  const handleClickOpen = () => setOpen(true)

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

  const [isOpenFolderDialog, setIsOpenFolderDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState()

  const handleCloseReportDialog = () => {
    // setselectedReportId(null)
    // setselectedReport(null)
    setIsOpenFolderDialog(false)
  }

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
              {report?.description}
            </Typography>
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
          <div class='bg-white p-2 rounded-md w-[96%] '>
            <div class=' flex items-center justify-between '>
              <div></div>
              <div class='flex items-center justify-between'>
                <div class='flex  items-center p-2 rounded-md'></div>
                <div class='lg:ml-40 ml-10 space-x-8'>
                  {auth?.user?.resources?.find(item => item.resource_name === `create rapports`)?.authorized ? (
                    <UploadReport
                      reportType={'reportVersion'}
                      report={report}

                      // folder={folderData}
                    ></UploadReport>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <div class='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
                <div class='inline-block min-w-full shadow rounded-lg overflow-hidden'>
                  <table class='min-w-full leading-normal overflow-x-auto max-h-[600px]'>
                    <thead>
                      <tr>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          #
                        </th>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Nom du rapport
                        </th>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Status
                        </th>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                          Crée le
                        </th>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'></th>
                        <th class='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportHistoryFiles?.map((item, index) => (
                        <tr key={index}>
                          <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p class='text-gray-900 whitespace-no-wrap'>{index + 1}</p>
                          </td>
                          <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p class='text-gray-900 whitespace-no-wrap'>{item?.name}</p>
                          </td>
                          <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p class='text-gray-900 whitespace-no-wrap'>
                              <CustomAvatar
                                sx={{ width: 30, height: 30 }}
                                skin='light'
                                color={item?.state?.color}
                                variant='rounded'
                              >
                                <Icon icon={item?.state?.icon} />
                              </CustomAvatar>
                            </p>
                          </td>
                          <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <p class='text-gray-900 whitespace-no-wrap'>{item?.created_at}</p>
                          </td>
                          <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                            <div className='flex flex-row'>
                              <IconButton
                                onClick={() => {
                                  setSelectedReport(item)
                                  setIsOpenFolderDialog(true)
                                }}
                              >
                                <IconifyIcon
                                  className='w-[20px] h-5  text-gray-600 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                                  icon='mdi:eye'
                                />
                              </IconButton>
                            </div>
                          </td>
                          {item?.validate !== 1 ? (
                            <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                              <div className='flex flex-row'>
                                <IconButton
                                  color='success'
                                  disabled={isLoading}
                                  onClick={() => {
                                    saveStatus(item?.id)
                                  }}
                                >
                                  <IconifyIcon color icon='ic:outline-check' />
                                </IconButton>
                              </div>
                            </td>
                          ) : (
                            <td class='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                              <div className='flex flex-row'>
                                <IconButton
                                  color='error'
                                  onClick={() => {
                                    saveStatus(item?.id)
                                  }}
                                  disabled={isLoading}
                                >
                                  <IconifyIcon color icon='ph:x-bold' />
                                </IconButton>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <ReportDialog
            file={selectedReport}
            open={isOpenFolderDialog}
            onDialogStatusChange={handleCloseReportDialog}
            onClose={() => handleCloseDialog(index)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReportsHistoryListDialog
