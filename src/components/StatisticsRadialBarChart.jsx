import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const COLORS = ['#eab308', '#6366f1', '#10b981']
const COLOR_NAMES = ['Offre de prix', 'Lettre de résa.', 'Promesse']

const ApexRadialBarChart = ({ data }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const series = data?.values ?? [0, 0, 0]
  const names = data?.names ?? COLOR_NAMES

  const options = {
    chart: { sparkline: { enabled: false }, toolbar: { show: false } },
    stroke: { lineCap: 'round', width: 3 },
    colors: COLORS,
    labels: names,
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: '28%' },
        track: {
          margin: 14,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
        },
        dataLabels: {
          name: { fontSize: '0.78rem', color: theme.palette.text.secondary },
          value: {
            fontSize: '1.1rem',
            fontWeight: 700,
            color: theme.palette.text.primary,
            offsetY: 4
          },
          total: {
            show: true,
            fontWeight: 700,
            label: 'Affaires',
            fontSize: '0.85rem',
            color: theme.palette.text.primary,
            formatter: w => {
              const avg = w.globals.seriesTotals.reduce((a, b) => a + b, 0) / w.globals.series.length
              
return (avg % 1 === 0 ? avg : avg.toFixed(1)) + '%'
            }
          }
        }
      }
    },
    grid: { padding: { top: -20, bottom: -20 } }
  }

  return (
    <Card sx={{ borderRadius: 4, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.07)', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: 'text.primary' }}>
            Suivi des Affaires
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mt: 0.3 }}>
            Taux de validation par type de document
          </Typography>
        </Box>

        <ReactApexcharts type='radialBar' height={340} options={options} series={series} />

        {/* Custom legend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
          {names.map((name, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 10, height: 10, borderRadius: '50%',
                background: COLORS[i] ?? '#ccc', flexShrink: 0
              }} />
              <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', flex: 1 }}>{name}</Typography>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: COLORS[i] ?? 'text.primary' }}>
                {series[i] ?? 0}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ApexRadialBarChart
