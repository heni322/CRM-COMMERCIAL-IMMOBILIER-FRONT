import { Box, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteClient } from 'src/services/users.service'
import { useAuth } from 'src/hooks/useAuth'
import useStates from 'src/hooks/useStates'
import Avatar from 'src/@core/components/mui/avatar'

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
  const deleteUserMutation = useDeleteClient()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    try {
      setSuspendDialogOpen(false)
      if (event) {
        await deleteUserMutation.mutateAsync({ id: row?.id })
      }
    } catch (error) {}
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/clients/${row?.id}/update`)
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
        title={`Suprimer Client ${row?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const CLientColum = ({ userRole }) => {
  const auth = useAuth()
  const state = useStates()
  const theme = useTheme()
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.03,
          field: '',
          align: 'center',
          renderCell: ({ row }) => {
            const rowState = state?.getStateByModel('User', row?.state)

            return <Icon icon={rowState?.icon} color={theme.palette[rowState?.color]?.main} />
          }

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

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>

          //   // <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //   //   {/* <Img src={row.img} alt={`project-${row.projectTitle}`} /> */}
          //   //   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          //   //     <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
          //   //     {/* <Typography variant='caption' sx={{ color: 'text.disabled' }}>
          //   //       {row.projectType}
          //   //     </Typography> */}
          //   //   </Box>
          //   // </Box>
          // )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'commercial',
          headerName: 'Commercial',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulée',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_type',
          headerName: 'Type',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_type?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_category',
          headerName: 'Catégorie',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_category?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number_1',
          headerName: 'N° Téléphone',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.12,
        //   field: 'email',
        //   headerName: 'Email',
        //   renderCell: ({ row }) => {
        //     const state = states?.find(e => row?.state === e?.id)

        //     return <CustomChip label={state?.description} skin='light' color={state?.color} />
        //   }
        // },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/clients/${row.id}/view/profile`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              <RowOptions row={row} />
            </Box>
          ),
          align: 'center'
        }
      ]
    case 'accountant':
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

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>

          //   // <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //   //   {/* <Img src={row.img} alt={`project-${row.projectTitle}`} /> */}
          //   //   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          //   //     <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
          //   //     {/* <Typography variant='caption' sx={{ color: 'text.disabled' }}>
          //   //       {row.projectType}
          //   //     </Typography> */}
          //   //   </Box>
          //   // </Box>
          // )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulée',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_type',
          headerName: 'Type',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_type?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_category',
          headerName: 'Catégorie',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_category?.entitled}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.15,
        //   field: 'email',
        //   headerName: 'Email',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        // },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          headerName: 'N° Téléphone',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.12,
        //   field: 'email',
        //   headerName: 'Email',
        //   renderCell: ({ row }) => {
        //     const state = states?.find(e => row?.state === e?.id)

        //     return <CustomChip label={state?.description} skin='light' color={state?.color} />
        //   }
        // },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'duration',
          headerName: 'Durée de traitement',
          align: 'center'
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
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/clients/${row.id}/view/profile`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit clients`)?.authorized && (
                <RowOptions row={row} />
              )}
            </Box>
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

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>

          //   // <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //   //   {/* <Img src={row.img} alt={`project-${row.projectTitle}`} /> */}
          //   //   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          //   //     <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
          //   //     {/* <Typography variant='caption' sx={{ color: 'text.disabled' }}>
          //   //       {row.projectType}
          //   //     </Typography> */}
          //   //   </Box>
          //   // </Box>
          // )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'name',
          headerName: 'Intitulée',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_type',
          headerName: 'Type',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_type?.entitled}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'client_category',
          headerName: 'Catégorie',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_category?.entitled}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.15,
        //   field: 'email',
        //   headerName: 'Email',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        // },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'phone_number',
          headerName: 'N° Téléphone',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.12,
        //   field: 'email',
        //   headerName: 'Email',
        //   renderCell: ({ row }) => {
        //     const state = states?.find(e => row?.state === e?.id)

        //     return <CustomChip label={state?.description} skin='light' color={state?.color} />
        //   }
        // },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'address',
          headerName: 'Adresse',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'duration',
          headerName: 'Durée de traitement',
          align: 'center'
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/clients/${row.id}/view/profile`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit clients`)?.authorized && (
                <RowOptions row={row} />
              )}
            </Box>
          ),
          align: 'center'
        }
      ]
      break
  }
}

export default CLientColum
