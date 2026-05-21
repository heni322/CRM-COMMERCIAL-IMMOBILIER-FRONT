import { Avatar, Box, LinearProgress, Tooltip, Typography } from '@mui/material'
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
import { useDeleteCompany } from 'src/services/companies.service'

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
  const deleteCompanyMutation = useDeleteCompany()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const deleteCompanyValidation = async event => {
    setSuspendDialogOpen(false)
    if (event) await deleteCompanyMutation.mutateAsync({ id: row?.id })
  }

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    handleRowOptionsClose()
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    router.push(`/companies/${row?.id}/update`)
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
        {/* <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Modifier
        </MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Suprimer Société ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteCompanyValidation}
      />
    </>
  )
}

const CompanyColumn = ({ userRole }) => {
  switch (userRole) {
    case 'admin':
      return [
        // {
        //   headerAlign: 'center',
        //   flex: 0.03,
        //   field: '',
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
        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'reference',
        //   headerName: 'Reference',
        //   align: 'center'

        //   // renderCell: ({ row }) => (
        //   //   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //   //     <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
        //   //       <StyledLink href={`/apps/dossiers/${row.reference}/details-dossier/`}>{row.name}</StyledLink>
        //   //       <Typography noWrap variant='caption'></Typography>
        //   //     </Box>
        //   //   </Box>

        //   //   // <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //   //   //   {/* <Img src={row.img} alt={`project-${row.projectTitle}`} /> */}
        //   //   //   <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        //   //   //     <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{row.name}</Typography>
        //   //   //     {/* <Typography variant='caption' sx={{ color: 'text.disabled' }}>
        //   //   //       {row.projectType}
        //   //   //     </Typography> */}
        //   //   //   </Box>
        //   //   // </Box>
        //   // )
        // },
        {
          headerAlign: 'center',
          flex: 0.09,
          field: 'entitled',
          headerName: 'Intitulée',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'adress',
          headerName: 'Adresse',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'city',
          headerName: 'Ville',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.email}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'zip_code',
          headerName: 'Code Postale',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.roles[0]?.display_name}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.15,
          field: 'immatriculation',
          headerName: 'immatriculation',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.user_group?.reference}</Typography>
        },

        {
          headerAlign: 'center',
          flex: 0.12,
          field: 'email',
          headerName: 'Email'

          // renderCell: ({ row }) => {
          //   const state = states?.find(e => row?.state === e?.id)

          //   return <CustomChip label={state?.description} skin='light' color={state?.color} />
          // }
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.1,
        //   field: 'siret_number',
        //   headerName: 'siret number',
        //   align: 'center'

        //   // renderCell: ({ row }) =>
        //   //   row?.is_expert === '1' ? (
        //   //     <Avatar
        //   //       variant='rounded'
        //   //       sx={{
        //   //         mr: 3,
        //   //         width: 40,
        //   //         height: 40,
        //   //         color: 'primary.main',
        //   //         backgroundColor: 'transparent'

        //   //         // border: theme => `2px solid ${theme.palette.primary.main}`
        //   //       }}
        //   //     >
        //   //       <Icon icon='mdi:star-outline' />
        //   //     </Avatar>
        //   //   ) : (
        //   //     <></>
        //   //   )
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'siren_number',
        //   headerName: 'siren number',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'rcs_number',
        //   headerName: 'rcs_number',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'opqibi_number',
        //   headerName: 'opqibi_number',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'contract_assurance',
        //   headerName: 'contract_assurance',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'phone',
          headerName: 'phone',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },
        {
          headerAlign: 'center',
          flex: 0.16,
          minWidth: 100,
          field: 'website',
          headerName: 'website',
          align: 'center'

          // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        },

        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'rib',
        //   headerName: 'rib',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'tva_rate',
        //   headerName: 'tva_rate',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'primary_color',
        //   headerName: 'primary_color',
        //   align: 'center'

        //   // renderCell: ({ row }) => <Typography variant='body2'>{row?.created_at}</Typography>
        // },
        // {
        //   headerAlign: 'center',
        //   flex: 0.16,
        //   minWidth: 100,
        //   field: 'secondary_color',
        //   headerName: 'secondary_color',
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
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/companies/${row.id}/update`}>
                  <Icon icon='mdi:eye-outline' />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title='View'>
                <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/companies/${row.id}/details`}>
                  <Icon icon='mdi:delete-outline' color='red' />
                </IconButton>
              </Tooltip> */}
              <RowOptions row={row} />
            </Box>
          ),
          align: 'center'
        }
      ]
    default:
      break
  }
}

export default CompanyColumn
