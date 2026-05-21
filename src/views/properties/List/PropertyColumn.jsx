import { Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteLocal } from 'src/services/locals.service'
import CustomChip from 'src/@core/components/mui/chip'
import useStates from 'src/hooks/useStates'

const Img = styled('img')(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

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
  const deleteLocalMutation = useDeleteLocal()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      await deleteLocalMutation.mutateAsync({ id: row?.id })
    }
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/properties/${row?.id}/update`)
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
        {/* <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem> */}
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
        title={`Supprimer local ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const PropertyColumn = ({ userRole }) => {
  const auth = useAuth()
  const { getStateByModel } = useStates()
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'state',
          headerName: 'Statut',
          align: 'center',

          renderCell: ({ row }) => {
            const state = getStateByModel('DProperty', row.state)

            return <CustomChip label={state?.entitled} skin='light' color={state?.color} />
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
          flex: 0.1,
          field: 'entitled',
          headerName: 'Intitulé',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'residence',
          headerName: 'Résidence',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.project?.entitled}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'selling_price',
          headerName: 'Prix',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'surface',
          headerName: 'Surface',
          align: 'center'
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'piece_number',
          headerName: 'Nb de pieces',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'type',
          headerName: 'Type',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.property_type?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/properties/${row.id}/update`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* {auth?.user?.resources?.find(item => item.resource_name === `edit properties`)?.authorized && ( */}
              <RowOptions row={row} />
              {/* )} */}
            </Box>
          ),
          align: 'center'
        }
      ]
    default:
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'state',
          headerName: 'Statut',
          align: 'center',

          renderCell: ({ row }) => { const s = getStateByModel('DProperty', row?.state); return <CustomChip label={s?.entitled} skin='light' color={s?.color} /> }
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
          flex: 0.1,
          field: 'entitled',
          headerName: 'Intitulé',
          align: 'center'
        },

        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'residence',
          headerName: 'Résidence',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.project?.entitled}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'selling_price',
          headerName: 'Prix',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'surface',
          headerName: 'Surface',
          align: 'center'
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'piece_number',
          headerName: 'Nb de pieces',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'type',
          headerName: 'Type',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.property_type?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/properties/${row.id}/update`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* {auth?.user?.resources?.find(item => item.resource_name === `edit properties`)?.authorized && ( */}
              <RowOptions row={row} />
              {/* )} */}
            </Box>
          ),
          align: 'center'
        }
      ]
  }
}

export default PropertyColumn
