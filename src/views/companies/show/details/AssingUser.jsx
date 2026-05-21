import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAssignEngineer, useGetAvailableIng } from 'src/services/dossier.service'
import { useGetGroups } from 'src/services/groups.service'
import Icon from 'src/@core/components/icon'
import { LoadingButton } from '@mui/lab'

const AssingUser = ({ disabled, setDisabled, folderData, hideEdit }) => {
  const [group, setGroup] = useState('')
  const [engineer, setEngineer] = useState('')

  // ** React Query
  const availableIngQuery = useGetAvailableIng({ group: group })
  const availableIngData = availableIngQuery?.data
  const assingEngineerMutation = useAssignEngineer()
  const groupQuery = useGetGroups()
  const groupData = groupQuery?.data
  console.log(group)

  return (
    <MainCard
      title={'Assign User'}
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
            options={groupData || []}
            getOptionLabel={group => group.entitled}
            onChange={(event, value) => setGroup(value?.id)}
            defaultValue={folderData?.group_of_folder}
            renderInput={params => <TextField {...params} label='Coisir groupe' variant='standard' fullWidth />}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            disabled={disabled}
            options={availableIngData || []}
            getOptionLabel={engineer => engineer.name}
            onChange={(event, value) => setEngineer(value?.id)}
            defaultValue={folderData?.assigned_user}
            renderInput={params => <TextField {...params} label='Engineer' variant='standard' fullWidth />}
          />
        </Grid>
        {!hideEdit && (
          <Grid item xs={12} md={12}>
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
                    assingEngineerMutation.mutateAsync(engineer)
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
