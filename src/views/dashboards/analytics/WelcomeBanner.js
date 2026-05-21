import { useTheme } from '@mui/material/styles'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Icon from 'src/@core/components/icon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from 'src/hooks/useAuth'
import { useGetNewFolders } from 'src/services/dossier.service'
import { useState, useEffect } from 'react'

const WelcomeBanner = ({ name }) => {
  const theme = useTheme()
  const auth = useAuth()
  const userRole = auth?.user?.role

  const getNewFolderQuery = useGetNewFolders()
  const [result, setResult] = useState()

  useEffect(() => {
    if (getNewFolderQuery?.isSuccess && getNewFolderQuery?.data) {
      setResult(getNewFolderQuery?.data)
    }
  }, [getNewFolderQuery?.isSuccess])

  const hours = new Date().getHours()
  const greeting = hours < 12 ? 'Bonjour' : hours < 18 ? 'Bon après-midi' : 'Bonsoir'
  const emoji = hours < 12 ? '🌅' : hours < 18 ? '☀️' : '🌙'

  const primaryColor = theme.palette.primary.main
  const isDark = theme.palette.mode === 'dark'

  return (
    <div style={{
      borderRadius: '20px',
      padding: '32px 36px',
      position: 'relative',
      overflow: 'hidden',
      background: isDark
        ? `linear-gradient(135deg, #1a2744 0%, #0d1b33 50%, #162035 100%)`
        : `linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #1d4ed8 100%)`,
      boxShadow: '0 20px 60px rgba(30, 58, 138, 0.35)',
      minHeight: '190px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -30, right: 100,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: 20, right: 180,
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
      }} />

      {/* Building illustration (CSS art) */}
      <div style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 220,
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '0 20px',
        opacity: 0.18
      }}>
        <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="40" width="50" height="110" fill="white" rx="2"/>
          <rect x="30" y="50" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="48" y="50" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="30" y="72" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="48" y="72" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="30" y="94" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="48" y="94" width="12" height="15" fill="#93c5fd" rx="1"/>
          <rect x="36" y="120" width="18" height="30" fill="#bfdbfe" rx="1"/>

          <rect x="80" y="10" width="70" height="140" fill="white" rx="2"/>
          <rect x="88" y="20" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="108" y="20" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="128" y="20" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="88" y="46" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="108" y="46" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="128" y="46" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="88" y="72" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="108" y="72" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="128" y="72" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="88" y="98" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="108" y="98" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="128" y="98" width="14" height="18" fill="#93c5fd" rx="1"/>
          <rect x="102" y="124" width="26" height="26" fill="#bfdbfe" rx="1"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {greeting}
          </span>
        </div>
        <Typography variant='h5' style={{ color: '#ffffff', fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          {name || 'Utilisateur'} 👋
        </Typography>
        <Typography variant='body2' style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 20, maxWidth: 320, lineHeight: 1.6 }}>
          {userRole === 'accountant'
            ? `Vous avez des dossiers en attente de facturation.`
            : userRole === 'client'
            ? `Bienvenue dans votre espace client. Suivez vos dossiers en temps réel.`
            : `Gérez vos dossiers immobiliers et suivez les performances de votre équipe.`
          }
        </Typography>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant='contained'
            href='/folders'
            size='small'
            style={{
              background: 'rgba(255,255,255,0.95)',
              color: '#1e3a8a',
              fontWeight: 700,
              borderRadius: 10,
              textTransform: 'none',
              padding: '8px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Icon icon='mdi:folder-multiple-outline' style={{ marginRight: 6, fontSize: 16 }} />
            Mes Dossiers
          </Button>
          <Button
            variant='outlined'
            href='/properties'
            size='small'
            style={{
              borderColor: 'rgba(255,255,255,0.4)',
              color: 'white',
              fontWeight: 600,
              borderRadius: 10,
              textTransform: 'none',
              padding: '8px 20px',
            }}
          >
            <Icon icon='mdi:home-city-outline' style={{ marginRight: 6, fontSize: 16 }} />
            Biens
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
