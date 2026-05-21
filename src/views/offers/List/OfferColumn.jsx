import { Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import { useState } from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useAuth } from 'src/hooks/useAuth'
import { useDeleteLocal } from 'src/services/locals.service'
import { useDeleteOffer } from 'src/services/offers.service'
import moment from 'moment'
import CustomCurrency from 'src/components/CustomCurrency'
import { hide } from '@popperjs/core'

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
  const deleteLocalMutation = useDeleteOffer()

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
    router.push(`/offers/${row?.id}/update`)
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
        title={`Supprimer document ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const OfferColumn = ({ userRole, columnProfile }) => {
  const auth = useAuth()
  switch (userRole) {
    case 'admin':
      const array = [
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'reference',
          headerName: 'Référence',
          align: 'center'
        },
        {
          hide: columnProfile === 'fiche_client',
          headerAlign: 'center',
          flex: 0.1,
          field: 'client',
          headerName: 'Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client?.name}</Typography>
        },
        {
          hide: columnProfile === 'fiche_collaborator',
          headerAlign: 'center',
          flex: 0.1,
          field: 'commercial',
          headerName: 'Commerciale',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.commercial?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'date_offer',
          headerName: 'Date document',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.date_document}</Typography>
        },
        {
          hide:
            columnProfile === 'fiche_collaborator' ||
            columnProfile === 'fiche_client' ||
            columnProfile === 'fiche_property',
          headerAlign: 'center',
          flex: 0.1,
          field: 'amount_HTNet_total',
          headerName: 'Montant HT Net Total',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography variant='body2'>
              <CustomCurrency value={row?.amount_HTNet_total ?? 0} allowNegative={false} />
            </Typography>
          )
        },
        {
          hide:
            columnProfile === 'fiche_collaborator' ||
            columnProfile === 'fiche_client' ||
            columnProfile === 'fiche_property',
          headerAlign: 'center',
          flex: 0.1,
          field: 'amount_TTC_total',
          headerName: 'TTC Totale',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography variant='body2'>
              <CustomCurrency value={row?.amount_TTC_total ?? 0} allowNegative={false} />
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'amount_NetaPayer',
          headerName: 'Net à Payer',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography variant='body2'>
              <CustomCurrency value={row?.amount_NetaPayer ?? 0} allowNegative={false} />
            </Typography>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'created_at',
          headerName: 'Crée le',
          align: 'center',
          renderCell: ({ row }) => (
            <Typography variant='body2'>{moment(row?.created_at)?.format('DD-MM-YYYY')}</Typography>
          )
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
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/offers/${row.id}/details`}>
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

      return array
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

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'created_at',
        //   headerName: 'Date de création',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },

        {
          headerAlign: 'center',
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/offers/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit properties`)?.authorized && (
                <RowOptions row={row} />
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
  }
}

export default OfferColumn
