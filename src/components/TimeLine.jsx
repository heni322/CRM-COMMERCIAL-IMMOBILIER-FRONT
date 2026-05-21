import MuiTimeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineDot from '@mui/lab/TimelineDot'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import MainCard from './MainCard'

const Timeline = styled(MuiTimeline)(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const TimeLineComponent = ({ data }) => {
  moment.locale('fr')

  return (
    <MainCard title={'Historique'}>
      <Timeline className='' style={{ overflow: 'auto', flexDirection: 'column-reverse', maxHeight: '800px' }}>
        {data &&
          data?.map((item, index) => {
            const date = moment(item.date, 'DD-MM-YYYY HH:mm')
            const diff = date.fromNow()

            return (
              <TimelineItem key={index} style={{ marginBottom: '15px' }}>
                <TimelineSeparator>
                  <TimelineDot color={item?.color} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      {item?.entitled}
                    </Typography>
                    <Typography variant='caption'>{item.date}</Typography>
                  </Box>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' style={{ maxWidth: '175px' }}>
                      {item?.description}
                    </Typography>
                    <div className='flex flex-row gap-1'>
                      <div className='text-sm'>Par</div>
                      <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                        {item?.user_name}
                      </Typography>
                    </div>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    {/* <Box sx={{ width: 28, height: 'auto' }}>
              <img width={28} height={28} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
            </Box> */}
                    {/* <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                invoice.pdf
              </Typography> */}
                  </Box>
                </TimelineContent>
              </TimelineItem>
            )
          })}
      </Timeline>
    </MainCard>
  )
}

export default TimeLineComponent
