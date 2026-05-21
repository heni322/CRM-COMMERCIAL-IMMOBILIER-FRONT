import MainCard from 'src/components/MainCard'
import LocalList from 'src/views/properties/show/details'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import { Carousel } from '@material-tailwind/react'
import Icon from 'src/@core/components/icon'
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
import PropertyDescription from './PropertyDescription'
import CardDescription from './CardDescription'
import CardTimeLine from './CardTimeLine'
import CardDocuments from './CardDocuments'
import CardImages from './CardImages'
import { LoadingButton } from '@mui/lab'
import useStates from 'src/hooks/useStates'
import CardBlocs from './CardBlocs'
import CardBiens from './CardBiens'
import BlocAddDialog from './BlocAddDialog'
import PropertyAddDialog from './PropertyAddDialog'
import {
  useDownloadAllDocuments as downloadAllDocuments,
  useGetResidenceBlocs,
  useGetResidenceDocuments,
  useGetResidenceImages,
  useGetResidenceProperties,
  useGetResidencesById,
  useUpdateResidence,
  useUpdateStateResidence,
  useUploadImages
} from 'src/services/residences.service'
import UploadFilesDialog from 'src/components/UploadFilesDialog'
import ImageCarousel from 'src/components/ImageCarousel'
import DialogImages from './DialogImages'

