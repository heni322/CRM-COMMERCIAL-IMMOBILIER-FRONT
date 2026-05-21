// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FormControl, FormHelperText, Grid, TextField } from '@mui/material'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const CustomFileUpload = ({ files, limit, multiple, name, handleFilesChange, onFileDelete, error, fileTypes = [] }) => {
  // ** State
  const [fileNames, setFileNames] = useState([])
  const [fileList, setFileList] = useState([])

  // const [files, setFiles] = useState([])
  let borderColor = ''
  if (error && error.errors?.files) {
    borderColor = error && error.errors.files ? 'red' : 'gray'
  }
  useEffect(() => {
    setFileList([...files])
  }, [files])

  // ** Hooks
  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: acceptedFiles => {
  //     setFiles(acceptedFiles.map(file => file))
  //   }
  // })

  // const inputProps = getInputProps({
  //   accept: '.pdf'
  // })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.filter(file => isFileTypeSafe(file.name.split('.').pop(), fileTypes))

      if (newFiles.length === 0) {
        toast.error('Type de fichier invalide')

        return
      }

      const updatedList = [...fileList, ...newFiles]

      if (updatedList.length > limit || newFiles.length > 300) {
        toast.error(`Taille d'image est plus grande que ${limit}`)

        return
      }

      setFileList(updatedList)
      handleFilesChange(updatedList)
    },
    multiple: multiple
  })

  const inputProps = getInputProps()

  const renderFilePreview = file => {
    const fileExtension = file?.name?.match(/\.([^.]+)$/)?.[1]?.toLowerCase()
    const isDocument = ['pdf', 'doc', 'docx', 'csv', 'xlsx'].includes(fileExtension)
    if (!isDocument) {
      return <img width={25} height={25} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = file => {
    const updatedList = [...fileList]
    updatedList.splice(fileList.indexOf(file), 1)
    setFileList(updatedList)
    onFileDelete()
    handleFilesChange(updatedList)
  }

  // const [formInput, setFormInput] = useState({
  //   fileName: ''
  // })

  // const handleChange = (index, event) => {
  //   const newFiles = Object.values(event?.target?.files).map(file => file)
  //   if (newFiles) {
  //     const updatedList = [...fileList, ...newFiles]
  //     if (updatedList.length > limit || newFiles.length > 10) {
  //       return toast.error('data?.response?.data?.message')
  //     }

  //     // if (newFiles.length === 0) {
  //     //   toast.error('data?.response?.data?.message')

  //     //   return
  //     // }
  //     setFileList(updatedList)
  //     field.onChange(updatedList)
  //     handleFilesChange(updatedList)
  //   }
  // }

  // const fileListPreview = fileList.map(file => (
  //   <div key={file.name}>
  //     <div className='file-details'>
  //       <div className=''>{renderFilePreview(file)}</div>
  //       <div>
  //         <Typography className='file-name'>{file.name}</Typography>
  //         <Typography className='file-size' variant='body2'>
  //           {Math.round(file.size / 100) / 10 > 1000
  //             ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
  //             : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
  //         </Typography>
  //       </div>
  //     </div>
  //     <IconButton onClick={() => handleRemoveFile(file)}>
  //       <Icon icon='mdi:close' fontSize={20} />
  //     </IconButton>
  //   </div>
  // ))

  const handleLinkClick = event => {
    event.preventDefault()
  }

  const handleRemoveAllFiles = () => {
    setFileList([])
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...inputProps} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'center',
            border: `1px dashed ${borderColor}`
          }}
        >
          <Img width={200} sx={{ padding: '2%' }} alt='Upload img' src='/images/misc/upload.png' />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h5'>Déposez les fichiers ici ou cliquez</HeadingTypography>
            <Typography color='textSecondary'>
              Déposez les fichiers ici ou cliquez{' '}
              <Link className='cursor-pointer' onClick={handleLinkClick}>
                Parcourir
              </Link>{' '}
              cela à travers votre machine.
            </Typography>
          </Box>
        </Box>
      </div>
      {fileList.length ? (
        <Fragment>
          <div className='grid grid-cols-3 gap-2 my-4'>
            {fileList?.map(file => (
              <div key={file.name} className='flex flex-row gap-2 max-w-20'>
                <div className='flex flex-row gap-2 file-details'>
                  <div className=''>{renderFilePreview(file)}</div>
                  <div>
                    <Typography
                      className='truncate file-name max-w-28'
                      style={{ maxWidth: '120px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    >
                      {file.name}
                    </Typography>

                    <Typography className='file-size' variant='body2'>
                      {Math.round(file.size / 100) / 10 > 1000
                        ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                  </div>
                </div>
                <div>
                  <IconButton onClick={() => handleRemoveFile(file)}>
                    <Icon icon='mdi:close' fontSize={20} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Enlevez touts les fichiers
            </Button>
          </div>
        </Fragment>
      ) : null}
      {!!error?.errors?.files && (
        <FormHelperText sx={{ color: 'error.main', paddingTop: '1%' }} id='validation-basic-select'>
          {error.errors?.files}
        </FormHelperText>
      )}
    </Fragment>
  )
}

export default CustomFileUpload

function isFileTypeSafe(fileExtension, safeExtensions) {
  // List of safe file

  // Check if the provided extension is in the safe list
  return safeExtensions.includes(fileExtension.toLowerCase())
}
