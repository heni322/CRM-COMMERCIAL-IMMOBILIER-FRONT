import { Box, Tooltip, Typography, useTheme } from '@mui/material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteResidence } from 'src/services/residences.service'
import moment from 'moment'
import useStates from 'src/hooks/useStates'

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ row }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const deleteResidenceMutation = useDeleteResidence()

  const handleRowOptionsClick = event => setAnchorEl(event.currentTarget)
  const handleRowOptionsClose = () => setAnchorEl(null)

  const deleteClientValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) await deleteResidenceMutation.mutateAsync({ id: row?.id })
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleEdit = () => router.push(`/residences/${row?.id}/details`)

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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Modifier
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
        title={`Supprimer residence ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

// -----------------------------------------------------------------
// d_projects real columns (from migration):
//   id | entitled | floors_number | description | city | zip_code
//   address | reference | state (int) | tf_number | created_at
//
// Appended accessors: count_blocs, count_properties
// state is a raw integer; resolve label/icon via getStateByModel('DProject', row.state)
// -----------------------------------------------------------------
const ResidenceColumn = ({ userRole }) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()
  const theme = useTheme()

  // Shared state cell used in every role variant
  const stateCell = ({ row }) => {
    const rowState = getStateByModel('DProject', row?.state)
    
return <Icon icon={rowState?.icon} color={theme.palette[rowState?.color]?.main} />
  }

  // Shared actions cell
  const actionsCell = ({ row }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Tooltip title='Voir'>
        <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/residences/${row.id}/details`}>
          <Icon icon='mdi:eye-outline' />
        </IconButton>
      </Tooltip>
      {auth?.user?.resources?.find(item => item.resource_name === 'edit residences')?.authorized && (
        <RowOptions row={row} />
      )}
    </Box>
  )

  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: 'state',
          headerName: '',
          align: 'center',
          renderCell: stateCell
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'entitled',         // FIX: was 'name' — d_projects has no name column
          headerName: 'Intitulé',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'reference',
          headerName: 'Référence',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'address',
          headerName: 'Adresse',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'city',
          headerName: 'Ville',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.08,
          field: 'floors_number',     // FIX: was 'duration' — d_projects has no duration column
          headerName: 'Nbre d\u2019étages',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.08,
          field: 'count_properties',  // appended accessor — real data
          headerName: 'Biens',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'created_at',        // FIX: was 'createdAt' — Laravel serialises as snake_case
          headerName: 'Date de création',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography variant='body2'>
              {row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : '—'}
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: actionsCell,
          align: 'center'
        }
      ]

    default:
      // accountant and any other role: same real columns, narrower set
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: 'state',
          headerName: '',
          align: 'center',

          // FIX: was row?.state?.color — state is a raw int, must use getStateByModel
          renderCell: ({ row }) => {
            const rowState = getStateByModel('DProject', row?.state)
            
return (
              <CustomAvatar sx={{ width: 30, height: 30 }} skin='light' color={rowState?.color} variant='rounded'>
                <Icon icon={rowState?.icon} />
              </CustomAvatar>
            )
          }
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          headerName: 'Référence',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'entitled',           // FIX: was 'name' — d_projects has no name column
          headerName: 'Intitulé',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'city',               // FIX: was 'phone_number' — d_projects has no phone
          headerName: 'Ville',
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
          field: 'floors_number',      // FIX: was 'duration' — d_projects has no duration column
          headerName: 'Nbre d\u2019étages',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: actionsCell,
          align: 'center'
        }
      ]
  }
}

export default ResidenceColumn