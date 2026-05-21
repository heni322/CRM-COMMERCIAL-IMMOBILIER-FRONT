import React, { useRef, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

import { useGetNewFolders } from 'src/services/dossier.service'
import { useAuth } from 'src/hooks/useAuth'

// Styled Grid component

const useGetNewFolder = ({ name, invoice, number, pause, waiting }) => {
  // ** Hook
  const theme = useTheme()
  const auth = useAuth()

  const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      order: -1,
      display: 'flex',
      justifyContent: 'center'
    }
  }))

  // Styled component for the image
  const Img = styled('img')(({ theme }) => ({
    right: 0,
    bottom: 0,
    width: 298,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      width: 250,
      position: 'static'
    }
  }))

  const getNewFolderQuery = useGetNewFolders()
  const [result, setResult] = useState()

  useEffect(() => {
    if (getNewFolderQuery?.isSuccess && getNewFolderQuery?.data) {
      setResult(getNewFolderQuery?.data)
    }
  }, [getNewFolderQuery?.isSuccess])

  const userRole = auth?.user?.role

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={20} sm={20} style={{ zIndex: 2 }}>
            <Typography variant='h6' sx={{ mb: 4.5 }}>
              Bonjour{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {name}
              </Box>
              ! 🎉
            </Typography>
            {userRole === 'accountant' ? (
              <Typography variant='body1'>
                Vous avez <span className='text-red-800 font-semibold text-xl'>{invoice} </span> dossier
                {invoice > 0 && 's'} à facturer !{' '}
              </Typography>
            ) : userRole === 'client' ? (
              <Typography variant='body1'>
                Vous avez <span className='text-red-800 font-semibold text-xl'>{waiting} </span> dossier
                {waiting > 0 && 's'} en cours !
              </Typography>
            ) : (
              <Typography variant='body1'>
                Vous avez <span className='text-red-800 font-semibold text-xl'>{waiting} </span> dossier
                {waiting > 0 && 's'} en attente et <span className='text-lime-900 font-semibold text-xl'>{pause} </span>{' '}
                dossier{pause > 0 && 's'} en pause !{' '}
              </Typography>
            )}

            <Typography sx={{ my: 4.5 }} variant='body1'>
              Bon Travail! 😎
            </Typography>
            <Button variant='contained' href='/folders'>
              Liste des Dossiers
            </Button>
          </Grid>
          <StyledGrid item xs={12} sm={6} style={{ zIndex: 1 }}>
            <Img alt='Congratulations John' src={`/images/cards/illustration-john-${theme.palette.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default useGetNewFolder
