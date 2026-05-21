import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAssignEngineer, useChangeState, useGetAvailableIng } from 'src/services/dossier.service'
import { useGetGroups } from 'src/services/groups.service'
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'
import { useGetstatesByModel } from 'src/services/states.service'

const ChangeState = ({ disabled, setDisabled, folderData, hideEdit }) => {
  const [state, setState] = useState('')

  // ** React Query

  const changeStateMutation = useChangeState()
  const statesQuery = useGetstatesByModel('DFolder')
  const statesData = statesQuery?.data

  return (
    <MainCard
      title={'Changer le Statu'}
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
            options={statesData || []}
            getOptionLabel={state => state.entitled}
            onChange={(event, value) => setState(value?.id)}
            defaultValue={folderData?.state}
            renderInput={params => <TextField {...params} label='Status' variant='standard' fullWidth />}
          />
        </Grid>
        {!hideEdit && (
          <Grid item xs={6} md={6}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                disabled={disabled}
                loadingPosition='start'
                startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                loading={changeStateMutation?.isLoading}
                color={'secondary'}
                variant='contained'
                onClick={async () => {
                  try {
                    changeStateMutation.mutateAsync({ id: folderData?.id, state: state })
                  } catch (error) {
                    console.log()
                  }
                }}
              >
                {'Sauvegarder'}
              </LoadingButton>
            </div>
          </Grid>
        )}
      </Grid>
    </MainCard>
  )
}

export default ChangeState
