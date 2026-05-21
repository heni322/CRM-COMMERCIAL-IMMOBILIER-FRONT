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
import { useAuth } from 'src/hooks/useAuth'

const CustomList = ({ user, dataType, data, columns }) => {
  // ** State
  // const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const auth = useAuth()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState()
  const deleteCongesMutation = useDeleteConge(user?.id)

  const handleCloseFileDialog = () => {
    // setSelectedFileId(null)
    // setSelectedFile(null)
    setIsCreateDialogOpen(false)
    console.log('closed', user)
  }

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleDelete = async event => {
    console.log(event)
    setSuspendDialogOpen(false)
    if (event) {
      try {
        if (dataType === 'conge') await deleteCongesMutation?.mutateAsync({ id: selectedRow?.id })
      } catch (error) {}
    }
  }

  return (
    <div className='overflow-x-auto w-full max-h-[360px] min-h-[360px]'>
      <table className='min-w-full divide-y divide-gray-200 '>
        <thead className='sticky top-0 bg-gray-50'>
          <tr className=''>
            {columns.map(column => (
              <th
                scope='col'
                className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                key={column.key}
              >
                {column.name}
              </th>
            ))}
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
            ></th>
          </tr>
        </thead>
        <tbody className='bg-[#F4F8FB] divide-y divide-gray-200'>
          {data && data?.length ? (
            data?.map((item, index) =>
              dataType === 'conge' && auth?.user?.role === 'engineer' && auth?.user?.id !== user?.id ? (
                <></>
              ) : (
                <tr className='hover:bg-gray-300' key={index}>
                  {columns.map(column => (
                    <td className='px-6 py-4' key={column.key}>
                      <span className='inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold'>
                        {/* {item[column.key]} */}
                        {column.key === 'index' ? index + 1 : item[column.key]}
                      </span>
                    </td>
                  ))}
                  <td class='px-6 py-4'>
                    <div class='flex justify-end gap-4'>
                      <IconifyIcon
                        className='self-center cursor-pointer text-blue-950'
                        onClick={() => {
                          setSelectedRow(item)
                          setIsCreateDialogOpen(true)
                        }}
                        icon='basil:edit-outline'
                      />
                      <IconifyIcon
                        className='self-center text-red-900 cursor-pointer'
                        icon='mdi:delete-outline'
                        onClick={() => {
                          setSelectedRow(item)
                          setSuspendDialogOpen(true)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className='px-6 py-4 text-center'>
                <div className='flex items-center justify-center'>
                  <p>Pas de données</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {dataType === 'conge' && (
        <AddCongeDialog
          user={user}
          open={isCreateDialogOpen}
          conge={selectedRow}
          onDialogStatusChange={handleCloseFileDialog}
        ></AddCongeDialog>
      )}
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer ce congé ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        color={'error'}
        handleAction={handleDelete}
      />
    </div>
  )
}

export default CustomList
