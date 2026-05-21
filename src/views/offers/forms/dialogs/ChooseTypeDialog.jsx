import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Autocomplete,
  TextField
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormGroup from '@mui/material/FormGroup'

import { useRouter } from 'next/router'
import { useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'
import { useGetLocalTypes } from 'src/services/type-locals.service'
import CreateForm from 'src/views/blocs/forms/CreateForm'
import { useGetNatures } from 'src/services/offers.service'

const ChooseTypeDialog = ({ open, handleClose, nature, setNature, currentNature, confirm }) => {
  // const blocsQuery = useGetBlocsByResidenceId({ residenceId: residence?.id })
  // const blocsData = blocsQuery?.data

  const naturesQuery = useGetNatures({ currentNature: currentNature })
  const naturesData = naturesQuery?.data

  // s
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md'>
      <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h6' component='span'>
          Choisir Type de document
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className='w-[200px] md:w-[400px] p-4'>
          <Autocomplete
            onChange={(event, newValue) => {
              setNature(newValue?.nature)
            }}
            options={naturesData || []}
            getOptionLabel={option => option?.entitled}
            renderInput={params => (
              <TextField {...params} variant='standard' label={`Type du document*`} placeholder={`Type de etc`} />
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => (currentNature >= 0 ? confirm() : handleClose())}
          variant='contained'
          color='primary'
          className='mr-1'
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChooseTypeDialog
