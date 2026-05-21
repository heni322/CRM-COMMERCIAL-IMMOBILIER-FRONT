import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Icon from 'src/@core/components/icon'

const EnhancedStatCard = ({ title, icon, color, number, percentage, subtitle }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const safe = v => (isNaN(v) || !isFinite(v) || v == null ? 0 : Math.round(v))
  const pct = safe(percentage)
  const count = number ?? 0

  return (
    <div
      style={{
        background: isDark ? theme.palette.background.paper : '#ffffff',
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 6px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
        height: '100%'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = isDark ? '0 6px 20px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 6px rgba(0,0,0,0.06)'
      }}
    >
      {/* Icon + badge row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: hexToRGBA(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon icon={icon} fontSize={22} color={color} />
        </div>

        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: theme.palette.text.secondary,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          borderRadius: 20,
          padding: '3px 10px',
          letterSpacing: '0.2px'
        }}>
          {pct}%
        </div>
      </div>

      {/* Count + subtitle */}
      <div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: theme.palette.text.primary,
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}>
          {count}
        </div>
        {subtitle && (
          <div style={{
            fontSize: '0.72rem',
            color: theme.palette.text.disabled,
            marginTop: 4
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.6px'
      }}>
        {title}
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4,
        borderRadius: 99,
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  )
}

export default EnhancedStatCard