const Residence = () => {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [openAddBloc, setOpenAddBloc] = useState(false)
  const [openAddProperty, setOpenAddProperty] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [images, setImages] = useState([])
  const states = getStatesByModel('Project')
  const [displayImage, setDisplayImage] = useState(0)

  const [formInput, setFormInput] = useState({})

  // /* removed */)

  const residenceQuery = useGetResidencesById({ residenceId: router?.query?.id })
  const residenceBlocsQuery = useGetResidenceBlocs({ residenceId: router?.query?.id })
  const ResidencePropertiesQuery = useGetResidenceProperties({ residenceId: router?.query?.id })
  const residenceImagesQuery = useGetResidenceImages({ residenceId: router?.query?.id })
  const residenceDocumentsQuery = useGetResidenceDocuments({ residenceId: router?.query?.id })
  const updateResidenceMutation = useUpdateResidence()
  const changeStateProperty = useUpdateStateResidence()
  const uploadFiles = useUploadImages()

  const residence = residenceQuery?.data
  const blocs = residenceBlocsQuery?.data
  const properties = ResidencePropertiesQuery?.data
  const documents = residenceDocumentsQuery?.data

  // const images = residenceImagesQuery?.data
  // /* removed */
  const currentState = getStateByModel('DProject', residence?.state)

  const handleOpen = () => {
    setOpen(!open)
    setSelectedImage(0) // Set the selected image to the first one when the dialog opens
  }

  useEffect(() => {
    if (residenceImagesQuery?.isSuccess) {
      setImages(residenceImagesQuery?.data)
    }
  }, [residenceImagesQuery?.isFetching])

  // const handleNextImage = () => {
  //   setSelectedImage((selectedImage + 1) % property?.images.length)
  // }

  const handleStateSave = async () => {
    try {
      await changeStateProperty?.mutateAsync({
        id: router?.query?.id,
        values: { state: formInput?.state }
      })
    } catch (error) {}
  }

  useEffect(() => {
    setFormInput(formInput => {
      return { ...formInput, ...residence }
    })
  }, [residence])

  const handleDownloadAllFiles = async () => {
    try {
      downloadAllDocuments(residence?.id)
    } catch (error) {}
  }

  const handleUploadImages = async values => {
    try {
      await uploadFiles.mutateAsync({ values: values.values, residenceId: values?.id })
    } catch (error) {}
  }

  return (
    <>
      {residenceQuery?.isFetched && residenceQuery?.isSuccess && !residenceQuery?.isFetching ? (
        <MainCard content={false} sx={{ backgroundColor: '#F4F8FB' }}>
          <div className='flex flex-col gap-4 p-4'>
            <nav aria-label='Breadcrumb' className='flex flex-row justify-between ml-1'>
              <ol role='list' className='flex '>
                <li>
                  <div className='flex items-center'>
                    <a
                      href='#'
                      onClick={e => router.push('/residences/')}
                      className='mr-2 text-sm font-medium text-gray-900'
                    >
                      Residences
                    </a>
                    <svg
                      width='16'
                      height='20'
                      viewBox='0 0 16 20'
                      fill='currentColor'
                      aria-hidden='true'
                      className='w-4 h-5 text-gray-300'
                    >
                      <path d='M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z' />
                    </svg>
                  </div>
                </li>

                <li className='text-sm'>
                  <a href='#' aria-current='page' className='font-medium text-gray-500 hover:text-gray-600'>
                    {residence?.entitled}
                  </a>
                </li>
              </ol>
              <div>
                <button
                  onClick={() => {
                    // setOpenFile(true)
                    router.push(`/residences/${residence?.id}/update`)
                  }}
                  className='px-1 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                >
                  <Icon icon='bx:edit' className='w-6 h-6' />
                </button>
              </div>
            </nav>

            <div className='flex flex-col gap-4 md:flex-row'>
              {/* Big card on the left */}
              <div className='flex flex-col w-full gap-4 md:w-1/4'>
                {/* Description Card */}
                <CardDescription
                  displayImage={displayImage}
                  images={images}
                  residence={residence}
                  handleOpen={handleOpen}
                />
                {/* Timeline Card */}
                <CardTimeLine residence={residence?.project_histories} handleOpen={handleOpen} />
              </div>
              {/* Multiple small cards on the right */}
              <div className='flex flex-col w-full gap-4 md:w-3/4'>
                {/* Status card */}
                <MainCard content={false} title={'Changer Statut'} sx={{ backgroundColor: '#FDFDFD' }}>
                  <div className='grid w-full gap-4 p-4 md:grid-cols-4'>
                    <div className='md:col-span-3'>
                      <Autocomplete
                        value={states?.find(state => state?.state === formInput?.state) || null}
                        onChange={(event, newValue) => {
                          setFormInput(formData => {
                            return { ...formData, state: newValue?.state }
                          })
                        }}
                        options={states || []}
                        getOptionLabel={option => option?.entitled}
                        renderInput={params => (
                          <TextField {...params} variant='standard' label='Nouveau statut*' fullWidth />
                        )}
                      />
                    </div>
                    <div className='flex justify-center md:col-span-1 md:justify-end'>
                      <LoadingButton
                        loading={changeStateProperty?.isLoading}
                        startIcon={<Icon icon='material-symbols:save-outline' fontSize={20} />}
                        color='secondary'
                        variant='contained'
                        onClick={e => handleStateSave()}
                      >
                        {'Sauvegarder'}
                      </LoadingButton>
                    </div>
                  </div>
                </MainCard>
                {/* Documents & Images card */}
                <MainCard
                  content={false}
                  title={'Documents'}
                  sx={{ backgroundColor: '#ffffff' }}
                  secondary={
                    <>
                      <div className='flex flex-row items-center'>
                        <IconButton

                          // disabled={}
                          color='secondary'
                          size='large'
                          onClick={e => {
                            handleDownloadAllFiles()
                          }}
                        >
                          <Icon icon='material-symbols:download' fontSize={20} />
                        </IconButton>
                        <UploadFilesDialog residence={residence}></UploadFilesDialog>
                      </div>
                    </>
                  }
                >
                  <div className='grid p-4 pt-1'>
                    <CardDocuments documents={documents} />
                  </div>
                </MainCard>
                {/* Small card 2 */}
                <MainCard
                  content={false}
                  title={'Biens'}
                  secondary={
                    <LoadingButton
                      startIcon={<Icon icon='ic:baseline-plus' fontSize={20} />}
                      color='secondary'
                      variant='outlined'
                      onClick={() => setOpenAddProperty(true)}
                    >
                      {'Ajouter'}
                    </LoadingButton>
                  }
                  sx={{ backgroundColor: '#FDFDFD' }}
                >
                  <div className='grid p-2 pt-1'>
                    <CardBiens properties={properties} residence={residence} />
                  </div>
                </MainCard>
                {/* Small card 3 */}
                <MainCard
                  content={false}
                  title={'Blocs'}
                  secondary={
                    <LoadingButton
                      startIcon={<Icon icon='ic:baseline-plus' fontSize={20} />}
                      color='secondary'
                      variant='outlined'
                      onClick={() => setOpenAddBloc(true)}
                    >
                      {'Ajouter'}
                    </LoadingButton>
                  }
                  sx={{ backgroundColor: '#FDFDFD' }}
                >
                  <div className='grid p-2 pt-1'>
                    <CardBlocs blocs={blocs} residence={residence} />
                  </div>
                </MainCard>
              </div>
            </div>
            <BlocAddDialog residence={residence} open={openAddBloc} handleCloseBloc={() => setOpenAddBloc(false)} />
            <PropertyAddDialog
              residence={residence}
              open={openAddProperty}
              handleCloseProperty={() => setOpenAddProperty(false)}
            />
            {/* Images Dialog */}
            <DialogImages
              setDisplayImage={setDisplayImage}
              displayImage={displayImage}
              open={open}
              handleClose={() => {
                setOpen(false)
                setSelectedImage(0)
              }}
              images={images}
              data={residence}
              handleUploadImages={handleUploadImages}
            />
          </div>
        </MainCard>
      ) : (
        <MainCard content={false} sx={{ backgroundColor: '#F4F8FB' }}>
          <div class='flex justify-center items-center my-10'>
            <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
          </div>
        </MainCard>
      )}
    </>
  )
}

export default Residence
