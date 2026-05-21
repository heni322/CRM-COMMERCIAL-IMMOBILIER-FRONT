// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'
import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'
import AboutOverivew from './AboutOverivew'
import OfferList from 'src/views/offers/List/index'
import MainCard from 'src/components/MainCard'
import { Box, Button, Card, CardContent, CardHeader, Icon, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import ColabList from 'src/views/colaborator/list/list'
import CrudDataGrid from 'src/components/CrudDataGrid'
import GroupUsersList from 'src/views/group/List'

import { useAuth } from 'src/hooks/useAuth'
import Calendar from 'src/views/calendar'
import UploadFilesDialogProperty from 'src/components/UploadFilesDialogProperty'
import { useGetPropertyById, useGetPropertyDocuments, useGetPropertyImages } from 'src/services/properties.service'
import CardUser from './CardUser'
import IconifyIcon from 'src/@core/components/icon'
import { he } from 'date-fns/locale'
import UploadFilesChunkedDialog from 'src/components/UploadFileDialog'
import {
  useGetClientDocuments,
  useDeleteClientDocument,
  useDownloadAllDocuments as downloadAllDocuments,
  useUploadDocuments
} from 'src/services/client.service'
import ClientDataTable from 'src/views/offers/List/DataTable'
import OfferDataTable from 'src/views/offers/List/DataTable'

// import Calendar from 'src/views/calendar'

// import { TabPanel } from '@mui/lab'

const Profile = ({ data, propertyId }) => {
  const [showTodayDossiers, setShowTodayDossiers] = useState(false)

  const { data: documents } = useGetClientDocuments(data.id)
  const uploadDocumentsMutation = useUploadDocuments()
  const deleteDocumentMutation = useDeleteClientDocument()

  /**
   *
   * @param {FormData} formData
   */
  const handleUploadFiles = async formData => {
    try {
      await uploadDocumentsMutation.mutateAsync({ values: formData, clientID: data.id })
    } catch (error) {

    }
  }

  /**
   *
   * @param {int} id
   */

  const handleDeleteDocument = async id => {
    try {
      await deleteDocumentMutation.mutateAsync({ id })
    } catch (error) {

    }
  }

  const handleDownloadAllFiles = () => {
    try {
      downloadAllDocuments(data?.id)
    } catch (error) {}
  }

  return data && Object.values(data).length ? (
    <Grid container spacing={4} mt={5}>
      <Grid item xs={12} md={4}>
        <AboutOverivew data={data} />
      </Grid>
      <Grid item xs={12} md={8}>
        {/* <MainCard
          sx={{ maxHeight: '556px', overflow: 'auto' }}
          title={` Calendrier des rendez-vous`}
          secondary={<div></div>}
          headerColor='primary.main'
        > */}
        <Box>
          <Calendar client={data} resource='client' />
        </Box>
        {/* </MainCard> */}
      </Grid>

      <Grid item xs={12} md={8}>
        <MainCard title={`Liste des documents`} secondary={<div></div>} headerColor='primary.main'>
          {/* <div className='flex w-full justify-center items-center h-96'>Pas de biens</div> */}
          <OfferDataTable
            columnProfile='fiche_client'
            clientId={data?.id}
            filter={false}
            pageSizeParam={10}
            selection={false}
            disablePageSize={true}
            addNew={false}
            generateButton={false}
            showTodayDossiers={showTodayDossiers}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <MainCard
          content={false}
          title={'Documents'}
          sx={{ backgroundColor: '#ffffff', height: '100%' }}
          secondary={
            <>
              <div className='flex flex-row items-center'>
                <IconButton onClick={handleDownloadAllFiles} color='secondary' size='large'>
                  <IconifyIcon icon='material-symbols:download' fontSize={20} />
                </IconButton>
                <UploadFilesChunkedDialog uploadFiles={handleUploadFiles}></UploadFilesChunkedDialog>
              </div>
            </>
          }
        >
          <div className='grid pt-1 p-4'>
            <CardUser documents={documents} deleteDocument={handleDeleteDocument} />
          </div>
        </MainCard>
      </Grid>
    </Grid>
  ) : null
}

export default Profile
