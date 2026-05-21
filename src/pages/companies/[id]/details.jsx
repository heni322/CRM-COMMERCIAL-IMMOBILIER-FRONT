// ** MUI Imports
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab'
import { Box, Card, CardContent, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// ** Demo Components Imports

import MainCard from 'src/components/MainCard'
import ComapnyDetails from 'src/views/companies/show'

const CompanieView = () => {
  const router = useRouter()

  return <ComapnyDetails companyId={router.query?.id} />
}

export default CompanieView
