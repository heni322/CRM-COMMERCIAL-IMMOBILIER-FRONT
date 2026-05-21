// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormGroup from '@mui/material/FormGroup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import DialogAlert from 'src/components/DialogAlert'
import { useChangeDossierSold, useDeleteDossier, useGetRapports, useUpdateDossier } from 'src/services/dossier.service'
import { useRouter } from 'next/navigation'
import IconifyIcon from 'src/@core/components/icon'
import ReportDialog from 'src/components/ReportDialog'
import UploadReport from 'src/components/UploadReport'
import { Autocomplete, IconButton, Input } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import CustomList from 'src/components/CustomList'
import ReportsList from 'src/components/ReportsList'
import { useGetOperations } from 'src/services/operations.service'
import { useGetCompanies } from 'src/services/companies.service'

const data = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const LeftCard = ({ folderData, hideEdit, hideDelete }) => {
  // ** States
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState({})
  const [isOpenFolderDialog, setIsOpenFolderDialog] = useState(false)

  const [folderForm, setFolderForm] = useState({
    p_operations_id: '',
    p_society_id: '',
    operation_name: '',
    ref_audit: '',
    name: '',
    sold_out: false
  })

  //* Custome Hooks
  const router = useRouter()
  const auth = useAuth()

  const deleteFolderMutation = useDeleteDossier()
  const updateFolderMutation = useUpdateDossier()
  const soldFolderMutation = useChangeDossierSold(folderData?.id)
  const getOperationsList = useGetOperations()
  const getCompaniesList = useGetCompanies({ paginated: false })
  const getFolderRapportsQuery = useGetRapports(folderData?.id)
  const getFolderRapportsData = getFolderRapportsQuery?.data

  const handleDeleteFolder = async event => {
    setSuspendDialogOpen(false)
    if (event) {
      try {
        await deleteFolderMutation.mutateAsync({ id: folderData?.id })

        router.push('/folders')
      } catch (error) {}
    }
  }

  const handleCloseReportDialog = () => {
    setIsOpenFolderDialog(false)
  }

  const handleAuditChange = async () => {
    try {
      await updateFolderMutation.mutateAsync({
        values: folderForm,
        folderId: folderData?.id
      })

      // router.push('/folders')
    } catch (error) {
      // const errorsObject = error?.response?.data
      // setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    setFolderForm(prev => {
      const { operation, p_society_id, ref_audit, name, sold_out, ...rest } = folderData

      return {
        ...prev,
        p_operations_id: operation?.id,
        p_society_id: p_society_id,
        operation_name: operation?.name,
        ref_audit,
        sold_out: sold_out,
        name
      }
    })

    setIsChecked(folderData?.sold_out)

    // console.log(getCompaniesList?.data?.find(item => item?.id === folderForm?.p_society_id))
  }, [folderData])

  const handleInputChange = event => {
    setFolderForm(prev => {
      return { ...prev, [event.target?.name]: event.target?.value }
    })
  }

  const [isChecked, setIsChecked] = useState(false)

  const toggleHandler = async () => {
    setIsChecked(!isChecked)
    try {
      await soldFolderMutation.mutateAsync({
        values: {
          sold_out: folderData?.sold_out == 1 ? 0 : 1
        },
        folderId: folderData?.id
      })
    } catch (error) {
      // const errorsObject = error?.response?.data
      // setFormErrors(errorsObject)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card
          style={{
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <CardContent sx={{ pt: 4, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {auth?.user?.role === 'accountant' && (
              <div className='mb-2 ml-2 place-self-end'>
                <FormGroup row>
                  <FormControlLabel
                    label='Soldée'
                    control={
                      <Switch
                        checked={folderForm?.sold_out}
                        onChange={async event => {
                          try {
                            setFolderForm(prev => {
                              return { ...prev, sold_out: event?.target?.checked }
                            })
                            await soldFolderMutation.mutateAsync({
                              values: {
                                sold_out: event?.target?.checked
                              },
                              folderId: folderData?.id
                            })
                          } catch (error) {
                            // const errorsObject = error?.response?.data
                            // setFormErrors(errorsObject)
                          }
                        }}
                      />
                    }
                  />
                </FormGroup>
              </div>
            )}
            {isEditing?.name && auth?.user?.role !== 'client' && !hideEdit ? (
              <div className='flex flex-row items-center'>
                <Input type='text' value={folderForm?.name} name='name' onChange={handleInputChange} />
                <IconButton
                  onClick={() => {
                    // Handle the confirmation logic here
                    setIsEditing({ ...isEditing, name: false })
                    handleAuditChange()

                    // Update folderData with the edited text if needed
                  }}
                >
                  <IconifyIcon
                    className='w-[20px] h-5  text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                    icon='material-symbols:check'
                  />
                </IconButton>
              </div>
            ) : (
              <div className='flex flex-row items-center group'>
                <Typography variant='h5' sx={{ mb: 2 }}>
                  {folderData?.name}
                </Typography>
                {auth?.user?.role !== 'client' && !hideEdit && (
                  <IconButton
                    className={`edit-button opacity-0 group-hover:opacity-100`}
                    onClick={() => {
                      setIsEditing({ ...isEditing, name: true })
                    }}
                  >
                    <IconifyIcon
                      className='w-[20px] h-5 mt-[-8px] text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                      icon='mdi:pencil'
                    />
                  </IconButton>
                )}
              </div>
            )}

            {auth?.user?.role !== 'client' && (
              <>
                {folderData?.assigned_user?.name && (
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Assigné à: {folderData?.assigned_user?.name}
                  </Typography>
                )}
              </>
            )}
            <CustomChip
              label={folderData?.state?.entitled}
              skin='light'
              color={folderData?.state?.color}
              sx={{
                height: 20,
                fontWeight: 600,
                borderRadius: '5px',
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                '& .MuiChip-label': { mt: -0.25 }
              }}
            />
          </CardContent>
          <CardContent sx={{ my: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* {folderData?.is_payed ? (
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, color: 'green' }}>
                    <Icon icon='mdi:currency-usd' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='body1'>Payé</Typography>
                  </div>
                </Box>
              ) : (
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, color: 'red' }}>
                    <Icon icon='mdi:currency-usd-off' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='body1'>Payé</Typography>
                  </div>
                </Box>
              )} */}

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {folderData?.is_billed ? (
                  <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, color: 'green' }}>
                      <Icon icon='mdi:file-outline' />
                    </CustomAvatar>
                    <div>
                      {/* <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                    1.23k
                  </Typography> */}
                      <Typography variant='body1'>Facturé</Typography>
                    </div>
                  </Box>
                ) : (
                  <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, color: 'red' }}>
                      <Icon icon='mdi:file-remove-outline' />
                    </CustomAvatar>
                    <div>
                      {/* <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                    1.23k
                  </Typography> */}
                      <Typography variant='body1'>Non Facturé</Typography>
                    </div>
                  </Box>
                )}
              </Box>
            </Box>
            <LinearProgress
              value={folderData?.progress}
              variant='determinate'
              sx={{ height: 4, borderRadius: '5px', marginTop: '15px' }}
            />
            {folderData?.state?.entitled !== 'Nouveau' ? (
              <>
                {(auth?.user?.role !== 'client' || getFolderRapportsData?.length !== 0) && (
                  <Box sx={{ pt: 4 }}>
                    <Box sx={{ pb: 4 }}>
                      <Typography variant='h6' className='flex'>
                        <div className='text-[15px] w-full'>
                          <div className='flex flex-row items-center justify-between mb-2 text-xl'>
                            <div className='w-1/2'>
                              <div className=''>{getFolderRapportsData ? <>Rapports</> : null}</div>
                            </div>

                            <div className='ml-20 cursor-pointer '>
                              {auth?.user?.resources?.find(item => item.resource_name === `create rapports`)
                                ?.authorized && <UploadReport folder={folderData} reportType={'report'} />}
                            </div>
                          </div>
                          {(getFolderRapportsData?.find(item => item?.versions?.length > 0) ||
                            auth?.user?.resources?.find(item => item.resource_name === `create rapports`)
                              ?.authorized) && <ReportsList reports={getFolderRapportsData} />}
                        </div>
                      </Typography>
                    </Box>

                    <LinearProgress
                      value={folderData?.progress}
                      variant='determinate'
                      sx={{ height: 4, borderRadius: '5px' }}
                    />
                  </Box>
                )}
              </>
            ) : null}
          </CardContent>
          <CardContent>
            <Typography variant='h6' className='grid grid-cols-2'>
              <div>Details</div>
            </Typography>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>Client:</Typography>

                <Typography variant='body1' sx={{ textTransform: 'capitalize' }}>
                  {folderData?.client_object?.name}({folderData?.client_object?.reference})
                </Typography>
              </Box>
              {auth?.user?.role !== 'client' && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Assigné à:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.assigned_user?.name}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <div className='flex flex-row items-center'>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Réference Audit:</Typography>
                  {isEditing?.ref_audit && auth?.user?.role !== 'client' && !hideEdit ? (
                    <div className='flex flex-row '>
                      <Input type='text' value={folderForm?.ref_audit} name='ref_audit' onChange={handleInputChange} />
                      <IconButton
                        onClick={() => {
                          // Handle the confirmation logic here
                          setIsEditing({ ...isEditing, ref_audit: false })
                          handleAuditChange()

                          // Update folderData with the edited text if needed
                        }}
                      >
                        <IconifyIcon
                          className='w-[20px] h-5  text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                          icon='material-symbols:check'
                        />
                      </IconButton>
                    </div>
                  ) : (
                    <div className='flex flex-row items-center group'>
                      <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                        {folderForm?.ref_audit}
                      </Typography>
                      {auth?.user?.role !== 'client' && !hideEdit && (
                        <IconButton
                          className={`edit-button opacity-0 group-hover:opacity-100`}
                          onClick={() => {
                            setIsEditing({ ...isEditing, ref_audit: true })
                          }}
                        >
                          <IconifyIcon
                            className='w-[20px] h-5 mt-[-8px] text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                            icon='mdi:pencil'
                          />
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <div className='flex flex-row items-center'>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Operation: </Typography>
                  {isEditing?.operation && auth?.user?.role !== 'client' && !hideEdit ? (
                    <div className='flex flex-row'>
                      <FormControl>
                        <Autocomplete
                          onChange={(event, newValue) => {
                            setFolderForm(prev => {
                              return { ...prev, p_operations_id: newValue?.id }
                            })
                          }}
                          options={getOperationsList?.data || []}
                          getOptionLabel={option => option.name}
                          defaultValue={getOperationsList?.data?.find(item => item?.id === folderForm?.p_operations_id)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              variant='standard'
                              fullWidth
                              sx={{
                                width: 200
                              }}

                              // error={!!formErrors?.data?.operation}
                              // helperText={renderArrayMultiline(formErrors?.data?.operation)}
                            />
                          )}
                        />
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          // Handle the confirmation logic here
                          setIsEditing({ ...isEditing, operation: false })
                          handleAuditChange()

                          // Update folderData with the edited text if needed
                        }}
                      >
                        <IconifyIcon
                          className='w-[20px] h-5  text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                          icon='material-symbols:check'
                        />
                      </IconButton>
                    </div>
                  ) : (
                    <div className='flex flex-row items-center group'>
                      <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                        {folderForm?.operation_name}
                      </Typography>
                      {auth?.user?.role !== 'client' && !hideEdit && (
                        <IconButton
                          className={`edit-button opacity-0 group-hover:opacity-100`}
                          onClick={() => {
                            setIsEditing({ ...isEditing, operation: true })
                          }}
                        >
                          <IconifyIcon
                            className='w-[20px] h-5 mt-[-8px] text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                            icon='mdi:pencil'
                          />
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
              </Box>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <div className='flex flex-row items-center'>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Bureau d'étude: </Typography>
                  {isEditing?.company && !hideEdit && auth?.user?.role !== 'client' && !folderData?.is_billed ? (
                    <div className='flex flex-row'>
                      <FormControl>
                        <Autocomplete
                          onChange={(event, newValue) => {
                            setFolderForm(prev => {
                              return { ...prev, p_society_id: newValue?.id }
                            })
                          }}
                          options={getCompaniesList?.data || []}
                          getOptionLabel={option => option.entitled}
                          defaultValue={getCompaniesList?.data?.find(item => item?.id === folderForm?.p_society_id)}
                          renderInput={params => (
                            <TextField
                              {...params}
                              variant='standard'
                              fullWidth
                              sx={{
                                width: 200
                              }}

                              // error={!!formErrors?.data?.operation}
                              // helperText={renderArrayMultiline(formErrors?.data?.operation)}
                            />
                          )}
                        />
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          // Handle the confirmation logic here
                          setIsEditing({ ...isEditing, company: false })
                          handleAuditChange()

                          // Update folderData with the edited text if needed
                        }}
                      >
                        <IconifyIcon
                          className='w-[20px] h-5  text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                          icon='material-symbols:check'
                        />
                      </IconButton>
                    </div>
                  ) : (
                    <div className='flex flex-row items-center group'>
                      <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                        {folderData?.society?.entitled}
                      </Typography>
                      {auth?.user?.role !== 'client' && !hideEdit && (
                        <IconButton
                          className={`edit-button opacity-0 group-hover:opacity-100`}
                          onClick={() => {
                            setIsEditing({ ...isEditing, company: true })
                          }}
                        >
                          <IconifyIcon
                            className='w-[20px] h-5 mt-[-8px] text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                            icon='mdi:pencil'
                          />
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
              </Box>

              {folderData?.expected_start_date && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date début prévu:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.expected_start_date}
                  </Typography>
                </Box>
              )}
              {folderData?.expected_due_date && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date fin Prévue:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.expected_due_date}
                  </Typography>
                </Box>
              )}
              {/* {folderData?.start_date && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Date début:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.start_date}
                  </Typography>
                </Box>
              )} */}
              {folderData?.due_date && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Date de Cloture du Dossier:
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.due_date}
                  </Typography>
                </Box>
              )}
              {folderData?.description && (
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Date de Cloture du Dossier:
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {folderData?.description}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', mb: 2.7 }}>
              <div className='flex flex-row items-center'>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Commentaire Client:</Typography>
                {isEditing?.client_comment && auth?.user?.role !== 'client' && !hideEdit ? (
                  <div className='flex flex-row '>
                    <TextField
                      multiline
                      rows={4}
                      variant='outlined'
                      fullWidth
                      label='Commentaire Client'
                      name='client_comment'
                      value={folderForm?.client_comment}
                      onChange={handleInputChange}
                      placeholder='Ajoutez un commentaire pour le client'
                    />
                    <IconButton
                      onClick={() => {
                        setIsEditing({ ...isEditing, client_comment: false })
                        handleAuditChange()
                      }}
                    >
                      <IconifyIcon
                        className='w-[20px] h-5  text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                        icon='material-symbols:check'
                      />
                    </IconButton>
                  </div>
                ) : (
                  <div className='flex flex-row items-center group'>
                    <div className='flex items-center place-content-center flex-row relative group'>
                      <p className='max-w-40 w-40 text-sm whitespace-nowrap text-center group hover:whitespace-pre-line overflow-hidden'>
                        {folderForm?.client_comment ? <p>{folderForm?.client_comment}</p> : 'Aucun Commentaire'}
                      </p>
                    </div>
                    {auth?.user?.role !== 'client' && !hideEdit && (
                      <IconButton
                        className={`edit-button opacity-0 group-hover:opacity-100`}
                        onClick={() => {
                          setIsEditing({ ...isEditing, client_comment: true })
                        }}
                      >
                        <IconifyIcon
                          className='w-[20px] h-5 mt-[-8px] text-sky-900 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                          icon='mdi:pencil'
                        />
                      </IconButton>
                    )}
                  </div>
                )}
              </div>
            </Box>
            {!hideDelete && (
              <>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button
                    onClick={() => {
                      setSuspendDialogOpen(true)
                    }}
                    size='large'
                    type='button'
                    sx={{ mr: 2 }}
                    variant='outlined'
                    color={'error'}
                  >
                    {'Supprimer'}
                  </Button>
                  {/* <Button type='reset' size='large' color='secondary' variant='outlined'>
          Reset
        </Button> */}
                </CardActions>
                <DialogAlert
                  open={suspendDialogOpen}
                  description=''
                  setOpen={setSuspendDialogOpen}
                  title={`Supprimer dossier ${folderData?.reference} ?`}
                  acceptButtonTitle='Accepter'
                  declineButtonTitle='Annuler'
                  color={'error'}
                  handleAction={handleDeleteFolder}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      <ReportDialog
        file={folderData?.rapport}
        folder={folderData}
        open={isOpenFolderDialog}
        onDialogStatusChange={handleCloseReportDialog}
        onClose={() => handleCloseDialog(index)}
      />
    </Grid>
  )
}

export default LeftCard
