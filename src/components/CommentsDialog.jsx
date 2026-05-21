// ** React Imports

import React, { useRef, useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import DialogActions from '@mui/material/DialogActions'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  useCreateDossierComment,
  useCreateFileComment,
  useReadFolderComments,
  useReadFileComments,
  useGetFilesCommentsAsObject,
  useGetFolderCommentsAsObject
} from 'src/services/dossier.service'
import { CircularProgress, Tooltip } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { array } from 'yup'

const CommentsDialog = ({ open, file, folder, folderComments, onDialogStatusChange, openDialog, dialogType }) => {
  // ** State
  const [comment, setComment] = useState('')
  const [fileComments, setFileComments] = useState([])
  const [cursor, setCursor] = useState('')
  const [folderCursor, setFolderCursor] = useState('')
  const [paginated, setpaginated] = useState(true)

  const [folderCommentsMap, setFolderComments] = useState([])
  const auth = useAuth()

  //Function to
  const handleClickOpen = () => {
    openDialog()
  }

  const handleClose = () => {
    onDialogStatusChange()
  }

  // ** Create Dossier Comment mutation

  const createDossierCommentMutation = useCreateDossierComment(folder?.id)
  const createFileCommentMutation = useCreateFileComment(file?.id)
  const readFolderCommentMutation = useReadFolderComments()
  const readFileCommentMutation = useReadFileComments(folder?.id)

  const getFilesCommentsQuery = useGetFilesCommentsAsObject({
    paginated: paginated,
    fileId: file?.id,
    order: 'desc',
    cursor: cursor
  })
  const filesCommentsData = getFilesCommentsQuery?.data

  const getFolderCommentsQuery = useGetFolderCommentsAsObject({
    paginated: paginated,
    folderId: folder?.id,
    order: 'desc',
    cursor: folderCursor
  })
  const folderCommentsData = getFolderCommentsQuery?.data

  useEffect(() => {
    if (file?.id && open) seeComment()
  }, [open, file?.id])

  useEffect(() => {
    if (getFilesCommentsQuery?.isSuccess && !getFilesCommentsQuery?.isFetching) {
      if (isScrolled) {
        setFileComments(prev => {
          return [...prev, ...filesCommentsData?.data]
        })
      } else {
        setFileComments(prev => {
          return [...filesCommentsData?.data]
        })
      }
    }
  }, [cursor, filesCommentsData, getFilesCommentsQuery?.isSuccess, getFilesCommentsQuery?.isFetching])

  useEffect(() => {
    if (getFolderCommentsQuery?.isSuccess && !getFolderCommentsQuery?.isFetching) {
      if (isScrolled && folderCursor) {
        setFolderComments(prev => {
          return [...prev, ...folderCommentsData?.data]
        })
      } else {
        setFolderComments(prev => {
          return [...folderCommentsData?.data]
        })
      }
    }
  }, [folderCommentsData, getFolderCommentsQuery?.isSuccess, getFolderCommentsQuery?.isFetching])
  const [loading, setLoading] = useState(false)

  const handleSendComment = async () => {
    try {
      const today = new Date()

      //
      const formattedDateString = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`

      if (!loading && comment.length > 0) {
        // console.log(fileComments)
        if (folder?.id) {
          setLoading(true)

          // Create a copy of the fileComments array
          const currentComments = [...folderCommentsMap]

          // Create a new comment object
          const newComment = {
            comment: comment,
            user: auth?.user,
            side: 0,
            created_at: formattedDateString

            // created_at: 'Envoi...'

            // Add any other properties you need for the comment
          }

          // Push the new comment to the local state
          currentComments.unshift(newComment)

          // Update the local state with the new comment
          setFolderComments(currentComments)

          // Send the comment to the server
          await createDossierCommentMutation?.mutateAsync({
            values: {
              comment: comment,
              d_folder_id: folder.id
            }
          })
          setComment('')
          setLoading(false)
        } else if (file?.id) {
          // Create a copy of the fileComments array
          const currentComments = [...fileComments]

          // Create a new comment object
          const newComment = {
            comment: comment,
            user: auth?.user,
            side: 0,
            created_at: formattedDateString

            // created_at: '...'

            // Add any other properties you need for the comment
          }

          // Push the new comment to the local state
          currentComments.unshift(newComment)

          // console.log(currentComments)

          // Update the local state with the new comment
          setFileComments(currentComments)

          // Send the comment to the server
          await createFileCommentMutation?.mutateAsync({
            values: {
              comment: comment,
              d_file_id: file.id
            }
          })
          setComment('')
          setLoading(false)
        }
      }

      // Clear the comment input field
    } catch (error) {
      // Handle errors here
    }
  }

  const seeComment = async () => {
    try {
      if (folder?.id) {
        await readFolderCommentMutation?.mutateAsync({
          id: folder.id
        })
      } else if (file?.id) {
        await readFileCommentMutation?.mutateAsync({
          id: file.id
        })
      }
    } catch (error) {}
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setComment(comment + '\n') // Append a new line character
    }
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0) // State to store scroll position
  const [scrollPositionTest, setScrollPositionTest] = useState(0) // State to store scroll position
  const contentRef = useRef(null)

  const handleScroll = () => {
    const position = contentRef.current.scrollTop
    setScrollPosition(position)

    if (position - scrollPositionTest < -400) {
      setIsScrolled(true)
      if (file?.id && filesCommentsData?.next_cursor) {
        setCursor(filesCommentsData?.next_cursor)
      } else if (folder?.id && folderCommentsData?.next_cursor) {
        setFolderCursor(folderCommentsData?.next_cursor)
      }

      setScrollPositionTest(position)
    }
  }

  return (
    <div>
      {open ? (
        <div>
          {dialogType == 'FilesComments' ? (
            <Box position='relative'></Box>
          ) : dialogType == 'commentsSecondary' ? (
            <Box textAlign='center' margin='auto'>
              <IconButton onClick={() => handleClickOpen()} edge='end'>
                <Icon icon='mdi:plus' />
              </IconButton>
            </Box>
          ) : (
            <div textAlign='center' className='text-center cursor-pointer' margin='auto'>
              <Button onClick={() => handleClickOpen()} variant='outlined'>
                Afficher tous les commentaires
              </Button>
            </div>
          )}

          <Dialog
            onClose={handleClose}
            scroll='paper'
            aria-labelledby='customized-dialog-title'
            maxWidth={'md'}
            fullWidth={'md'}
            open={open}
          >
            <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
              <Typography variant='h6' component='span'>
                {file ? file?.name : <>Commentaires</>}
              </Typography>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
              >
                <Icon icon='mdi:close' />
              </IconButton>
            </DialogTitle>
            <DialogContent
              dividers
              className='min-h-[400px] max-h-[400px] sm:max-h-[230px] md:max-h-[350px] xl:max-h-[600px] xl:min-h-[600px]'
              sx={{ p: 4 }}
            >
              {getFilesCommentsQuery?.isLoading ? (
                <div className='flex flex-col justify-center gap-6 my-2 text-xl text-center'>
                  Chargement des commentaires...
                </div>
              ) : null}

              {folder && folderCommentsMap?.length === 0 ? (
                <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
                  <IconifyIcon
                    className='w-[200px] xl:w-[400px] h-40 self-center text-gray-600 xl:max-w-[400px] max-w-[200px] max-h-40 min-w-[200px] xl:min-w-[400px] min-h-40 '
                    icon='tabler:message'
                  />
                  {getFilesCommentsQuery?.isLoading ? (
                    <>Chargement des commentaires...</>
                  ) : (
                    <>Aucun commentaire ajouté</>
                  )}
                </div>
              ) : null}
              {filesCommentsData?.data && fileComments?.length == 0 && !folder ? (
                <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
                  <IconifyIcon
                    className='w-[200px] xl:w-[400px] h-40 self-center text-gray-600 xl:max-w-[400px] max-w-[200px] max-h-40 min-w-[400px] min-h-40 '
                    icon='tabler:message'
                  />
                  {getFilesCommentsQuery?.isLoading ? (
                    <>Chargement des commentaires...</>
                  ) : (
                    <>Aucun commentaire ajouté</>
                  )}
                </div>
              ) : null}
              {(fileComments && fileComments?.length) || (folderCommentsMap && folderCommentsMap?.length) ? (
                <div
                  ref={contentRef}
                  onScroll={handleScroll}
                  className='w-full flex flex-col gap-6 min-h-[350px] max-h-[350px] sm:max-h-[200px] md:max-h-[300px] xl:max-h-[550px] xl:min-h-[550px] align-middle overflow-y-auto smooth-scroll'
                  style={{ overflow: 'auto', flexDirection: 'column-reverse' }}
                >
                  {folder
                    ? folderCommentsMap?.map((comment, index) =>
                        comment?.side == 0 ? (
                          <div>
                            {/* right side = 1 */}
                            <div key={index} className='flex items-end content-end justify-end mb'>
                              <div className='flex items-start '>
                                <div className='flex flex-col items-end content-end justify-end mb '>
                                  <div className='flex justify-end mb-2'>
                                    <div className='grid justify-items-stretch'>
                                      <div className='ml-[-8px]'>
                                        <div

                                        // className='flex flex-row bg-[#4770df] rounded-3xl rounded-br-none shadow-md text-white  p-3 max-w-xs '

                                        // title={comment?.created_at}
                                        // placement='left'
                                        >
                                          <div className='flex flex-row bg-[#4770df] rounded-3xl rounded-br-none shadow-md text-white  p-3 max-w-xs '>
                                            <p>{comment?.comment}</p>
                                            <div className='flex flex-row items-end content-end justify-end mt-3 ml-2'>
                                              <p className='text-xs text-gray-300'>{comment?.created_at?.slice(-5)}</p>
                                              <Tooltip className='' title={comment?.seen_text} placement='bottom'>
                                                <p className='ml-1 text-xs text-gray-300'>
                                                  {comment?.side == 0 ? (
                                                    comment?.read_by_client == 1 && comment?.read == 1 ? (
                                                      <IconifyIcon
                                                        className='w-[20px] h-5  text-lime-200 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                                                        icon='ri:check-double-fill'
                                                      />
                                                    ) : (
                                                      <IconifyIcon
                                                        className='w-[20px] h-5  text-lime-200 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                                                        icon='ri:check-fill'
                                                      />
                                                    )
                                                  ) : null}
                                                </p>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='text-center !text-xs mt-1 text-gray-400'>
                                        {comment?.created_at?.slice(0, 10)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='self-end ml-2 '>
                                  <ListItemAvatar>
                                    <Tooltip title={comment?.user.name} placement='top'>
                                      <Avatar src='/images/avatars/1.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  </ListItemAvatar>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={index} className='flex mb-1 '>
                            <div className='flex items-start '>
                              <div className='self-start mt-[-20px]'>
                                <ListItemAvatar>
                                  {comment?.seen_text ? (
                                    <Tooltip title={comment?.user.name} placement='top'>
                                      <Avatar src='/images/avatars/2.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title='Collaborateurs' placement='top'>
                                      <Avatar src='/images/avatars/2.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  )}
                                </ListItemAvatar>
                              </div>

                              <div className='grid justify-items-stretch'>
                                <div className='ml-[-8px]'>
                                  <div

                                  // className='flex flex-row max-w-xs p-3 bg-white rounded-tl-none shadow-md rounded-3xl '
                                  // title={comment?.created_at}
                                  // placement='right'
                                  >
                                    <div className='flex flex-row max-w-xs p-3 bg-white rounded-tl-none shadow-md rounded-3xl '>
                                      <p>{comment?.comment}</p>
                                      <div className='flex flex-row mt-3 ml-2 !text-xs !text-gray-400 justify-end items-end content-end'>
                                        <Tooltip className='' title={comment?.seen_text} placement='bottom'>
                                          <p className='!text-xs !text-gray-400'>{comment?.created_at?.slice(-5)}</p>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='text-center !text-xs mt-1 text-gray-400'>
                                  {comment?.created_at?.slice(0, 10)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    : fileComments?.length > 0
                    ? fileComments?.map((comment, index) =>
                        comment?.side == 0 ? (
                          <div>
                            {/* right side = 1 */}
                            <div key={index} className='flex items-end content-end justify-end mb'>
                              <div className='flex items-start '>
                                <div className='flex flex-col items-end content-end justify-end mb '>
                                  <div className='flex justify-end mb-2'>
                                    <div className='grid justify-items-stretch'>
                                      <div className='ml-[-8px]'>
                                        <div

                                        // className='flex flex-row bg-[#4770df] rounded-3xl rounded-br-none shadow-md text-white  p-3 max-w-xs '

                                        // title={comment?.created_at}
                                        // placement='left'
                                        >
                                          <div className='flex flex-row bg-[#4770df] rounded-3xl rounded-br-none shadow-md text-white  p-3 max-w-xs '>
                                            <p>{comment?.comment}</p>
                                            <div className='flex flex-row items-end content-end justify-end mt-3 ml-2'>
                                              <p className='text-xs text-gray-300'>{comment?.created_at?.slice(-5)}</p>
                                              <Tooltip className='' title={comment?.seen_text} placement='bottom'>
                                                <p className='ml-1 text-xs text-gray-300'>
                                                  {comment?.side == 0 ? (
                                                    comment?.read_by_client == 1 && comment?.read == 1 ? (
                                                      <IconifyIcon
                                                        className='w-[20px] h-5  text-lime-200 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                                                        icon='ri:check-double-fill'
                                                      />
                                                    ) : (
                                                      <IconifyIcon
                                                        className='w-[20px] h-5  text-lime-200 max-w-[20px] max-h-5 min-w-[20px] min-h-5 '
                                                        icon='ri:check-fill'
                                                      />
                                                    )
                                                  ) : null}
                                                </p>
                                              </Tooltip>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='text-center !text-xs mt-1 text-gray-400'>
                                        {comment?.created_at?.slice(0, 10)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='self-end ml-2 '>
                                  <ListItemAvatar>
                                    <Tooltip title={comment?.user.name} placement='top'>
                                      <Avatar src='/images/avatars/1.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  </ListItemAvatar>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={index} className='flex mb-1 '>
                            <div className='flex items-start '>
                              <div className='self-start mt-[-20px]'>
                                <ListItemAvatar>
                                  {comment?.seen_text ? (
                                    <Tooltip title={comment?.user.name} placement='top'>
                                      <Avatar src='/images/avatars/2.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title='Collaborateurs' placement='top'>
                                      <Avatar src='/images/avatars/2.png' alt={comment?.author} className='w-12 h-12' />
                                    </Tooltip>
                                  )}
                                </ListItemAvatar>
                              </div>

                              <div className='grid justify-items-stretch'>
                                <div className='ml-[-8px]'>
                                  <div

                                  // className='flex flex-row max-w-xs p-3 bg-white rounded-tl-none shadow-md rounded-3xl '
                                  // title={comment?.created_at}
                                  // placement='right'
                                  >
                                    <div className='flex flex-row max-w-xs p-3 bg-white rounded-tl-none shadow-md rounded-3xl '>
                                      <p>{comment?.comment}</p>
                                      <div className='flex flex-row mt-3 ml-2 !text-xs !text-gray-400 justify-end items-end content-end'>
                                        <Tooltip className='' title={comment?.seen_text} placement='bottom'>
                                          <p className='!text-xs !text-gray-400'>{comment?.created_at?.slice(-5)}</p>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='text-center !text-xs mt-1 text-gray-400'>
                                  {comment?.created_at?.slice(0, 10)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    : null}
                </div>
              ) : null}
            </DialogContent>

            <DialogActions>
              <div className='flex flex-row w-full gap-2 mt-4'>
                <div className='w-[80%]'>
                  <TextField
                    multiline
                    placeholder='Add your comment'
                    label='Comment'
                    fullWidth
                    rowsMax={4} // Set the maximum number of rows based on your design
                    // variant='outlined'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className='w-[20%] flex align-bottom '>
                  <Button
                    fullWidth
                    className='max-h-[50px] !mt-1 h-full'
                    variant='contained'
                    color='primary'
                    onClick={handleSendComment}
                    disabled={createDossierCommentMutation.isLoading || createFileCommentMutation.isLoading}
                  >
                    <div className='flex gap-2'>
                      {(createDossierCommentMutation.isLoading || createFileCommentMutation.isLoading) && (
                        <CircularProgress size={24} />
                      )}

                      <IconifyIcon className='w-6 h-6' icon='lucide:send' />
                      <Typography color={'white'}> Envoyer </Typography>
                    </div>
                  </Button>
                </div>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      ) : null}
    </div>
  )
}

export default CommentsDialog
