import { Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGetStates } from 'src/services/preferences.service'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteUser } from 'src/services/users.service'
import { useDeleteUserFromGroup } from 'src/services/groups.service'
import { useAuth } from 'src/hooks/useAuth'

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

const RowOptions = ({ row, groupId }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const deleteUserFromGroupMutation = useDeleteUserFromGroup()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) await deleteUserFromGroupMutation.mutateAsync({ groupId: groupId, userId: row?.id })
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/collaborators/${row?.id}/update`)
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
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Supprimer de groupe
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

const GroupUsersColumn = ({ userRole, groupId }) => {
  const statesQuery = useGetStates({ model: 'DFolder' })
  const states = statesQuery?.data
  const auth = useAuth()
  switch (userRole) {
    case 'admin':
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
          //   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>

          //   // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          field: 'role',
          headerName: 'Role',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.roles[0]?.name}</Typography>
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
                <IconButton
                  size='small'
                  component={Link}
                  sx={{ mr: 0.5 }}
                  href={`/collaborators/${row.id}/view/profile`}
                >
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit clients`)?.authorized && (
                <Tooltip title='View'>
                  <RowOptions row={row} groupId={groupId} />
                </Tooltip>
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
          //   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>

          //   // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        }

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'created_at',
        //   headerName: 'Date de création',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   sortable: false,
        //   field: 'actions',
        //   headerName: 'Actions',
        //   renderCell: ({ row }) => (
        //     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //       <Tooltip title='View'>
        //         <IconButton
        //           size='small'
        //           component={Link}
        //           sx={{ mr: 0.5 }}
        //           href={`/collaborators/${row.id}/view/profile`}
        //         >
        //           <Icon icon='mdi:eye-outline' />
        //         </IconButton>
        //       </Tooltip>
        //       {auth?.user?.resources?.find(item => item.resource_name === `edit clients`)?.authorized && (
        //         <Tooltip title='edit'>
        //           <RowOptions row={row} groupId={groupId} />
        //         </Tooltip>
        //       )}
        //     </Box>
        //   ),
        //   align: 'center'
        // }
      ]
      break
  }
}

export default GroupUsersColumn
