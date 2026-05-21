// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import MainCard from 'src/components/MainCard'
import { useGetDossierById } from 'src/services/dossier.service'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack
} from '@mui/material'
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'
import UserViewOverview from 'src/views/apps/user/view/UserViewOverview'
import LeftCard from './details/LeftCard'
import AssingUser from './details/AssingUser'
import TimeLineComponent from 'src/components/TimeLine'
import ChangeState from './details/ChangeState'
import { useAuth } from 'src/hooks/useAuth'
import FilesCard from 'src/components/FileCard'
import { useDeleteCompany, useGetCompaniesById } from 'src/services/companies.service'
import DialogAlert from 'src/components/DialogAlert'
import Image from 'next/image'

// ** Demo Components

const CompanyDetails = ({ companyId }) => {
  // ** Authed User
  const auth = useAuth()

  // ** States
  const [desabledAssign, setDisabledAssign] = useState(true)
  const [desabledChangeState, setDisabledChangeState] = useState(true)
  const [hideEdit, setHideEdit] = useState(true)
  const [hideDelete, setHideDelete] = useState(true)

  // ** React Query
  const CompanyQuery = useGetCompaniesById(companyId)
  const companyData = CompanyQuery?.data
  const logoUrl = companyData?.logo_url
  console.log('====================================')
  console.log(logoUrl)
  console.log('====================================')
  useEffect(() => {
    if (auth?.user?.resources?.find(item => item.resource_name === `edit companies`)?.authorized) {
      if (companyData?.permissions?.edit) {
        setHideEdit(false)
        setDisabledAssign(companyData?.state <= 1 && false)
        setDisabledChangeState(companyData?.state == 7 && false)
      }
    }
    if (auth?.user?.resources?.find(item => item.resource_name === `delete companies`)?.authorized) {
      if (companyData?.permissions?.delete) {
        setHideDelete(false)
      }
    }
  }, [companyData, auth])

  return (
    <MainCard
      title={`Société - ${companyData?.entitled}`}
      backButton
      goBackLink='/companies'
      secondary={
        <>
          <RowOptions row={companyData} />
        </>
      }
      headerColor='primary.main'

      // content={false}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant='h5'>Informations générales</Typography>
                <Stack spacing={0}>
                  {companyData?.entitled && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Intitulée :</Typography>
                      <Typography variant='body1'>{companyData?.entitled}</Typography>
                    </Stack>
                  )}
                  {companyData?.immatriculation && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Immatriculation :</Typography>
                      <Typography variant='body1'> {companyData?.immatriculation}</Typography>
                    </Stack>
                  )}
                  {companyData?.siret_number && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>N° SIRET :</Typography>
                      <Typography variant='body1'> {companyData?.siret_number}</Typography>
                    </Stack>
                  )}
                  {companyData?.siren_number && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>N° SIREN :</Typography>
                      <Typography variant='body1'> {companyData?.siren_number}</Typography>
                    </Stack>
                  )}
                  {companyData?.rcs_number && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>N° RCS :</Typography>
                      <Typography variant='body1'> {companyData?.rcs_number}</Typography>
                    </Stack>
                  )}
                  {companyData?.opqibi_number && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>N° OPQIBI :</Typography>
                      <Typography variant='body1'> {companyData?.opqibi_number}</Typography>
                    </Stack>
                  )}
                  {companyData?.contract_assurance && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Contrat d'assurance :</Typography>
                      <Typography variant='body1'> {companyData?.contract_assurance}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant='h5'>Informations Bancaire</Typography>
                <Stack spacing={0}>
                  {companyData?.rib && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>RIB :</Typography>
                      <Typography variant='body1'> {companyData?.rib}</Typography>
                    </Stack>
                  )}
                  {companyData?.tva_number && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>N° TVA :</Typography>
                      <Typography variant='body1'> {companyData?.tva_number}</Typography>
                    </Stack>
                  )}
                  {companyData?.tva_rate && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Taux TVA :</Typography>
                      <Typography variant='body1'> {companyData?.tva_rate}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant='h5'>Informations de contact</Typography>
                <Stack spacing={0}>
                  {companyData?.phone && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Numéro de téléphone :</Typography>
                      <Typography variant='body1'> {companyData?.phone}</Typography>
                    </Stack>
                  )}

                  {companyData?.website && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Siteweb :</Typography>
                      <Typography variant='body1'>{companyData?.website}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant='h5'>Informations résidentielles</Typography>
                <Stack>
                  {companyData?.adress && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Addresse :</Typography>
                      <Typography variant='body1'> {companyData?.adress}</Typography>
                    </Stack>
                  )}
                  {companyData?.city && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Ville :</Typography>
                      <Typography variant='body1'> {companyData?.city}</Typography>
                    </Stack>
                  )}
                  {companyData?.zip_code && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Code postal :</Typography>
                      <Typography variant='body1'>{companyData?.zip_code}</Typography>
                    </Stack>
                  )}
                  {companyData?.footer1 && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Pied de page 1 :</Typography>
                      <Typography variant='body1'>{companyData?.footer1}</Typography>
                    </Stack>
                  )}
                  {companyData?.footer2 && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Pied de page 2 :</Typography>
                      <Typography variant='body1'>{companyData?.footer2}</Typography>
                    </Stack>
                  )}
                  {companyData?.primary_color && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Couleur Primaire:</Typography>
                      <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                        {circleItem({ couleur: companyData?.primary_color })}
                      </div>
                      {/* <Typography variant='body1'>{companyData?.primary_color}</Typography> */}
                    </Stack>
                  )}
                  {companyData?.secondary_color && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Couleur Secondaire:</Typography>
                      <div style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                        {circleItem({ couleur: companyData?.secondary_color })}
                      </div>
                      {/* <Typography variant='body1'>{companyData?.secondary_color}</Typography> */}
                    </Stack>
                  )}
                  {companyData?.logo && (
                    <Stack direction='row' spacing={1}>
                      <Typography variant='subtitle1'>Logo:</Typography>
                      <Image src={logoUrl} alt='haya' width={120} height={120} />
                      {/* <Typography variant='body1'>{companyData?.logo}</Typography> */}
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default CompanyDetails

const circleItem = item => {
  return (
    <div>
      <div style={{ width: 40, height: 20, backgroundColor: item?.couleur, borderRadius: 5 }} />
    </div>
  )
}

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
        <Icon icon='mdi:dots-vertical' color='white' />
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
        title={`Suprimer Société ${row?.entitled} ?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={deleteCompanyValidation}
      />
    </>
  )
}
