// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import IconifyIcon from 'src/@core/components/icon'
import AddCongeDialog from './AddCongeDialog'
import { useDeleteConge } from 'src/services/shifts.service'
import DialogAlert from './DialogAlert'
import { IconButton } from '@mui/material'
import ReportsHistoryListDialog from './ReportsHistoryListDialog'
import ReportDialog from './ReportDialog'
import { useAuth } from 'src/hooks/useAuth'

const ReportsList = ({ reports }) => {
  // ** State
  const auth = useAuth()

  // const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState()

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const [isOpenFolderDialog, setIsOpenFolderDialog] = useState(false)
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState()

  const handleCloseReportDialog = () => {
    // setSelectedFileId(null)
    // setSelectedFile(null)
    setIsOpenFolderDialog(false)
  }

  const handleCloseFileDialog = () => {
    // setSelectedFileId(null)
    // setSelectedFile(null)
    setIsOpenFileDialog(false)
  }

  const handleOpenReportDialog = report => {
    setSelectedReport(report)
    setIsOpenFolderDialog(true)
    console.log(selectedReport)
  }

  const handleOpenFileDialog = report => {
    setSelectedReport(report)
    setIsOpenFileDialog(true)
  }

  return (
    <div class='overflow-x-auto w-full max-h-[400px]'>
      <table class='items-center bg-transparent w-full border-collapse divide-y divide-gray-200'>
        <tbody>
          {reports?.map((report, index) => (
            <tr key={index}>
              <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs max-w-[140px] whitespace-nowrap p-4 text-left text-blueGray-700 truncate'>
                {report?.description && report?.description}
              </td>

              <td class='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 '>
                {report?.created_at}
              </td>
              <td class='border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                <div className='flex flex-row'>
                  {report?.versions?.length !== 0 && (
                    <IconButton
                      onClick={() => {
                        handleOpenFileDialog(report?.versions[0])
                      }}
                    >
                      <IconifyIcon
                        className='w-[20px] h-5  text-gray-600 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                        icon='mdi:eye'
                      />
                    </IconButton>
                  )}
                  {auth?.user?.resources?.find(item => item.resource_name === `validate rapports`)?.authorized && (
                    <IconButton
                      onClick={() => {
                        handleOpenReportDialog(report)
                      }}
                    >
                      <IconifyIcon
                        className='w-[20px] h-5  text-gray-600 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                        icon='mdi:edit'
                      />
                    </IconButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReportsHistoryListDialog
        report={selectedReport}
        open={isOpenFolderDialog}
        onDialogStatusChange={handleCloseReportDialog}
        onClose={() => handleCloseDialog(index)}
      />

      <ReportDialog
        file={selectedReport}
        open={isOpenFileDialog}
        onDialogStatusChange={handleCloseFileDialog}
        onClose={() => handleCloseDialog(index)}
      />
    </div>
  )
}

export default ReportsList
