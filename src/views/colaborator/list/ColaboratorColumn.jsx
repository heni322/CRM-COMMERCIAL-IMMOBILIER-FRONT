import { Avatar, Box, LinearProgress, Tooltip, Typography, useTheme } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteUser } from 'src/services/users.service'
import { useAuth } from 'src/hooks/useAuth'
import { toast } from 'react-hot-toast'
import moment from 'moment'
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
  const deleteUserMutation = useDeleteUser()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteClientValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      try {
        await deleteUserMutation.mutateAsync({ id: row?.id })
      } catch (error) {
        // toast.error(error?.message)
      }
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
        title={`Suprimer Collaboratreur ${row?.name} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteClientValidation}
      />
    </>
  )
}

const ColaboratorColumn = ({ userRole }) => {
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
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Email',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'role',
          headerName: 'Role',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.role}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'created_at',
          headerName: 'Date de création',

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
          headerName: 'Action',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='Voir'>
                <IconButton
                  size='small'
                  component={Link}
                  sx={{ mr: 0.5 }}
                  href={`/collaborators/${row.id}/view/profile`}
                >
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit collaborators`)?.authorized && (
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
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'email',
          headerName: 'Email',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'role',
          headerName: 'Role',
          align: 'center',

          renderCell: ({ row }) => <Typography variant='body2'>{row?.role}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'created_at',
          headerName: 'Date de création',

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
          headerName: 'Action',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='Voir'>
                <IconButton
                  size='small'
                  component={Link}
                  sx={{ mr: 0.5 }}
                  href={`/collaborators/${row.id}/view/profile`}
                >
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {auth?.user?.resources?.find(item => item.resource_name === `edit collaborators`)?.authorized && (
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

export default ColaboratorColumn
