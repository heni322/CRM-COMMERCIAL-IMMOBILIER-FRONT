// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import {
  frFR,
  DateTimePicker,
  DesktopDatePicker,
  LocalizationProvider,
  MobileDateTimePicker
} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// ** Third Party Imports

// ** Icon Imports
import { useRouter } from 'next/navigation'
import { Form, FormikProvider, useFormik } from 'formik'

import * as Yup from 'yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useUploadFiles } from 'src/services/dossier.service'

// import DialogAddUserInfo from './add-user-modal'
import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextareaAutosize,
  Typography
} from '@mui/material'
import styled from '@emotion/styled'
import renderArrayMultiline from 'src/@core/utils/utilities'
import CustomFileUpload from 'src/components/CustomFileUpload'
import { LoadingButton } from '@mui/lab'
import { useCreateLocal } from 'src/services/locals.service'
import { useCreateProperty } from 'src/services/properties.service'
import { useGetPropertyTypes, useGetUsages } from 'src/services/settings.service'
import { useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'
import CurrencyInput from 'src/components/CurrencyInput'
import { useCreatePiece, useDeletePiece, useGetPieces } from 'src/services/pieces.service'
import { set } from 'nprogress'
import IconifyIcon from 'src/@core/components/icon'

const CreateForm = ({ blocsData, residence, setResidence, residencesData, finished }) => {
  const [files, setFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [pieceList, setPieceList] = useState([])

  const [formInput, setFormInput] = useState({
    entitled: '',
    description: '',
    d_project_id: residence?.id ? residence?.id : '',
    d_bloc_id: '',
    p_property_type_id: '',
    p_usage_type_id: '',
    surface: '',
    covered_surface: '',
    selling_price: '',
    various_price: '',
    m_price: '',
    floor: '',
    piece_number: '',
    number: '',
    documents: [],
    lotiss_fees: '',
    trustee_fees: '',
    folder_fees: '',
    lawyer_fees: '',
    others_fees: ''
  })

  const { data: piecesData, isFetching: piecesIsFetching, isSuccess: piecesIsSuccess } = useGetPieces()
  const createPieceMutation = useCreatePiece()
  const deletePieceMutation = useDeletePiece()

  const createProperty = useCreateProperty()
  const getBlocs = useGetBlocsByResidenceId({ residenceId: residence?.id ? residence?.id : formInput?.d_project_id })
  const getResidences = useGetResidences({ paginated: false })
  const getUsages = useGetUsages()
  const getPropertyTypes = useGetPropertyTypes()
  const usagesData = getUsages?.data
  const typesData = getPropertyTypes?.data
  const uploadFiles = useUploadFiles()

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    // await EventSchema.validate(values, { abortEarly: false })
    const formData = new FormData()
    for (const key in formInput) {
      if (key === 'd_bloc_id') {
        if (formInput['d_bloc_id'] != null) formData.append(key, formInput[key])
      } else formData.append(key, formInput[key])
    }

    try {
      const filesArray = sliceIntoChunks(files, 5)
      for (const array of filesArray) {
        for (const file of array) {
          formData.append('documents[]', file)
        }
      }
      const response = await createProperty?.mutateAsync(formData)
      setLoading(false)
      if (!residence?.id) {
        router.push('/properties')
      } else finished()
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
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (piecesIsSuccess) {
      setPieceList([...piecesData])
    }
  }, [piecesIsFetching])

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    // methods.reset()
    // fileRef.current.value = null
  }

  const handleAddNewPiece = async entitled => {
    try {
      setPieceList([...piecesData, { entitled }])
      setFormInput(formData => {

        return { ...formData, piece_number: entitled }
      })
      await createPieceMutation.mutateAsync({ entitled })
    } catch (error) {
      // pop the last element
      setFormInput(formData => {

        return { ...formData, piece_number: '' }
      })
      setPieceList(currentList => currentList.slice(0, -1))
    }
  }

  const handleDeletePiece = async piece => {
    try {
      setPieceList(currentList => currentList.filter(p => p.entitled !== piece.entitled))

      await deletePieceMutation.mutateAsync(piece.entitled)
    } catch (error) {
      setPieceList(currentList => {
        // return it back to the list in the same
        const index = pieceList.findIndex(p => p.entitled === piece.entitled)

        return [...currentList.slice(0, index), piece, ...currentList.slice(index)]
      })
    }
  }

  const sortedPieceList = [...pieceList].sort((a, b) => {
    if (a.entitled === formInput.piece_number) return -1
    if (b.entitled === formInput.piece_number) return 1

    return 0
  })

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>A. Information</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              variant='standard'
              name='entitled'
              onChange={handleChange}
              value={formInput.entitled}
              label='Intitulé'
              placeholder='Intitulé'
              size='small'
              error={!!formErrors?.errors?.entitled}
              helperText={renderArrayMultiline(formErrors?.errors?.entitled)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          {!residence?.id && (
            <FormControl fullWidth>
              <Autocomplete
                onChange={(event, newValue) => {
                  setFormInput(formData => {
                    return { ...formData, d_project_id: newValue?.id }
                  })
                }}
                options={getResidences?.data || []}
                getOptionLabel={option => option?.entitled}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant='standard'
                    label='Résidence'
                    placeholder='Résidence'
                    error={!!formErrors?.errors?.d_project_id}
                    helperText={renderArrayMultiline(formErrors?.errors?.d_project_id)}
                  />
                )}
              />
            </FormControl>
          )}
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput(formData => {
                  return { ...formData, d_bloc_id: newValue?.id }
                })
              }}
              options={getBlocs?.data || []}
              getOptionLabel={option => option?.entitled}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Bloc'
                  placeholder='Bloc'
                  error={!!formErrors?.errors?.d_bloc_id}
                  helperText={renderArrayMultiline(formErrors?.errors?.d_bloc_id)}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              variant='standard'
              name='floor'
              onChange={handleChange}
              value={formInput.floor}
              label='Etage'
              placeholder='Etage'
              size='small'
              error={!!formErrors?.errors?.floor}
              helperText={renderArrayMultiline(formErrors?.errors?.floor)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Autocomplete
              freeSolo
              value={sortedPieceList.find(piece => piece.entitled === formInput.piece_number) || null}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  handleAddNewPiece(newValue)
                } else if (typeof newValue?.inputValue === 'string') {
                  handleAddNewPiece(newValue?.inputValue)
                } else {
                  setFormInput(formData => {
                    return { ...formData, piece_number: newValue?.entitled }
                  })
                }
              }}
              filterOptions={(options, params) => {
                const filtered = options.filter(option => {
                  return option.entitled.toLowerCase().includes(params.inputValue.toLowerCase())
                })

                if (params.inputValue !== '' && !filtered.length) {
                  filtered.push({
                    inputValue: params.inputValue,
                    entitled: `Add "${params.inputValue}"`
                  })
                }

                return filtered
              }}
              options={sortedPieceList || []}
              getOptionLabel={option => option?.entitled}
              renderOption={(props, option) => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between !important',
                    alignItems: 'center'
                  }}
                  {...props}
                >
                  <Typography>{option.entitled}</Typography>
                  {option.entitled !== formInput.piece_number && (
                    <IconButton
                      edge='end'
                      color='error'
                      onClick={event => {
                        event.stopPropagation() // Prevent the click event from selecting the option
                        handleDeletePiece(option)
                      }}
                      className='delete-icon-autocomplete'
                    >
                      <IconifyIcon icon='mdi:remove' />
                    </IconButton>
                  )}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  variant='standard'
                  label='Nombre de pièces'
                  placeholder='Nombre de pièces'
                  error={!!formErrors?.errors?.piece_number}
                  helperText={renderArrayMultiline(formErrors?.errors?.piece_number)}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput(formData => {
                  return { ...formData, p_property_type_id: newValue?.id }
                })
              }}
              options={Array.isArray(typesData) ? typesData : (typesData?.data ?? [])}
              getOptionLabel={option => option?.entitled}
              renderInput={params => (
                <TextField
                  error={!!formErrors?.errors?.p_property_type_id}
                  helperText={renderArrayMultiline(formErrors?.errors?.p_property_type_id)}
                  required
                  {...params}
                  variant='standard'
                  label='Type du Bien'
                  placeholder='Type du Bien'
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <Autocomplete
              onChange={(event, newValue) => {
                setFormInput(formData => {
                  return { ...formData, p_usage_type_id: newValue?.id }
                })
              }}
              options={Array.isArray(usagesData) ? usagesData : (usagesData?.data ?? [])}
              getOptionLabel={option => option?.entitled}
              renderInput={params => (
                <TextField
                  required
                  {...params}
                  variant='standard'
                  label={`Type d'usage`}
                  placeholder={`Type d'usage`}
                  error={!!formErrors?.errors?.p_usage_type_id}
                  helperText={renderArrayMultiline(formErrors?.errors?.p_usage_type_id)}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>B. Surfaces</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              variant='standard'
              name='surface'
              type='number'
              onChange={handleChange}
              value={formInput.surface}
              label='Surface'
              placeholder='Enter Surface'
              size='small'
              error={!!formErrors?.errors?.surface}
              helperText={renderArrayMultiline(formErrors?.errors?.surface)}
              InputProps={{
                startAdornment: <InputAdornment position='start'>m²</InputAdornment>
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              variant='standard'
              type='number'
              name='covered_surface'
              onChange={handleChange}
              value={formInput.covered_surface}
              label='Surface Couvert'
              placeholder='Surface Couvert'
              size='small'
              InputProps={{
                startAdornment: <InputAdornment position='start'>m²</InputAdornment>
              }}
              error={!!formErrors?.errors?.covered_surface}
              helperText={renderArrayMultiline(formErrors?.errors?.covered_surface)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>C. Prix</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <CurrencyInput
              required
              fullWidth
              variant='standard'
              name='selling_price'
              onChange={handleChange}
              value={formInput.selling_price}
              label='Prix de Vente'
              placeholder='Prix de Vente'
              size='small'
              error={!!formErrors?.errors?.selling_price}
              helperText={renderArrayMultiline(formErrors?.errors?.selling_price)}
              suffix=' TND'
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              name='various_price'
              onChange={handleChange}
              value={formInput.various_price}
              label='Prix Various'
              placeholder='Prix Various'
              size='small'
              error={!!formErrors?.errors?.various_price}
              helperText={renderArrayMultiline(formErrors?.errors?.various_price)}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              name='m_price'
              onChange={handleChange}
              value={formInput.m_price}
              label='Prix m²'
              placeholder='Prix m²'
              size='small'
              error={!!formErrors?.errors?.m_price}
              helperText={renderArrayMultiline(formErrors?.errors?.m_price)}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant='h6'>D. Frais</Typography>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={2.2}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              size='small'
              name='lotiss_fees'
              value={formInput.lotiss_fees}
              onChange={handleChange}
              label='Frais de lotissement'
              suffix=' TND'
              error={!!formErrors?.errors?.lotiss_fees}
              helperText={renderArrayMultiline(formErrors?.errors?.lotiss_fees)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.2}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              error={!!formErrors?.errors?.trustee_fees}
              helperText={renderArrayMultiline(formErrors?.errors?.trustee_fees)}
              name='trustee_fees'
              onChange={handleChange}
              label='Frais de syndic'
              placeholder='Frais de syndic'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput.trustee_fees}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.2}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              error={!!formErrors?.errors?.folder_fees}
              helperText={renderArrayMultiline(formErrors?.errors?.folder_fees)}
              name='folder_fees'
              onChange={handleChange}
              label='Frais de dossier'
              placeholder='Frais de dossier'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput.folder_fees}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.2}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              error={!!formErrors?.errors?.lawyer_fees}
              helperText={renderArrayMultiline(formErrors?.errors?.lawyer_fees)}
              name='lawyer_fees'
              onChange={handleChange}
              label='Frais d’avocat'
              placeholder='Frais d’avocat'
              aria-describedby='validation-basic-name'
              size='small'
              value={formInput.lawyer_fees}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2.2}>
          <FormControl fullWidth>
            <CurrencyInput
              fullWidth
              variant='standard'
              error={!!formErrors?.errors?.others_fees}
              helperText={renderArrayMultiline(formErrors?.errors?.others_fees)}
              name='others_fees'
              onChange={handleChange}
              label='Autres frais'
              placeholder='Autres frais'
              size='small'
              value={formInput.others_fees}
              suffix=' TND'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <TextField
              error={!!formErrors?.errors?.description}
              helperText={renderArrayMultiline(formErrors?.errors?.description)}
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
