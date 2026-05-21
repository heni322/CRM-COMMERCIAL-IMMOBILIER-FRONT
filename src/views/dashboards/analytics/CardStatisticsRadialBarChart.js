// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

const CardStatisticsRadialBarChart = ({ title, value, icon, color, number }) => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { lineCap: 'round' },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    plotOptions: {
      radialBar: {
        hollow: { size: '50%', padding: '100px' },
        track: {
          background: theme.palette.customColors.trackBg
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 5,
            fontWeight: 600,
            fontSize: '13px',
            color: theme.palette.text.primary
          }
        }
      }
    },
    grid: {
      padding: {
        bottom: 0
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    }
  }

  return (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent>
        <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'center' }}>
          {title}
        </Typography>
        <div
          style={{
            display: 'flex',
            paddingLeft: '10px',
            paddingRight: '10px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Icon icon={icon} fontSize={60} color={color} />
          {/* <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'center', marginRight: '1.2rem' }}>
            {number}
          </Typography> */}
          <ReactApexcharts type='radialBar' height={83} series={value} options={options} />
          <CustomAvatar
            skin='light'
            color='secondary'
            variant='rounded'
            sx={{
              mr: 1.5,
              width: 40,
              height: 30,
              fontSize: '1rem',
              borderRadius: '6px',
              color: 'text.primary'
            }}
          >
            {number ?? 0}
          </CustomAvatar>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatisticsRadialBarChart
