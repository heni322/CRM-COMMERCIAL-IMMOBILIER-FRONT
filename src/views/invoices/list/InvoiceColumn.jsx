import { Avatar, Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteInvoice, useSendInvoiceEmail } from 'src/services/invoices.service'
import { LoadingButton } from '@mui/lab'

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
  const deleteUserMutation = useDeleteInvoice()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteInvoiceValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) deleteUserMutation.mutateAsync({ id: row?.id })
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/invoices/${row?.id}/update`)
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
          Editer
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
        title={`Supprimer Facture ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteInvoiceValidation}
      />
    </>
  )
}

const InvoiceColumn = ({ type }) => {
  const sendEmailMutation = useSendInvoiceEmail()
  if (type === 0) {
    return [
      {
        headerAlign: 'center',
        flex: 0.03,
        field: '',
        align: 'center',
        renderCell: ({ row }) => (
          <CustomAvatar
            sx={{ width: 30, height: 30 }}
            skin='light'
            color={row?.payment_status?.color}
            variant='rounded'
          >
            <Icon icon={row?.payment_status?.icon} />
          </CustomAvatar>
        )

        // row?.active === 1 ? (
        // ) : (
        // )
      },
      {
        headerAlign: 'center',
        flex: 0.1,
        field: 'societe',
        headerName: 'Intitulé Societé',
        align: 'center',
        renderCell: ({ row }) => <Typography variant='body2'>{row?.society?.entitled}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.1,
        field: 'reference',
        headerName: 'Reference',
        align: 'center'

        // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
      },

      // {
      //   headerAlign: 'center',
      //   flex: 0.09,
      //   field: 'object',
      //   headerName: 'Intitulée',
      //   align: 'center'

      //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
      // },
      // TODO: Operation not working properly
      {
        headerAlign: 'center',
        flex: 0.1,
        field: 'operation',
        headerName: 'Operation',
        align: 'center',
        renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'client',
        headerName: 'Client',
        align: 'center',

        renderCell: ({ row }) => <Typography variant='body2'>{row?.user?.name}</Typography>

        // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'phone_number',
        headerName: 'Numéro de Téléphone',
        align: 'center',

        renderCell: ({ row }) => <Typography variant='body2'>{row?.user?.phone_number}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'amount_HT_total',
        headerName: 'Montant HT',
        align: 'center'
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'amount_discount',
        headerName: 'Montant Remise',
        align: 'center'
      },
      {
        headerAlign: 'center',
        flex: 0.1,
        field: 'tva_rate',
        headerName: 'Tva',
        align: 'center'
      },

      {
        headerAlign: 'center',
        flex: 0.16,
        minWidth: 100,
        field: 'created_at',
        headerName: 'Date de création',
        align: 'center'

        // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
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
              <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/invoices/${row.id}/update/`}>
                <Icon icon='mdi:eye-outline' />
              </IconButton>
            </Tooltip>
            <RowOptions row={row} />
          </Box>
        ),
        align: 'center'
      }
    ]
  } else if (type === 1) {
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

        // row?.active === 1 ? (
        // ) : (
        // )
      },
      {
        headerAlign: 'center',
        flex: 0.1,
        field: 'reference',
        headerName: 'Reference',
        align: 'center'

        // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.16,
        minWidth: 100,
        field: 'created_at',
        headerName: 'Date de création',
        align: 'center'

        // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'amount_HT_total',
        headerName: 'Montant Facture',
        align: 'center'
      },
      {
        headerAlign: 'center',
        flex: 0.15,
        field: 'phone_number',
        headerName: 'Solde',
        align: 'center'
      }
    ]
  }

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

      // row?.active === 1 ? (
      // ) : (
      // )
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'societe',
      headerName: 'Intitulé Societé',
      align: 'center',
      renderCell: ({ row }) => <Typography variant='body2'>{row?.society?.entitled}</Typography>
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'reference',
      headerName: 'Reference',
      align: 'center'

      // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
    },

    // {
    //   headerAlign: 'center',
    //   flex: 0.09,
    //   field: 'object',
    //   headerName: 'Intitulée',
    //   align: 'center'

    //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
    // },
    // TODO: Operation not working properly
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'operation',
      headerName: 'Operation',
      align: 'center',
      renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
    },
    {
      headerAlign: 'center',
      flex: 0.15,
      field: 'client',
      headerName: 'Client',
      align: 'center',

      renderCell: ({ row }) => <Typography variant='body2'>{row?.user?.name}</Typography>

      // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
    },
    {
      headerAlign: 'center',
      flex: 0.15,
      field: 'phone_number',
      headerName: 'Numéro de Téléphone',
      align: 'center',

      renderCell: ({ row }) => <Typography variant='body2'>{row?.user?.phone_number}</Typography>
    },
    {
      headerAlign: 'center',
      flex: 0.15,
      field: 'amount_HT_total',
      headerName: 'Montant HT',
      align: 'center'
    },
    {
      headerAlign: 'center',
      flex: 0.15,
      field: 'amount_discount',
      headerName: 'Montant Remise',
      align: 'center'
    },
    {
      headerAlign: 'center',
      flex: 0.1,
      field: 'tva_rate',
      headerName: 'Tva',
      align: 'center'
    },

    {
      headerAlign: 'center',
      flex: 0.16,
      minWidth: 100,
      field: 'created_at',
      headerName: 'Date de création',
      align: 'center'

      // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
    },
    {
      headerAlign: 'center',
      flex: 0.09,
      field: 'send_email',
      headerName: 'Email',
      align: 'center',

      renderCell: ({ row }) => (
        <LoadingButton
          disabled={row?.p_state !== 15}
          size='small'
          loadingPosition='start'
          loading={sendEmailMutation?.isLoading}
          color={row?.client_payment_notifcation_count === 0 ? 'primary' : 'success'}
          variant='outlined'
          onClick={async () => {
            await sendEmailMutation?.mutateAsync({
              invoices: [row?.id]
            })
          }}
        >
          <Icon icon='fluent:mail-20-regular' fontSize={20} />
        </LoadingButton>
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
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/invoices/${row.id}/update/`}>
              <Icon icon='mdi:eye-outline' />
            </IconButton>
          </Tooltip>
          <RowOptions row={row} />
        </Box>
      ),
      align: 'center'
    }
  ]
}

export default InvoiceColumn
