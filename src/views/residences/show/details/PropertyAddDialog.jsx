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
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormGroup from '@mui/material/FormGroup'
import CreateForm from 'src/views/properties/forms/CreateForm'

import { useRouter } from 'next/router'
import { useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'
import { useGetLocalTypes } from 'src/services/type-locals.service'

const PropertyAddDialog = ({ residence, open, handleCloseProperty }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  const blocsQuery = useGetBlocsByResidenceId({ residenceId: residence?.id })
  const blocsData = blocsQuery?.data

  const residencesQuery = useGetResidences({ paginated: false, search: search })
  const residencesData = residencesQuery?.data

  const typesQuery = useGetLocalTypes({ paginated: true, page: page, pageSize: pageSize, search: search })
  const typesData = typesQuery?.data?.data

  return (
    <Dialog open={open} onClose={handleCloseProperty} maxWidth='md'>
      <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h6' component='span'>
          Ajouter un Bien pour la résidence {residence?.entitled}
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleCloseProperty}
          sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div>
          <CreateForm
            blocsData={blocsData ? blocsData : []}
            residence={residence}
            residencesData={residencesData ? residencesData : []}
            typesData={typesData}
            finished={() => {
              handleCloseProperty()
            }}
          />
        </div>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleCloseProperty} variant='contained' color='error' className='mr-1'>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  )
}

export default PropertyAddDialog
