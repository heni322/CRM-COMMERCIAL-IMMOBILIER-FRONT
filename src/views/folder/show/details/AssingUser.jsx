import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAssignEngineer, useGetAvailableIng } from 'src/services/dossier.service'
import { useGetGroupUsers, useGetGroups } from 'src/services/groups.service'
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

const AssingUser = ({ disabled, setDisabled, folderData, hideEdit, availableIngQuery, availableIngData }) => {
  const [engineer, setEngineer] = useState('')

  // ** React Query
  const assingEngineerMutation = useAssignEngineer()

  return (
    <MainCard
      title={'Assigner un Collaborateur'}
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
      <Grid container spacing={5} justifyItems={'center'}>
        <Grid item xs={6}>
          <Autocomplete
            key='assine-user'
            disabled={disabled}
            options={availableIngData || []}
            getOptionLabel={engineer => engineer.name}
            onChange={(event, value) => setEngineer(value?.id)}
            defaultValue={availableIngData?.find(item => item?.id === folderData?.assigned_user?.id)}
            renderInput={params => (
              <TextField {...params} label='Selectionner un Collaborateur' variant='standard' fullWidth />
            )}
          />
        </Grid>
        {!hideEdit && (
          <Grid item xs={6} md={6}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                disabled={disabled}
                loadingPosition='start'
                startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                loading={assingEngineerMutation.isLoading}
                color={'secondary'}
                variant='contained'
                onClick={async () => {
                  try {
                    await assingEngineerMutation.mutateAsync({
                      id: folderData?.id,
                      values: {
                        assigned_user: engineer
                      }
                    })
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

export default AssingUser
