// ** MUI Import
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Switch from '@mui/material/Switch'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import TimelineContent from '@mui/lab/TimelineContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'

const Timeline = styled(MuiTimeline)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root:nth-of-type(even) .MuiTimelineContent-root': {
    textAlign: 'left'
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none'
      }
    }
  }
}))

// Styled component for the image of a shoe
const ImgShoe = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))

const CardTimeLine = ({ property, handleOpen }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const hiddenMD = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <MainCard title={'Historique du bien'} content={false} sx={{ backgroundColor: '#ffffff' }}>
      <div className='relative wrap overflow-hidden p-2 h-full'>
        <Timeline position={hiddenMD ? 'right' : 'alternate'}>
          {property?.propertyHistory?.map((historyItem, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <CustomTimelineDot skin='light'>
                  <Icon icon={historyItem.icon} fontSize={20} />
                </CustomTimelineDot>
                {index !== property?.propertyHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                <div className={`flex flex-col ${index % 2 !== 0 && 'items-end'}`}>
                  <p className={`text-md text-gray-800 font-semibold ${historyItem.color || 'text-gray-600'}`}>
                    {historyItem.event}
                  </p>
                  <p className='text-md text-gray-500'>{historyItem.date}</p>
                  {historyItem.price && <p className='text-md text-gray-500'>{historyItem.price}</p>}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </MainCard>
  )
}

export default CardTimeLine
