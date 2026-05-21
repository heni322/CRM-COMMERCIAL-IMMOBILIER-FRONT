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
import {
  useChangeState,
  useGetDossierById,
  useGetFolderFiles,
  useGetFolderCommentsAsObject
} from 'src/services/dossier.service'
import { Button, CardContent, IconButton, Skeleton } from '@mui/material'
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'
import UserViewOverview from 'src/views/apps/user/view/UserViewOverview'
import LeftCard from './details/LeftCard'
import AssingUser from './details/AssingUser'
import TimeLineComponent from 'src/components/TimeLine'
import ChangeState from './details/ChangeState'
import { useAuth } from 'src/hooks/useAuth'
import FilesCard from 'src/components/FileCard'
import { useGetstatesByModel } from 'src/services/states.service'
import { useGetGroupUsers } from 'src/services/groups.service'
import DialogAlert from 'src/components/DialogAlert'

// ** Demo Components
import CommentsList from 'src/components/CommentsList'
import CommentsDialog from 'src/components/CommentsDialog'
import SoldOut from './details/SoldOut'

const FodlerDetails = ({ folderId }) => {
  // ** Authed User
  const auth = useAuth()

  // ** States
  const [desabledAssign, setDisabledAssign] = useState(true)
  const [hideAssign, setHideAssign] = useState(true)
  const [desabledChangeState, setDisabledChangeState] = useState(true)
  const [hideEdit, setHideEdit] = useState(true)
  const [hideDelete, setHideDelete] = useState(true)
  const [grouId, setGroupId] = useState(null)
  const [folderComments, setFolderComments] = useState([])
  const [open, setOpen] = useState(false)

  // ** React Query
  const folderQuery = useGetDossierById(folderId)
  const folderFilesQuery = useGetFolderFiles(folderId)
  const folderData = folderQuery?.data
  const filesData = folderFilesQuery?.data
  const getFolderCommentsQuery = useGetFolderCommentsAsObject({ folderId: folderData?.id, order: 'desc' })
  const folderCommentsData = getFolderCommentsQuery?.data
  const statesQuery = useGetstatesByModel('DFolder')
  const statesData = statesQuery?.data
  const availableIngQuery = useGetGroupUsers({ grpId: grouId ? grouId : 1 })
  const availableIngData = availableIngQuery?.data

  // Mutations
  useEffect(() => {
    if (folderQuery?.isSuccess) {
      if (auth?.user?.resources?.find(item => item.resource_name === `edit folders`)?.authorized) {
        if (folderData?.permissions?.edit) {
          setHideEdit(false)
          setDisabledChangeState(folderData?.state == 7 && false)
        }
      }
      if (auth?.user?.resources?.find(item => item.resource_name === `assign folders`)?.authorized) {
        setDisabledAssign(false)
        setHideAssign(false)
      }
      if (auth?.user?.resources?.find(item => item.resource_name === `delete folders`)?.authorized) {
        if (folderData?.permissions?.delete) {
          setHideDelete(false)
        }
      }

      // console.log(folderData?.group_of_folder?.id)

      setGroupId(folderData?.group_of_folder?.id)
    }
  }, [folderData, folderQuery?.isSuccess, folderFilesQuery?.isSuccess, auth])

  const handleClickOpen = item => {
    // setSelectedFileId(item?.id)
    // setSelectedFile(item)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    console.log('closed')
  }

  const handleAddFiles = files => {
    const formData = new FormData()

    formData.append(`files`, files)
  }

  return (
    <>
      {folderQuery.isSuccess && (
        <MainCard
          title={`Dossier - ${folderData?.reference}`}
          backButton
          goBackLink='/folders'
          headerColor='primary.main'

          // content={false}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={5} lg={4}>
              <Grid container spacing={6}>
                <Grid item width='100%'>
                  <LeftCard folderData={folderData} hideEdit={hideEdit} hideDelete={hideDelete} />
                </Grid>
                <Grid item width='100%'>
                  <TimeLineComponent data={folderData?.history} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
              <Grid container spacing={6}>
                {auth?.user?.role !== 'client' && auth?.user?.role !== 'accountant' && (
                  <>
                    <Grid item width='100%'>
                      {statesQuery?.isSuccess &&
                      statesQuery?.isFetching === false &&
                      folderQuery?.isSuccess &&
                      folderQuery?.isFetching == false ? (
                        <ChangeState
                          statesData={statesData}
                          disabled={desabledChangeState}
                          setDisabled={setDisabledChangeState}
                          folderData={folderData}
                          hideEdit={hideEdit}
                        />
                      ) : (
                        <>
                          <Skeleton sx={{ height: 80 }} variant='rounded' />
                          <Skeleton variant='rounded' height={80} sx={{ mt: 2 }} />
                        </>
                      )}
                    </Grid>
                    <Grid item width='100%'>
                      {availableIngQuery?.isSuccess &&
                      availableIngQuery?.isFetching == false &&
                      folderQuery?.isSuccess &&
                      folderQuery?.isFetching == false ? (
                        <AssingUser
                          availableIngQuery={availableIngQuery}
                          availableIngData={availableIngData}
                          hideEdit={hideAssign}
                          disabled={desabledAssign}
                          setDisabled={setDisabledAssign}
                          folderData={folderData}
                        />
                      ) : (
                        <>
                          <Skeleton sx={{ height: 80 }} variant='rounded' />
                          <Skeleton variant='rounded' height={80} sx={{ mt: 2 }} />
                        </>
                      )}
                    </Grid>
                  </>
                )}
                <Grid item width='100%'>
                  <FilesCard
                    onFilesSelect={handleAddFiles}
                    hideDelete={hideEdit}
                    files={filesData}
                    folder={folderData}
                    endpoint={folderData?.assets_file}
                  />
                </Grid>
                <Grid item width='100%'>
                  <MainCard
                    title={'Commentaires'}
                    className='rounded-lg shadow-md'
                    secondary={
                      <div className='p-4'>
                        <Box textAlign='center' margin='auto'>
                          <IconButton onClick={() => handleClickOpen()} edge='end'>
                            <Icon icon='mdi:plus' />
                          </IconButton>
                        </Box>
                      </div>
                    }
                  >
                    <CardContent className='p-4'>
                      <CommentsList comments={folderCommentsData} folder={folderData} />
                    </CardContent>
                    <div textAlign='center' className='text-center cursor-pointer' margin='auto'>
                      <Button onClick={() => handleClickOpen()} variant='outlined'>
                        Afficher tous les commentaires
                      </Button>
                    </div>
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {open ? (
            <CommentsDialog
              open={open}
              folder={folderData}
              folderComments={folderCommentsData}
              onDialogStatusChange={handleClose}
              dialogType={'FilesComments'}
            />
          ) : null}
        </MainCard>
      )}
    </>
  )
}

export default FodlerDetails
