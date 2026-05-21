import { Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGetStates } from 'src/services/preferences.service'
import CustomChip from 'src/@core/components/mui/chip'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteDossier } from 'src/services/dossier.service'
import CustomAvatar from 'src/@core/components/mui/avatar'
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

const RowOptions = ({ row }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const deleteFolderMutation = useDeleteDossier()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteFolderValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) await deleteFolderMutation.mutateAsync({ id: row?.id })
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/folders/${row.id}/details`)
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
          Edit
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
        title={`Suprimer Dossier ${row?.reference} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteFolderValidation}
      />
    </>
  )
}

const DossierColum = ({ userRole }) => {
  // const statesQuery = useGetStates({ model: 'DFolder' })
  // const states = statesQuery?.data
  const { user } = useAuth()
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
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'operation',
          headerName: 'Operation',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.03,
        //   field: '',
        //   align: 'center',
        //   align: 'center',
        //   renderCell: ({ row }) => (
        //     <CustomAvatar sx={{ width: 30, height: 30 }} skin='light' color={row?.state?.color} variant='rounded'>
        //       <Icon icon={row?.state?.icon} />
        //     </CustomAvatar>
        //   )

        //   // row?.active === 1 ? (
        //   // ) : (
        //   // )
        // },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulé du dossier',
          align: 'center'

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
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
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'is_billed',
          headerName: 'Facturé',
          align: 'center',
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
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.05,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} href={`/folders/${row?.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              <Tooltip title='More'>
                <RowOptions row={row} />
              </Tooltip>
            </Box>
          )
        }
      ]
    case 'accountant':
      return [
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
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
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulé du dossier',
          align: 'center'
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'sold_out',
        //   headerName: 'Soldée',
        //   align: 'center'
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.2,
        //   field: 'payment',
        //   headerName: 'Payment',
        //   align: 'center'
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.2,
        //   field: 'facture?.refrence',
        //   headerName: 'Réfrence facture',
        //   align: 'center'
        // },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'noveau_to_bill',
          headerName: 'Facturé',
          align: 'center',
          renderCell: ({ row }) => (
            <Box>
              {row?.noveau_to_bill == 0 ? (
                <CustomChip label='Facturé' skin='light' color='success' />
              ) : (
                <CustomChip label='Non Facturé' skin='light' color='error' />
              )}
            </Box>
          )
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'modification_to_bill',
          headerName: 'Nbre fact Mod',
          align: 'center'
        },

        {
          headerAlign: 'center',
          flex: 0.05,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} href={`/folders/${row?.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              <Tooltip title='More'>
                <RowOptions row={row} />
              </Tooltip>
            </Box>
          )
        }
      ]
    case 'client':
      return [
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },

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
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulé du dossier',
          align: 'center'

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
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
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'is_billed',
          headerName: 'Facturé',
          align: 'center',
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
          flex: 0.2,
          field: 'payment',
          headerName: 'Payment',
          align: 'center'
        },
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'billing_count',
          headerName: 'Nbre facturation',
          align: 'center'
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'qte_received',
        //   headerName: 'Qté Récu',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.qte_received}</Typography>
        // },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'start_date',
        //   headerName: 'Date debut réel',
        //   align:'center',
        // renderCell: ({ row }) => <Typography variant='body2'>{row?.start_date}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'due_date',
        //   headerName: 'Date fin réel',
        //   align:'center',
        // renderCell: ({ row }) => <Typography variant='body2'>{row?.due_date}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 100,
        //   field: 'EngeneerName',
        //   headerName: "Nom de l'ingenieur",
        //   align:'center',
        // renderCell: ({ row }) => <Typography variant='body2'>{row.assigned_user?.name}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 200,
        //   headerName: 'Progress',
        //   field: 'progressValue',
        //   align:'center',
        //renderCell: ({ row }) => (
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
          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <RowOptions row={row} /> */}
            </Box>
          )
        }
      ]
    case 'team_lead':
      return [
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'operation',
          headerName: 'Operation',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.03,
        //   field: '',
        //   align: 'center',
        //   align: 'center',
        //   renderCell: ({ row }) => (
        //     <CustomAvatar sx={{ width: 30, height: 30 }} skin='light' color={row?.state?.color} variant='rounded'>
        //       <Icon icon={row?.state?.icon} />
        //     </CustomAvatar>
        //   )

        //   // row?.active === 1 ? (
        //   // ) : (
        //   // )
        // },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulé du dossier',
          align: 'center'

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
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
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'is_payed',
        //   headerName: 'Payé',
        //   align:'center',
        //renderCell: ({ row }) => (
        //     <Box>
        //       {row?.is_payed ? (
        //         <CustomChip label='Payé' skin='light' color='success' />
        //       ) : (
        //         <CustomChip label='Non Payé' skin='light' color='error' />
        //       )}
        //     </Box>
        //   )
        // },
        {
          headerAlign: 'center',
          flex: 0.13,
          field: 'is_billed',
          headerName: 'Facturé',
          align: 'center',
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

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'qte_received',
        //   headerName: 'Qté Récu',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.qte_received}</Typography>
        // },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'start_date',
        //   headerName: 'Date debut réel',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.start_date}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'due_date',
        //   headerName: 'Date fin réel',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.due_date}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 100,
        //   field: 'EngeneerName',
        //   headerName: "Nom de l'ingenieur",
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row.assigned_user?.name}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 200,
        //   headerName: 'Progress',
        //   field: 'progressValue',
        //   align:'center',
        //renderCell: ({ row }) => (
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
          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <RowOptions row={row} /> */}
            </Box>
          )
        }
      ]
    case 'engineer':
      return [
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.1,
          field: 'operation',
          headerName: 'Operation',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.03,
        //   field: '',
        //   align: 'center',
        //   align: 'center',
        //   renderCell: ({ row }) => (
        //     <CustomAvatar sx={{ width: 30, height: 30 }} skin='light' color={row?.state?.color} variant='rounded'>
        //       <Icon icon={row?.state?.icon} />
        //     </CustomAvatar>
        //   )

        //   // row?.active === 1 ? (
        //   // ) : (
        //   // )
        // },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulé du dossier',
          align: 'center'

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
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
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'ref_audit',
          headerName: "Reference de  l'audit",
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'is_payed',
        //   headerName: 'Payé',
        //   align:'center',
        //renderCell: ({ row }) => (
        //     <Box>
        //       {row?.is_payed ? (
        //         <CustomChip label='Payé' skin='light' color='success' />
        //       ) : (
        //         <CustomChip label='Non Payé' skin='light' color='error' />
        //       )}
        //     </Box>
        //   )
        // },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'start_date',
        //   headerName: 'Date debut réel',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.start_date}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'due_date',
        //   headerName: 'Date fin réel',
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row?.due_date}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 100,
        //   field: 'EngeneerName',
        //   headerName: "Nom de l'ingenieur",
        //   align:'center',
        //renderCell: ({ row }) => <Typography variant='body2'>{row.assigned_user?.name}</Typography>
        // },

        // {
        //   flex: 0.15,
        //   minWidth: 200,
        //   headerName: 'Progress',
        //   field: 'progressValue',
        //   align:'center',
        //renderCell: ({ row }) => (
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
          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <RowOptions row={row} /> */}
            </Box>
          )
        }
      ]
    case 'fiche_client':
      if (user?.role === 'accountant') {
        return [
          {
            headerAlign: 'center',
            flex: 0.12,
            field: 'state',
            headerName: 'Statut',
            align: 'center',
            align: 'center',
            renderCell: ({ row }) => {
              // const state = states?.find(e => row?.state === e?.id)

              return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
            }
          },
          {
            headerAlign: 'center',
            flex: 0.2,
            field: 'operation',
            headerName: 'Operation',
            align: 'center',
            renderCell: ({ row }) => <Typography variant='body2'>{row?.operation?.name}</Typography>
          },
          {
            headerAlign: 'center',
            flex: 0.2,
            field: 'name',
            headerName: 'Intitulée de dossier',
            align: 'center',

            align: 'center'

            // renderCell: ({ row }) => (
            //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
            //       <Typography noWrap variant='caption'></Typography>
            //     </Box>
            //   </Box>
            // )
          },
          {
            headerAlign: 'center',
            flex: 0.1,
            field: 'sold_out',
            headerName: 'Soldée',
            align: 'center'
          },
          {
            headerAlign: 'center',
            flex: 0.1,
            field: 'payment',
            headerName: 'Payment',
            align: 'center'
          },
          {
            headerAlign: 'center',
            flex: 0.2,
            field: 'facture-refrence',
            headerName: 'Réfrence facture',
            align: 'center',
            renderCell: ({ row }) => <Typography variant='body2'>{row?.facture?.refrence}</Typography>
          },
          {
            headerAlign: 'center',
            flex: 0.16,
            minWidth: 100,
            field: 'created_at',
            headerName: 'Date dépot',
            align: 'center',

            align: 'center',
            renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
          },
          {
            headerAlign: 'center',
            flex: 0.16,
            minWidth: 100,
            field: 'expected_due_date',
            headerName: 'Date fin Prévue',
            align: 'center',

            align: 'center',
            renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
          },

          {
            headerAlign: 'center',
            flex: 0.05,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            align: 'center',

            align: 'center',
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tooltip title='View'>
                  <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                    <Icon icon='mdi:eye-outline' />
                  </IconButton>
                </Tooltip>
                {/* <RowOptions row={row} /> */}
              </Box>
            )
          }
        ]
      }

      return [
        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
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
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulée de dossier',
          align: 'center',

          align: 'center'

          // renderCell: ({ row }) => (
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          //       <StyledLink href={`/apps/dossiers/${row.id}/details-dossier/`}>{row.name}</StyledLink>
          //       <Typography noWrap variant='caption'></Typography>
          //     </Box>
          //   </Box>
          // )
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.05,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <RowOptions row={row} /> */}
            </Box>
          )
        }
      ]
    case 'dashboard':
      return [
        {
          headerAlign: 'center',
          flex: 0.18,
          field: 'client',
          headerName: 'Intitulé Client',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.client_object?.name}</Typography>
        },
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
          flex: 0.1,
          field: 'Auditeur',
          headerName: 'Auditeur',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.assigned_user?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'state',
          headerName: 'Statut',
          align: 'center',
          align: 'center',
          renderCell: ({ row }) => {
            // const state = states?.find(e => row?.state === e?.id)

            return <CustomChip label={row?.state?.entitled} skin='light' color={row?.state?.color} />
          }
        },
        {
          headerAlign: 'center',
          flex: 0.2,
          field: 'name',
          headerName: 'Intitulée de dossier',
          align: 'center'
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.12,
        //   field: 'is_payed',
        //   headerName: 'Payé',
        //   align: 'center',
        //   renderCell: ({ row }) => (
        //     <Box>
        //       {row?.is_payed ? (
        //         <CustomChip label='Payé' skin='light' color='success' />
        //       ) : (
        //         <CustomChip label='Non Payé' skin='light' color='error' />
        //       )}
        //     </Box>
        //   )
        // },
        {
          headerAlign: 'center',
          flex: 0.13,
          field: 'is_billed',
          headerName: 'Facturé',
          align: 'center',
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
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.qte_received}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'created_at',
          headerName: 'Date dépot',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'expected_due_date',
          headerName: 'Date fin Prévue',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.expected_due_date}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'start_date',
          headerName: 'Date debut réel',
          align: 'center',
          renderCell: ({ row }) => <Typography variant='body2'>{row?.start_date}</Typography>
        },

        // {
        //   flex: 0.1,
        //   minWidth: 200,
        //   headerName: 'Progress',
        //   field: 'progressValue',
        //   align: 'center',
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
          flex: 0.1,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          align: 'center',

          align: 'center',
          renderCell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/folders/${row.id}/details`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <RowOptions row={row} /> */}
            </Box>
          )
        }
      ]
    default:
      return []
      break
  }
}

export default DossierColum
