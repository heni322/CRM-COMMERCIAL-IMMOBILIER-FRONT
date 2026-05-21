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

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton } from '@mui/material'
import FileDialog from 'src/components/FileDialog'
import DialogAlert from 'src/components/DialogAlert'
import { useDeleteDocument, useDeleteImage } from 'src/services/documents.service'
import UploadImagesDialog from 'src/components/UploadImagesDialog'
import UploadPropertyImagesDialog from 'src/components/UploadPropertyImagesDialog'

const DialogImages = ({ images, open, handleClose, property }) => {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedFile, setSelectedFile] = useState()
  const [isOpenFileDialog, setIsOpenFileDialog] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const [openFile, setOpenFile] = useState(false)

  const deleteImageMutation = useDeleteImage()

  const handleCloseFileDialog = () => {
    setSelectedFile(null)
    setIsOpenFileDialog(false)
  }
  useEffect(() => {
    setSelectedImage(0)
  }, [open])

  const handleDelete = async e => {
    try {
      await deleteImageMutation.mutateAsync(selectedFile?.id)
      setSuspendDialogOpen(false)
      const prevImage = (selectedImage - 1 + images.length) % images.length
      setSelectedImage(prevImage)
    } catch (error) {}
  }

  const handlePreviousImage = () => {
    const prevImage = (selectedImage - 1 + images.length) % images.length
    setSelectedImage(prevImage)
  }

  const handleNextImage = () => {
    const nextImage = (selectedImage + 1) % images.length
    setSelectedImage(nextImage)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' width='md'>
      <DialogTitle>
        <Typography variant='h6' component='span'>
          Images
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
        {images && images?.length > 0 ? (
          <div id='carouselExampleCaptions' className='relative' data-te-carousel-init data-te-ride='carousel'>
            {/* Carousel items */}
            <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
              {images?.map((image, index) => (
                <div
                  key={index}
                  className={`relative float-left -mr-[100%] w-full  transition-transform duration-[600ms] ease-in-out ${
                    index === selectedImage ? 'block' : 'hidden'
                  } motion-reduce:transition-none`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}files/image/${image?.id}`}
                    className='block w-full min-w-96'
                    alt='...'
                  />
                  <div className='absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block'>
                    <h5 className='text-xl'>Image {index + 1} </h5>
                    {/* <p>Some representative placeholder content for the slide.</p> */}
                  </div>
                  <div className='absolute top-0 right-0 z-10 flex gap-2 mt-4 mr-4'>
                    <button
                      onClick={() => {
                        setSelectedFile(image)

                        setSuspendDialogOpen(true)
                      }}
                      className='w-8 h-8 px-1 py-1 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                    >
                      <Icon icon='mdi:trash-can' className='w-6 h-5' />
                    </button>
                    <button
                      onClick={() => {
                        setOpenFile(true)
                      }}
                      className='px-1 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    >
                      <Icon icon='material-symbols:upload' className='w-6 h-6' />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls - prev item */}
            <button
              className='absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none'
              type='button'
              data-te-target='#carouselExampleCaptions'
              data-te-slide='prev'
              onClick={handleNextImage}
            >
              <span className='inline-block w-8 h-8'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
              <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Previous
              </span>
            </button>

            {/* Carousel controls - next item */}
            <button
              className='absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none'
              type='button'
              data-te-target='#carouselExampleCaptions'
              data-te-slide='next'
              onClick={handleNextImage}
            >
              <span className='inline-block w-8 h-8'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
              <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Next
              </span>
            </button>
          </div>
        ) : (
          <div className='w-[200px] h-[100px] md:w-[500px] md:h-[300px] flex justify-center items-center'>
            <div>Pas d'images</div>
            <div className='absolute top-0 right-0 z-10 flex gap-2 mt-4 mr-4'>
              <button
                onClick={() => {
                  setOpenFile(true)
                }}
                className='px-1 py-1 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              >
                <Icon icon='material-symbols:upload' className='w-6 h-6' />
              </button>
            </div>
          </div>
        )}
        <DialogAlert
          open={suspendDialogOpen}
          description=''
          setOpen={setSuspendDialogOpen}
          title={`Supprimer l'image ${selectedFile?.path}?`}
          acceptButtonTitle='Accepter'
          declineButtonTitle='Annuler'
          handleAction={e => {

            if (e === true) {
              handleDelete()
            } else setSuspendDialogOpen(false)
          }}
        />
        <UploadPropertyImagesDialog open={openFile} setOpen={setOpenFile} property={property} />
      </DialogContent>
    </Dialog>
  )
}

export default DialogImages
