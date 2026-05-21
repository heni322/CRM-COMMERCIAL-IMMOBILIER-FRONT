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
  TextField,
  FormControl,
  Autocomplete
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import FormGroup from '@mui/material/FormGroup'

import { useRouter } from 'next/router'
import CreateForm from 'src/views/blocs/forms/CreateForm'
import { LoadingButton } from '@mui/lab'
import { useAddPropertyPrice } from 'src/services/properties.service'
import CardTimeLine from './CardTimeLine'

const TimelineDialog = ({ property, open, handleClose, setOpen }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const addPriceMutation = useAddPropertyPrice()

  const [formInput, setFormInput] = useState({
    d_property_id: property?.id,
    entitled: '',
    p_client_category_id: 1,
    selling_price: 0,
    various_price: 0

    // various_price: property?.id,
  })

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      setOpenPrice()
      handleClosePrice()
      const form = formInput
      form.d_property_id = property?.id

      const response = await addPriceMutation?.mutateAsync({ values: form })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg'>
      <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h6' component='span'>
          Historique du bien
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
        {/* Timeline Card */}
        <CardTimeLine property={property} />
      </DialogContent>
    </Dialog>
  )
}

export default TimelineDialog
