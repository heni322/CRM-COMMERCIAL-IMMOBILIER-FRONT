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
import UploadFilesDialog from 'src/components/UploadFilesDialog'
import UploadFilesDialogProperty from 'src/components/UploadFilesDialogProperty'
import {
  useDownloadAllDocuments as downloadAllDocuments,
  useGetPropertyById,
  useGetPropertyDocuments,
  useGetPropertyImages,
  useUpdateStateProperty,
  useUploadImages
} from 'src/services/properties.service'
import CardPrices from './CardPrices'
import AddPriceDialog from './AddPriceDialog'
import TimelineDialog from './TimelineDialog'
import OfferList from './OfferList'
import OfferDataTable from 'src/views/offers/List/DataTable'
import DialogImages from 'src/views/residences/show/details/DialogImages'

const Property = ({}) => {
  const router = useRouter()
  const propertyId = router?.query?.id
  const propertyQuery = useGetPropertyById(propertyId)
  const property = propertyQuery?.data
  const changeStateProperty = useUpdateStateProperty()

  const [formInput, setFormInput] = useState({})
  const [images, setImages] = useState([])
  const [displayImage, setDisplayImage] = useState(0)
  const [open, setOpen] = useState(false)
  const [openPrice, setOpenPrice] = useState(false)
  const [openTimeline, setOpenTimeline] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const { getStateByModel, getStatesByModel } = useStates()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [componentLoading, setComponentLoading] = useState(true)

  const states = getStatesByModel('DProperty')
  const currentState = getStateByModel('DProperty', property?.state)

  const propertyImagesQuery = useGetPropertyImages({ propertyId: router?.query?.id })
  const propertyDocumentsQuery = useGetPropertyDocuments({ propertyId: router?.query?.id })
  const propertyImages = propertyImagesQuery?.data
  const documents = propertyDocumentsQuery?.data
  const uploadFiles = useUploadImages()

  const handleOpen = () => {
    setOpen(!open)
    setSelectedImage(0) // Set the selected image to the first one when the dialog opens
  }

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
      return { ...formInput, ...property }
    })
  }, [property])

  useEffect(() => {
    if (propertyImagesQuery?.isSuccess) {
      setImages(propertyImagesQuery?.data)
    }
  }, [propertyImagesQuery?.isFetching])

  const handleUploadImages = async values => {
    try {
      await uploadFiles.mutateAsync({ values: values.values, propertyId: values?.id })
    } catch (error) {}
  }

  const handleDownloadAllFiles = () => {
    try {
      downloadAllDocuments(property?.id)
    } catch (error) {}
  }

  return (
    <>
      {propertyQuery?.isFetched && propertyQuery?.isSuccess && !propertyQuery?.isFetching ? (
        <MainCard content={false} sx={{ backgroundColor: '#F4F8FB' }}>
          <div className='flex p-4 gap-4  flex-col'>
            <nav aria-label='Breadcrumb' className='flex flex-row justify-between ml-1'>
              <ol role='list' className='flex '>
                <li>
                  <div className='flex items-center'>
                    <a
                      href='#'
                      onClick={e => router.push('/properties/')}
                      className='mr-2 text-sm font-medium text-gray-900'
                    >
                      Biens
                    </a>
                    <svg
                      width='16'
                      height='20'
                      viewBox='0 0 16 20'
                      fill='currentColor'
                      aria-hidden='true'
                      className='h-5 w-4 text-gray-300'
                    >
                      <path d='M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z' />
                    </svg>
                  </div>
                </li>

                <li className='text-sm'>
                  <a href='#' aria-current='page' className='font-medium text-gray-500 hover:text-gray-600'>
                    {property?.entitled}
                  </a>
                </li>
              </ol>
              <div>
                <button
                  onClick={() => {
                    // setOpenFile(true)
                    router.push(`/properties/${property?.id}/update`)
                  }}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                >
                  <Icon icon='bx:edit' className='w-6 h-6' />
                </button>
              </div>
            </nav>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Big card on the left */}
              <div className='flex md:w-1/3 flex-col w-full gap-4'>
                {/* Description Card */}
                <MainCard
                  title={property?.entitled}
                  content={false}
                  secondary={
                    <>
                      <div className='flex flex-row items-center'>
                        <IconButton
                          color='secondary'
                          size='large'
                          onClick={e => {
                            setOpenTimeline(true)
                          }}
                        >
                          <Icon icon='ic:twotone-timeline' fontSize={20} />
                        </IconButton>
                      </div>
                    </>
                  }
                  sx={{ backgroundColor: '#ffffff' }}
                >
                  <CardDescription
                    images={images}
                    displayImage={displayImage}
                    property={property}
                    handleOpen={handleOpen}
                  />
                </MainCard>
                {/* Prices Card */}
                <MainCard
                  content={false}
                  title={'Prix'}
                  sx={{ backgroundColor: '#ffffff' }}
                  secondary={
                    <>
                      <div className='flex flex-row items-center'>
                        <IconButton
                          color='secondary'
                          size='large'
                          onClick={e => {
                            setOpenPrice(true)
                          }}
                        >
                          <Icon icon='gg:add' fontSize={20} />
                        </IconButton>
                      </div>
                    </>
                  }
                >
                  <div className='grid pt-1 p-4'>
                    <CardPrices prices={property?.prices} />
                  </div>
                </MainCard>
              </div>
              {/* Multiple small cards on the right */}
              <div className='w-full md:w-2/3 flex flex-col gap-4'>
                {/* State card */}
                <MainCard content={false} title={'Changer Statut'} sx={{ backgroundColor: '#FDFDFD' }}>
                  <div className='w-full grid md:grid-cols-4 p-4 gap-4'>
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
                    <div className='md:col-span-1 flex justify-center md:justify-end'>
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
                {/* Documents Card */}
                <MainCard content={false} title={'Documents'} sx={{ backgroundColor: '#ffffff' }}>
                  <div className='grid pt-1 p-4'>
                    <OfferDataTable
                      documents={documents}
                      columnProfile='fiche_property'
                      filter={false}
                      pageSizeParam={10}
                      selection={false}
                      disablePageSize={true}
                      addNew={false}
                      generateButton={false}
                      propertyId={property?.id}
                    />
                    {/* <OfferList  /> */}
                  </div>
                </MainCard>
                {/* Documents Card */}
                <MainCard
                  content={false}
                  title={'Documents'}
                  sx={{ backgroundColor: '#ffffff' }}
                  secondary={
                    <>
                      <div className='flex flex-row items-center'>
                        <IconButton
                          color='secondary'
                          size='large'
                          onClick={e => {
                            // setDisabled(false)
                            handleDownloadAllFiles()
                          }}
                        >
                          <Icon icon='material-symbols:download' fontSize={20} />
                        </IconButton>
                        <UploadFilesDialogProperty property={property}></UploadFilesDialogProperty>
                      </div>
                    </>
                  }
                >
                  <div className='grid pt-1 p-4'>
                    <CardDocuments documents={documents} />
                  </div>
                </MainCard>
              </div>
            </div>
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
              data={property}
              handleUploadImages={handleUploadImages}
            />

            <AddPriceDialog
              open={openPrice}
              setOpenPrice={() => setOpenPrice(false)}
              handleClosePrice={() => {
                setOpenPrice(false)
              }}
              property={property}
            />
            <TimelineDialog
              open={openTimeline}
              setOpen={() => setOpenTimeline(false)}
              handleClose={() => {
                setOpenTimeline(false)
              }}
              property={property}
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

export default Property
