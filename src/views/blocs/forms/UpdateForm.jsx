// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/navigation'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useAuth } from 'src/hooks/useAuth'
import { useUpdateResidence } from 'src/services/residences.service'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const UpdateForm = ({ residenceData }) => {
  /// ** NAVIGATION
  const router = useRouter()

  // ** States
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    entitled: '',
    address: ''
  })

  // ** REACT QUERY Mutaions
  const updateResidenceMutation = useUpdateResidence()

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setFormErrors({})
    try {
      const filesArray = sliceIntoChunks(files, 5)
      for (const array of filesArray) {
        for (const file of array) {
          formData.append('documents[]', file)
        }
      }
      await updateResidenceMutation.mutateAsync({ data: formInput, id: residenceData?.id })
      router.push('/residences')
    } catch (error) {
      const errorsObject = error?.response?.data
      setFormErrors(errorsObject)
    }
  }

  useEffect(() => {
    setFormInput(formInput => {
      return { ...formInput, ...residenceData }
    })
  }, [residenceData])

  return (
    <>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name='entitled'
                error={!!formErrors?.errors?.entitled}
                helperText={renderArrayMultiline(formErrors?.errors?.entitled)}
                label='Intitulé'
                placeholder='Intitulé'
                aria-describedby='validation-basic-entitled'
                labelId='validation-basic-entitled'
                size='small'
                value={formInput?.entitled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                name='address'
                error={!!formErrors?.errors?.address}
                helperText={renderArrayMultiline(formErrors?.errors?.address)}
                size='small'
                type='text'
                label='Adresse'
                placeholder='Adresse'
                aria-describedby='validation-basic-address'
                labelId='validation-basic-address'
                value={residenceData?.address}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            {/* <CustomFileUpload
               fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx']}
              multiple={true}
              name='PDF'
              handleFilesChange={handleFilesChange}
              onFileDelete={onFileDelete}
              files={files}
              endpoint=''
              error={formErrors}
            /> */}
          </Grid>
          <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
            <Button size='large' variant='contained' type='submit' onClick={handleSubmit}>
              Modifier
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Divider sx={{ m: '0 !important' }} />
      {/* <CardActions>
        <Button onClick={handleSubmit} size='large' type='button' sx={{ mr: 2 }} variant='outlined'>
          Submit
        </Button>
        <Button type='reset' size='large' color='secondary' variant='outlined'>
          Reset
        </Button>
      </CardActions> */}
    </>
  )
}

export default UpdateForm
