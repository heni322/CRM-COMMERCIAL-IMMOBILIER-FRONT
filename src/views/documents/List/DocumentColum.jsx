import { Box, LinearProgress, Tooltip, Typography, Select, MenuItem } from '@mui/material'
import { Fab, IconButton, Menu } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteDocument, useDownloadDocument, useUpdateDocumentStatus } from 'src/services/documents.service'

const STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente', color: '#F59E0B' },
  { value: 'en_cours', label: 'En cours', color: '#3B82F6' },
  { value: 'valide', label: 'Validé', color: '#10B981' },
  { value: 'refuse', label: 'Refusé', color: '#EF4444' }
]

const StatusBadge = ({ status }) => {
  const option = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: `${option.color}20`,
        color: option.color,
        border: `1px solid ${option.color}`
      }}
    >
      {option.label}
    </span>
  )
}

const RowOptions = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const deleteDocumentMutation = useDeleteDocument()
  const downloadDocumentMutation = useDownloadDocument({ id: row?.id })

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      await deleteDocumentMutation.mutateAsync({ id: row?.id })
    }
  }

  const handleDownload = () => {}

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleDownload} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:download-outline' fontSize={20} />
          Télécharger
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Voulez vous supprimer ce document ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const StatusCell = ({ row }) => {
  const updateStatusMutation = useUpdateDocumentStatus()

  const handleStatusChange = async newStatus => {
    try {
      await updateStatusMutation.mutateAsync({ id: row?.id, status: newStatus })
    } catch (error) {}
  }

  return (
    <Select
      size='small'
      value={row?.status || 'en_attente'}
      onChange={e => handleStatusChange(e.target.value)}
      sx={{ minWidth: 130, fontSize: '0.8rem' }}
    >
      {STATUS_OPTIONS.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          <span style={{ color: opt.color, fontWeight: 500 }}>{opt.label}</span>
        </MenuItem>
      ))}
    </Select>
  )
}

const DocumentColum = ({ userRole }) => {
  const auth = useAuth()
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'entitled',
          headerName: 'Intitulé',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'status',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => <StatusCell row={row} />
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'created_at',
          headerName: 'Crée le',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RowOptions row={row} />
              </Box>
            </>
          ),
          align: 'center'
        }
      ]
    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: '',
          align: 'center',
          renderCell: ({ row }) => (
            <CustomAvatar sx={{ width: 30, height: 30 }} skin='light' color={row?.state?.color} variant='rounded'>
              <Icon icon={row?.state?.icon} />
            </CustomAvatar>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          headerName: 'Reference',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulée',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'status',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => <StatusBadge status={row?.status} />
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          headerName: 'N° Téléphone',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'duration',
          headerName: 'Durée de traitement',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/documents/${row.id}/download`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit documents`)?.authorized && (
                <RowOptions row={row} />
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
  }
}

export default DocumentColum
