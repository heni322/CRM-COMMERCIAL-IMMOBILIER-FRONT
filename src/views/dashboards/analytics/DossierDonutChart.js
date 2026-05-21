import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Icon from 'src/@core/components/icon'

const COLORS = {
  nouveaux:  '#6366f1',
  enCours:   '#f59e0b',
  cloture:   '#10b981',
  enAttente: '#f97316',
  incomplet: '#ef4444',
}

const DossierDonutChart = ({ total, countEnCour, countCloture, countEnAttente, countIncomplet, countNouv }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const series = [countNouv, countEnCour, countCloture, countEnAttente, countIncomplet]
  const labels = ['Nouveaux', 'En Cours', 'Clôturés', 'En Attente', 'Incomplets']
  const colors = [COLORS.nouveaux, COLORS.enCours, COLORS.cloture, COLORS.enAttente, COLORS.incomplet]

  const options = {
    chart: { type: 'donut', sparkline: { enabled: false }, toolbar: { show: false } },
    colors,
    labels,
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 3, colors: [isDark ? '#1e1e2e' : '#ffffff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              color: theme.palette.text.secondary,
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 800,
              color: theme.palette.text.primary,
              offsetY: 6,
              formatter: val => val
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              color: theme.palette.text.secondary,
              formatter: () => total
            }
          }
        }
      }
    },
    tooltip: {
      y: { formatter: val => `${val} dossier${val !== 1 ? 's' : ''}` }
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.1 } },
      active: { filter: { type: 'none' } }
    }
  }

  const legends = [
    { label: 'Nouveaux',  count: countNouv,      color: COLORS.nouveaux,  icon: 'mdi:folder-plus-outline' },
    { label: 'En Cours',  count: countEnCour,     color: COLORS.enCours,   icon: 'mdi:folder-clock-outline' },
    { label: 'Clôturés',  count: countCloture,    color: COLORS.cloture,   icon: 'mdi:folder-lock-outline' },
    { label: 'En Attente',count: countEnAttente,  color: COLORS.enAttente, icon: 'mdi:folder-play-outline' },
    { label: 'Incomplets',count: countIncomplet,  color: COLORS.incomplet, icon: 'mdi:folder-question-outline' },
  ]

  return (
    <div style={{
      background: isDark ? theme.palette.background.paper : '#ffffff',
      borderRadius: '20px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      padding: '20px 24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minHeight: '190px'
    }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 2 }}>
        Répartition des Dossiers
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Donut */}
        <div style={{ flexShrink: 0 }}>
          <ReactApexcharts
            type='donut'
            height={160}
            width={160}
            series={series.every(v => v === 0) ? [1, 1, 1, 1, 1] : series}
            options={options}
          />
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {legends.map(leg => (
            <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: hexToRGBA(leg.color, 0.15),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon icon={leg.icon} fontSize={14} color={leg.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: theme.palette.text.secondary }}>{leg.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: leg.color }}>{leg.count}</span>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: hexToRGBA(leg.color, 0.15), marginTop: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: total > 0 ? `${Math.round((leg.count / total) * 100)}%` : '0%',
                    background: leg.color,
                    borderRadius: 99,
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DossierDonutChart
