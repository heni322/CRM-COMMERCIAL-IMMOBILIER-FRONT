// ** MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import DialogCustomized from 'src/views/components/dialogs/DialogCustomized'
import CommentsDialog from 'src/components/CommentsDialog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Tooltip } from '@mui/material'

//React

import React, { useEffect, useRef } from 'react'
import IconifyIcon from 'src/@core/components/icon'

const CommentsList = ({ comments, folder }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Scroll to the bottom when component mounts or when comments change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [comments])
  if (!comments) {
    // Handle the case when comments are null or undefined
    return (
      <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
        <IconifyIcon
          className='w-[400px] h-40 self-center text-gray-600 max-w-[400px] max-h-40 min-w-[400px] min-h-40 '
          icon='tabler:message'
        />
        Chargement des commentaires
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col w-full gap-6 mt' ref={containerRef}>
        {' '}
        {comments ? (
          comments?.slice(0, 4)?.map((comment, index) =>
            comment?.side === 0 ? (
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
                    <div className='text-center !text-xs mt-1 text-gray-400'>{comment?.created_at?.slice(0, 10)}</div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
            <IconifyIcon
              className='w-[400px] h-40 self-center text-gray-600 max-w-[400px] max-h-40 min-w-[400px] min-h-40 '
              icon='tabler:message'
            />
            Chargement des commentaires
          </div>
        )}
        {folder && comments && comments?.length == 0 ? (
          <div className='flex flex-col justify-center gap-6 text-xl text-center my-14'>
            <IconifyIcon
              className='w-[400px] h-40 self-center text-gray-600 max-w-[400px] max-h-40 min-w-[400px] min-h-40 '
              icon='tabler:message'
            />
            <>Aucun commentaire ajouté</>
          </div>
        ) : null}
      </div>

      {/* <CommentsDialog comments={comments} folder={folder} dialogType={'comments'}></CommentsDialog> */}
    </div>
  )
}

export default CommentsList
