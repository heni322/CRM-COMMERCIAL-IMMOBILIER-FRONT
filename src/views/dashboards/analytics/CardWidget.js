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
import IconifyIcon from 'src/@core/components/icon'

const CardWidget = ({
  title,
  value,
  icon,
  color,
  number,
  valueEnCour,
  valueEnAttente,
  valueIncomplet,
  valueExpiredFolders,
  roundedValueEnCour,
  roundedValueEnAttente,
  roundedValueIncomplet,
  roundedValueExpiredFolders
}) => {
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
        hollow: { size: '55%' },
        track: {
          background: theme.palette.customColors.trackBg
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 5,
            fontWeight: 600,
            fontSize: '1rem',
            color: theme.palette.text.primary
          }
        }
      }
    },
    grid: {
      padding: {
        bottom: -12
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
    <Card>
      <div className='flex flex-col gap-2 p-3'>
        <div className='grid grid-cols-2 gap-2 '>
          <div className='flex flex-col border border-gray-300 p-4'>
            <div className='grid grid-cols-2 justify-items-stretch '>
              <div className='flex flex-row'>
                <div className='flex flex-row'>
                  <IconifyIcon
                    className=' text-[#F5DC50] w-[40px] h-20 mt-2 ml-2  max-w-[40px] max-h-10 min-w-[40px] min-h-10 '
                    icon='mdi:folder-clock-outline'
                  />
                </div>
                <div className='flex flex-row align-middle self-center'>Dossiers En Cours</div>
              </div>
              <div
                className=' justify-self-end'
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
                  {number}
                </CustomAvatar>
              </div>
            </div>

            <div className='flex flex-row'>
              <ReactApexcharts type='radialBar' height={80} series={value} options={options} />
            </div>
          </div>
          <div className='flex flex-col border border-gray-300 p-4'>
            <div className='grid grid-cols-2 justify-items-stretch '>
              <div className='flex flex-row'>
                <div className='flex flex-row'>
                  <IconifyIcon
                    className=' text-[#A0C527] w-[40px] h-20 mt-2 ml-2  max-w-[40px] max-h-10 min-w-[40px] min-h-10 '
                    icon='mdi:folder-lock-outline'
                  />
                </div>
                <div className='flex flex-row align-middle self-center'>Dossiers Cloturés</div>
              </div>
              <div
                className=' justify-self-end'
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
                  {number}
                </CustomAvatar>
              </div>
            </div>

            <div className='flex flex-row'>
              <ReactApexcharts type='radialBar' height={80} series={value} options={options} />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col border border-gray-300 p-4'>
            <div className='grid grid-cols-2 justify-items-stretch '>
              <div className='flex flex-row'>
                <div className='flex flex-row'>
                  <IconifyIcon
                    className=' text-[#F06937] w-[40px] h-20 mt-2 ml-2  max-w-[40px] max-h-10 min-w-[40px] min-h-10 '
                    icon='mdi:folder-play-outline'
                  />
                </div>
                <div className='flex flex-row align-middle self-center'>Dossiers En Attentes</div>
              </div>
              <div
                className=' justify-self-end'
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
                  {number}
                </CustomAvatar>
              </div>
            </div>

            <div className='flex flex-row'>
              <ReactApexcharts type='radialBar' height={80} series={value} options={options} />
            </div>
          </div>
          <div className='flex flex-col border border-gray-300 p-4'>
            <div className='grid grid-cols-2 justify-items-stretch '>
              <div className='flex flex-row'>
                <div className='flex flex-row'>
                  <IconifyIcon
                    className=' text-[#EB1E4B] w-[40px] h-20 mt-2 ml-2  max-w-[40px] max-h-10 min-w-[40px] min-h-10 '
                    icon='mdi:folder-question-outline'
                  />
                </div>
                <div className='flex flex-row align-middle self-center'>Dossiers Incomplets</div>
              </div>
              <div
                className=' justify-self-end'
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
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
                  {valueExpiredFolders}
                </CustomAvatar>
              </div>
            </div>

            <div className='flex flex-row'>
              <ReactApexcharts type='radialBar' height={80} series={roundedValueExpiredFolders} options={options} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CardWidget
