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
import { Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import FilesCard from 'src/components/FileCard'
import UpdateForm from '../forms/UpdateForm'

// ** Demo Components

const FodlerUpdate = ({ folderId }) => {
  // ** Authed User
  const auth = useAuth()

  // ** States
  const [desabledAssign, setDisabledAssign] = useState(true)
  const [desabledChangeState, setDisabledChangeState] = useState(true)
  const [hideEdit, setHideEdit] = useState(true)
  const [hideDelete, setHideDelete] = useState(true)

  // ** React Query
  const FolderQuery = useGetDossierById(folderId)
  const folderData = FolderQuery?.data

  useEffect(() => {
    if (auth?.user?.resources?.find(item => item.resource_name === `edit folders`)?.authorized) {
      if (folderData?.permissions?.edit) {
        setHideEdit(false)
        setDisabledAssign(folderData?.state <= 1 && false)
        setDisabledChangeState(folderData?.state == 7 && false)
      }
    }
    if (auth?.user?.resources?.find(item => item.resource_name === `delete folders`)?.authorized) {
      if (folderData?.permissions?.delete) {
        setHideDelete(false)
      }
    }
  }, [folderData, auth])

  return (
    <MainCard
      title={`Dossier - ${folderData?.reference}`}
      backButton
      goBackLink='/folders'
      secondary={<Button></Button>}
      headerColor='primary.main'

      // content={false}
    >
      <UpdateForm folderData={folderData} />
    </MainCard>
  )
}

export default FodlerUpdate
