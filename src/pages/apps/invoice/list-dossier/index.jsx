// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'
import { useGetDossier } from 'src/services/dossier.service'
import { useGetUsersById } from 'src/services/users.service'
import { Fab, IconButton, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'

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
  console.log(id)

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

const columns = [
  {
    flex: 0.3,
    minWidth: 230,
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
    flex: 0.15,
    minWidth: 100,
    field: 'creationDate',
    headerName: 'Date de creation',
    renderCell: ({ row }) => <Typography variant='body2'>{row.created_at}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'clientName',
    headerName: 'Nom de client',
    renderCell: ({ row }) => <Typography variant='body2'>{row.client?.name}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'folderStatus',
    headerName: 'Statut du dossier',
    renderCell: ({ row }) => <Typography variant='body2'>{row.status}</Typography>
  },

  // {
  //   flex: 0.15,
  //   minWidth: 100,
  //   field: 'EngeneerName',
  //   headerName: "Nom de l'ingenieur",
  //   renderCell: ({ row }) => <Typography variant='body2'>{row.assigned_user?.name}</Typography>
  // },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'ref_audit',
    headerName: 'Reference Auditeur',
    renderCell: ({ row }) => <Typography variant='body2'>{row?.ref_audit}</Typography>
  },

  {
    flex: 0.15,
    minWidth: 200,
    headerName: 'Progress',
    field: 'progressValue',
    renderCell: ({ row }) => (
      <Box sx={{ width: '100%' }}>
        <Typography variant='body2'>{row.progress}%</Typography>
        <LinearProgress
          variant='determinate'
          value={row.progress}
          color={row.progressColor}
          sx={{ height: 6, mt: 1, borderRadius: '5px' }}
        />
      </Box>
    )
  },

  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const FolderList = () => {
  const getFolderList = useGetDossier()

  return (
    <Card>
      <CardHeader title='Liste des Dossiers' />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* <Typography variant='body2' sx={{ mr: 2 }}>
            Rechercher:
          </Typography> */}
          <Link href='/apps/dossiers/add-dossier'>
            <Fab color='primary' aria-label='add' size='small'>
              <Icon icon='mdi:plus' />
            </Fab>
          </Link>
          {/* <TextField size='small' placeholder='chercher unDossier' value={value} onChange={e => setValue(e.target.value)} /> */}
        </Box>
      </CardContent>

      {getFolderList.isSuccess && (
        <DataGrid
          autoHeight
          rows={getFolderList?.data?.data}
          columns={columns}
          disableSelectionOnClick
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
      )}
    </Card>
  )
}

export default FolderList
