// ** MUI Imports
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab'
import { Box, Card, CardContent, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// ** Demo Components Imports

import MainCard from 'src/components/MainCard'
import FodlerDetails from 'src/views/folder/show'

const FolderView = () => {
  const router = useRouter()

  return <FodlerDetails folderId={router.query?.id} />
}

export default FolderView
