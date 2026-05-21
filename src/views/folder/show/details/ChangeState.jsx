import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAssignEngineer, useChangeState, useGetAvailableIng } from 'src/services/dossier.service'
import { useGetGroups } from 'src/services/groups.service'
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'
import { useGetstatesByModel } from 'src/services/states.service'
import { useAuth } from 'src/hooks/useAuth'
import DialogAlert from 'src/components/DialogAlert'
import ConfirmDialog from 'src/components/ConfirmDialog'

const ChangeState = ({ disabled, setDisabled, folderData, hideEdit, statesData }) => {
  const [state, setState] = useState('')
  const [localeStates, setLocalStates] = useState([])
  const auth = useAuth()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState()

  // ** React Query
  const changeStateMutation = useChangeState()
  useEffect(() => {
    setLocalStates([...statesData])
  }, [statesData, auth?.user])

  const handleStatusChange = value => {
    setSelectedStatus(value)
    if (value?.entitled == 'à modifier') {
      setIsCommentDialogOpen(true)
      setIsSaveDisabled(true)
    } else {
      setIsCommentDialogOpen(false)
      setIsSaveDisabled(false)
    }
  }

  useEffect(() => {
    if (selectedStatus?.entitled == 'à modifier') {
      setIsSaveDisabled(true)
    } else setIsSaveDisabled(false)
  }, [selectedStatus])

  const handleCloseFileDialog = () => {
    setIsCommentDialogOpen(false)
  }

  const handleOnSubmit = dispute => {
    setIsCommentDialogOpen(false)
    handleChangeFolderStatus(true, dispute)
  }

  const handleChangeFolderStatus = async (event, dispute = 0) => {
    setSuspendDialogOpen(false)
    if (event) {
      try {
        console.log(state)
        await changeStateMutation.mutateAsync({
          id: folderData?.id,
          state: selectedStatus?.id,
          form: { dispute: dispute }
        })

        router.push('/folders')
      } catch (error) {}
    }
  }

  return (
    <>
      <MainCard
        title={'Changer Statut'}
        secondary={
          <>
            {!hideEdit && (
              <IconButton
                color='secondary'
                size='large'
                onClick={e => {
                  setDisabled(false)
                }}
              >
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </IconButton>
            )}
          </>
        }
      >
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Autocomplete
              disabled={disabled}
              options={localeStates || []}
              defaultValue={statesData?.find(item => item?.id === folderData?.state?.id)}
              getOptionLabel={state => state.entitled}
              onChange={(event, value) => handleStatusChange(value)}
              renderInput={params => (
                <TextField {...params} label='Selectionner un Statu' variant='standard' fullWidth />
              )}
            />
          </Grid>
          {!hideEdit && (
            <Grid item xs={6} md={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  disabled={isSaveDisabled}
                  loadingPosition='start'
                  startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                  loading={changeStateMutation?.isLoading}
                  color={'secondary'}
                  variant='contained'
                  onClick={() => {
                    setSuspendDialogOpen(true)
                  }}
                >
                  {'Sauvegarder'}
                </LoadingButton>
              </div>
            </Grid>
          )}
        </Grid>
        <DialogAlert
          open={suspendDialogOpen}
          description=''
          setOpen={setSuspendDialogOpen}
          title={`Changer Statut du dossier ${folderData?.reference} ?`}
          acceptButtonTitle='Accepter'
          declineButtonTitle='Annuler'
          color={'success'}
          handleAction={handleChangeFolderStatus}
        />
      </MainCard>
      <ConfirmDialog
        folder={folderData}
        status={selectedStatus}
        open={isCommentDialogOpen}
        onDialogStatusChange={handleCloseFileDialog}
        onSubmit={handleOnSubmit}
      ></ConfirmDialog>
    </>
  )
}

export default ChangeState
