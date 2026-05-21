import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Icon from 'src/@core/components/icon'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const DossierStatCard = ({ title, icon, color, number, percentage }) => {
  const theme = useTheme()

  const safePercentage = isNaN(percentage) || !isFinite(percentage) ? 0 : Math.round(percentage)

  const options = {
    chart: { sparkline: { enabled: true } },
    stroke: { lineCap: 'round', width: 3 },
    colors: [color],
    plotOptions: {
      radialBar: {
        hollow: { size: '58%' },
        track: { background: hexToRGBA(color, 0.15) },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontWeight: 700,
            fontSize: '12px',
            color: theme.palette.text.primary,
            formatter: val => `${Math.round(val)}%`
          }
        }
      }
    },
    grid: { padding: { bottom: -8 } },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    }
  }

  return (
    <div
      style={{
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(145deg, ${hexToRGBA(color, 0.18)} 0%, ${hexToRGBA(color, 0.06)} 100%)`
          : `linear-gradient(145deg, ${hexToRGBA(color, 0.12)} 0%, #ffffff 100%)`,
        borderRadius: '16px',
        border: `1px solid ${hexToRGBA(color, 0.25)}`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: `0 4px 24px ${hexToRGBA(color, 0.12)}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        minHeight: '160px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 32px ${hexToRGBA(color, 0.22)}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 4px 24px ${hexToRGBA(color, 0.12)}`
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: hexToRGBA(color, 0.08),
        pointerEvents: 'none'
      }} />

      {/* Top row: icon + count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '12px',
          background: hexToRGBA(color, 0.15),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon icon={icon} fontSize={22} color={color} />
        </div>

        <div style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: color,
          lineHeight: 1,
          letterSpacing: '-0.5px'
        }}>
          {number ?? 0}
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        lineHeight: 1.3
      }}>
        {title}
      </div>

      {/* Progress bar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
        <div style={{ flex: 1, height: 5, borderRadius: 99, background: hexToRGBA(color, 0.15), overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${safePercentage}%`,
            borderRadius: 99,
            background: color,
            transition: 'width 0.8s ease'
          }} />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color, minWidth: 36 }}>{safePercentage}%</span>
      </div>
    </div>
  )
}

export default DossierStatCard
