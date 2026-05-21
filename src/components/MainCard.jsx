import PropTypes from 'prop-types'
import React from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Card, CardContent, CardHeader, Divider, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/navigation'

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = React.forwardRef(
  (
    {
      headerColor,
      color,
      marginContent = '2rem',
      circle = false,
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      backButton,
      goBackLink,
      ...others
    },
    ref
  ) => {
    const theme = useTheme()
    const router = useRouter()

    return (
      <Card
        ref={ref}
        {...others}
        sx={{ ...sx }}
        style={{
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* card header */}
        {!darkTitle && title && (
          <CardHeader
            sx={{
              ...headerSX,
              background: headerColor
                ? `linear-gradient(135deg, ${theme.palette.primary.dark || '#1e3a8a'} 0%, ${theme.palette.primary.main} 100%)`
                : 'transparent',
              marginBottom: headerColor ? marginContent : 0,
              padding: headerColor ? '14px 20px' : '12px 16px',
            }}
            title={
              <div style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                color: headerColor ? 'white' : theme.palette.text.primary,
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.2px'
              }}>
                {backButton && (
                  <IconButton
                    size='small'
                    onClick={() => goBackLink ? router.push(goBackLink) : router.push(-1)}
                    style={{ padding: 4, color: headerColor ? 'rgba(255,255,255,0.8)' : 'inherit' }}
                  >
                    <IconifyIcon icon='mingcute:left-line' />
                  </IconButton>
                )}
                <div style={{ marginLeft: backButton ? 4 : 8 }}>{title}</div>
              </div>
            }
            action={secondary}
          />
        )}

        {darkTitle && title && (
          <CardHeader
            style={{ backgroundColor: headerColor && color }}
            sx={headerSX}
            title={<Typography variant='h3'>{title}</Typography>}
            action={secondary}
          />
        )}

        {/* divider when no header color */}
        {title && !headerColor && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
}

export default MainCard
