// ** React Imports
import { forwardRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports

// ** Icon Imports
import { useRouter } from 'next/navigation'

import { useUploadFiles } from 'src/services/dossier.service'

// import DialogAddUserInfo from './add-user-modal'
import { Backdrop, CircularProgress, Divider, Typography } from '@mui/material'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useCreateResidence } from 'src/services/residences.service'
import CustomCurrency from 'src/components/CustomCurrency'
import CurrencyInput from 'src/components/CurrencyInput'

const CustomInput = forwardRef(({ error, helperText, ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props

  return (
    <TextField
      error={error}
      helperText={helperText}
      sx={{ width: '100%' }}
      size='small'
      inputRef={ref}
      {...props}
      label={label || ''}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  )
})

const CreateForm = () => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [formInput, setFormInput] = useState({
    entitled: '',
    floors_number: 0,
    city: '',
    zip_code: '',
    address: '',
    description: '',
    tf_number: ''
  })

  const createResidence = useCreateResidence()
  const uploadFiles = useUploadFiles()

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    // await EventSchema.validate(values, { abortEarly: false })
    const formData = new FormData()
    for (const key in formInput) {
      formData.append(key, formInput[key])
    }

    try {
      const filesArray = sliceIntoChunks(files, 5)

      for (let i = 0; i < filesArray.length; i++) {
        const array = [...filesArray[i]]
        for (let index = 0; index < array.length; index++) {
          formData.append(`documents[${index}]`, array[index])
        }
      }
      const response = await createResidence?.mutateAsync(formData)
      setLoading(false)
      router.push('/residences')
    } catch (error) {
      const errorsObject = error?.response?.data

      setFormErrors(errorsObject)
      setLoading(false)
    }
  }

  const handleFilesChange = files => {
    // /* removed */;
    // Update chosen files
    setFiles([...files])
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormInput({
      ...formInput,
      [name]: value
    })
  }

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  const handleTypeChange = (event, newValue) => {
    setFormInput({
      ...formInput,
      type: newValue
    })
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.entitled}
              helperText={renderArrayMultiline(formErrors?.errors?.entitled)}
              name='entitled'
              onChange={handleChange}
              label='Intitulé'
              placeholder='Intitulé'
              aria-describedby='validation-basic-name'
              size='small'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              type='number'
              variant='standard'
              error={!!formErrors?.errors?.floors_number}
              helperText={renderArrayMultiline(formErrors?.errors?.floors_number)}
              name='floors_number'
              onChange={handleChange}
              label='Nombre détages'
              placeholder='Nombre détages'
              aria-describedby='validation-basic-name'
              size='small'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.tf_number}
              helperText={renderArrayMultiline(formErrors?.errors?.tf_number)}
              name='tf_number'
              onChange={handleChange}
              label='Numéro de titre foncier'
              placeholder='Numéro de titre foncier'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.tf_number}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>Adresse</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.address}
              helperText={renderArrayMultiline(formErrors?.errors?.address)}
              name='address'
              onChange={handleChange}
              label='Adresse'
              placeholder='Adresse'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.address}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              error={!!formErrors?.errors?.city}
              helperText={renderArrayMultiline(formErrors?.errors?.city)}
              name='city'
              onChange={handleChange}
              label='Ville'
              placeholder='Ville'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.city}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <TextField
              required
              type='number'
              variant='standard'
              error={!!formErrors?.errors?.zip_code}
              helperText={renderArrayMultiline(formErrors?.errors?.zip_code)}
              name='zip_code'
              onChange={handleChange}
              label='Code Postale'
              placeholder='Code Postale'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput?.zip_code}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              error={!!formErrors?.errors?.comments}
              helperText={renderArrayMultiline(formErrors?.errors?.comments)}
              multiline
              name='description'
              placeholder='Description'
              maxRows={5}
              minRows={5}
              onChange={handleChange}
              label='Description'
              id='textarea-outlined-controlled'
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <CustomFileUpload
            fileTypes={['pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx']}
            multiple={true}
            name='PDF'
            error={!!formErrors?.errors?.documents}
            helperText={renderArrayMultiline(formErrors?.errors?.documents)}
            handleFilesChange={handleFilesChange}
            onFileDelete={onFileDelete}
            files={files}
            endpoint=''
          />
        </Grid>
        <Grid item xs={12} justifyContent='flex-end' alignItems='center' direction='row' display='flex'>
          <LoadingButton loadingPosition='end' loading={loading} onClick={handleSubmit} variant='contained'>
            Ajouter
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateForm

function sliceIntoChunks(arr, chunkSize) {
  const res = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }

  return res
}
