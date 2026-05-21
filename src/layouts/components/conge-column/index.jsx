import { Box, LinearProgress, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGetStates } from 'src/services/preferences.service'
import CustomChip from 'src/@core/components/mui/chip'

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

const RowOptions = ({ id }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/apps/dossiers/${id}/edit`)
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
    </>
  )
}

const CongeColum = ({ userRole }) => {
  const statesQuery = useGetStates({ model: 'DFolder' })
  const states = statesQuery?.data
  switch (userRole) {
    case 'admin':
      return [
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'folderName',
          headerName: 'Nom de dossier',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
                <Typography noWrap variant='caption'></Typography>
              </Box>
            </Box>

            // <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //   {/* <Img src={row.img} alt={`project-${row.projectTitle}`} /> */}
            //   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            //     <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
            //     {/* <Typography variant='caption' sx={{ color: 'text.disabled' }}>
            //       {row.projectType}
            //     </Typography> */}
            //   </Box>
            // </Box>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Auditeur',
          headerName: 'Auditeur',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'state',
          headerName: 'Status',
          renderCell: ({ row }) => {
            const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={state?.description} skin='light' color={state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'is_payed',
          headerName: 'Payé',
          renderCell: ({ row }) => (
            <Box>
              {row?.is_payed ? (
                <CustomChip label='Payé' skin='light' color='success' />
              ) : (
                <CustomChip label='Non Payé' skin='light' color='error' />
              )}
            </Box>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.13,
          field: 'is_billed',
          headerName: 'Facturé',
          renderCell: ({ row }) => (
            <Box>
              {row?.is_billed ? (
                <CustomChip label='Facturé' skin='light' color='success' />
              ) : (
                <CustomChip label='Non Facturé' skin='light' color='error' />
              )}
            </Box>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'qte_received',
          headerName: 'Qté Récu',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.qte_received}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'start_date',
          headerName: 'Date debut réel',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.start_date}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'due_date',
          headerName: 'Date fin réel',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.due_date}</Typography>
        },

        // {
        //   flex: 0.15,
        //   minWidth: 100,
        //   field: 'EngeneerName',
        //   headerName: "Nom de l'ingenieur",
        //   renderCell: ({ row }) => <Typography variant='body2'>{row.assigned_user?.name}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 200,
        //   headerName: 'Progress',
        //   field: 'progressValue',
        //   renderCell: ({ row }) => (
        //     <Box sx={{ width: '100%' }}>
        //       <Typography variant='body2'>{row.progress}%</Typography>
        //       <LinearProgress
        //         variant='determinate'
        //         value={row.progress}
        //         color={row.progressColor}
        //         sx={{ height: 6, mt: 1, borderRadius: '5px' }}
        //       />
        //     </Box>
        //   )
        // },

        {
          headerAlign: 'center',
          flex: 0.05,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({ row }) => <RowOptions id={row.id} />
        }
      ]
    default:
      break
  }
}

export default CongeColum
