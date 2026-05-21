import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const SERIES_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

const StatsChart = ({ data }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const seriesData = Array.isArray(data) ? data : []

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    tooltip: { shared: true, theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: false },
    stroke: { show: true, curve: 'smooth', width: 2.5 },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.secondary },
      markers: { offsetY: 1, offsetX: -3 },
      itemMargin: { vertical: 3, horizontal: 10 }
    },
    colors: SERIES_COLORS,
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 95]
      }
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
      padding: { top: 0, bottom: -8 }
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.disabled }, formatter: v => Math.round(v) }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: { stroke: { color: theme.palette.divider } },
      labels: { style: { colors: theme.palette.text.disabled }, rotate: -30 },
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    }
  }

  return (
    <Card sx={{ borderRadius: 4, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.07)', height: '100%' }}>
      <CardContent sx={{ p: '24px !important' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: 'text.primary' }}>
            Chiffres d'affaires annuels
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mt: 0.3 }}>
            Évolution mensuelle des ventes par réseau commercial
          </Typography>
        </Box>

        {seriesData.length > 0 ? (
          <ReactApexcharts type='area' height={300} options={options} series={seriesData} />
        ) : (
          <Box sx={{
            height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 1
          }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22 }}>📊</span>
            </Box>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.82rem' }}>Aucune donnée disponible</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StatsChart
