// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'
import UploadImagesDialog from './UploadImagesDialog'
import { useDeleteImage } from 'src/services/residences.service'
import DialogAlert from './DialogAlert'

const ImageCarousel = ({ images, residence, height }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const deleteImageMutation = useDeleteImage()

  const handleSlideChange = index => {
    setCurrentSlide(index)
  }

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + images.length) % images.length
    setCurrentSlide(prevIndex)
  }

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % images.length
    setCurrentSlide(nextIndex)
  }

  const handleDelete = async e => {
    try {
      await deleteImageMutation.mutateAsync(selectedImage?.id)
      setSuspendDialogOpen(false)
    } catch (error) {}
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className='relative' id='carouselExampleCaptions'>
        {/* Indicators */}
        <div
          className='absolute bottom-0 left-0 right-0 z-[2] mx-[15%] mb-4 flex list-none justify-center p-0'
          data-te-carousel-indicators
        >
          {images?.map((_, index) => (
            <button
              key={index}
              type='button'
              data-te-target='#carouselExampleCaptions'
              data-te-slide-to={index}
              onClick={() => handleSlideChange(index)}
              className={`mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none ${
                index === currentSlide ? 'opacity-100' : ''
              }`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            >
              <span className={`block h-1 w-full ${index === currentSlide ? 'bg-white' : 'bg-gray-500'}`} />
            </button>
          ))}
        </div>

        {/* Slides */}
        <div
          className='relative w-full overflow-hidden after:clear-both after:block after:content-[""]'
          style={{ maxHeight: height + 'px' }}
        >
          {images?.map((image, index) => (
            <div
              key={index}
              className={`relative float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none ${
                index === currentSlide ? '' : 'opacity-0'
              }`}
              style={{ maxHeight: height + 'px' }}
            >
              <img
                src={
                  'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                className='block w-full mx-auto'
                style={{ height: `${height}px` }}
                alt={`Slide ${index + 1}`}
              />
              <div className='flex gap-2 absolute top-0 right-0 mt-4 mr-4 z-10'>
                <button
                  onClick={() => {
                    setSelectedImage(image)
                    console.log('selected image', image)
                    setSuspendDialogOpen(true)
                  }}
                  className='w-8 h-8 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                >
                  <Icon icon='mdi:trash-can' className='w-6 h-5' />
                </button>
                <button
                  onClick={() => {
                    setOpen(true)
                  }}
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                >
                  <Icon icon='material-symbols:upload' className='w-6 h-6' />
                </button>
              </div>
              {/* <div className='absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block'>
              <h5 className='text-xl'>Slide {index + 1} label</h5>
              <p>Some representative placeholder content for slide {index + 1}.</p>
            </div> */}
            </div>
          ))}
        </div>

        {/* Previous button */}
        <button
          className='absolute bottom-0 left-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none'
          type='button'
          data-te-target='#carouselExampleCaptions'
          onClick={prevSlide}
        >
          <span className='inline-block h-8 w-8'>
            {/* SVG icon for previous */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
            </svg>
          </span>
          <span className='sr-only'>Previous</span>
        </button>

        {/* Next button */}
        <button
          className='absolute bottom-0 right-0 top-0 z-[1] flex w-[15%] items-center justify-center border-0 bg-none p-0 text-center text-white opacity-50 transition-opacity duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-white hover:no-underline hover:opacity-90 hover:outline-none focus:text-white focus:no-underline focus:opacity-90 focus:outline-none motion-reduce:transition-none'
          type='button'
          data-te-target='#carouselExampleCaptions'
          onClick={nextSlide}
        >
          <span className='inline-block h-8 w-8'>
            {/* SVG icon for next */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
            </svg>
          </span>
          <span className='sr-only'>Next</span>
        </button>
      </div>
      {/* <div className='flex gap-2 absolute top-0 right-0 mt-4 mr-4 z-10'>
        <button
          onClick={() => setSuspendDialogOpen(true)}
          className='w-8 h-8 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
        >
          <Icon icon='mdi:trash-can' className='w-6 h-5' />
        </button>
        <UploadImagesDialog residence={residence} />
      </div> */}

      <DialogAlert
        open={suspendDialogOpen}
        description=''
        setOpen={setSuspendDialogOpen}
        title={`Supprimer l'image ${selectedImage?.path}?`}
        acceptButtonTitle='Accepter'
        declineButtonTitle='Annuler'
        handleAction={e => {
          console.log(e)
          if (e === true) {
            handleDelete()
          } else setSuspendDialogOpen(false)
        }}
      />

      <UploadImagesDialog open={open} setOpen={setOpen} residence={residence} />
    </div>
  )
}

export default ImageCarousel
