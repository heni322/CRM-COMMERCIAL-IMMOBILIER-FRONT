import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Services
import { useGetDossier } from 'src/services/dossier.service'
import { useGetUsersById } from 'src/services/users.service'

// ** Custom Dashboard Components
import WelcomeBanner from 'src/views/dashboards/analytics/WelcomeBanner'
import DossierStatCard from 'src/views/dashboards/analytics/DossierStatCard'
import DossierDonutChart from 'src/views/dashboards/analytics/DossierDonutChart'
import MainCard from 'src/components/MainCard'
import DossierList from 'src/views/folder/List'
import Icon from 'src/@core/components/icon'

const AnalyticsDashboard = () => {
  const getClientId = localStorage.getItem('userData')
  const clientData = JSON.parse(getClientId)
  const clientId = clientData?.id

  const getUserStats = useGetUsersById({ stats: true, userId: clientId })
  const folderStats = getUserStats?.data?.folderStats

  const [showTodayDossiers, setShowTodayDossiers] = useState(false)

  // Dossier queries by state
  const getDossierNouv       = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '1' })
  const getDossierEnCour     = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '3' })
  const getDossierCloturer   = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '7' })
  const getDossierEnAttante  = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '2' })
  const getDossierInComplet  = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '4' })
  const getDossierAVerifier  = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '5' })
  const getDossierAModifier  = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '6' })
  const getDossierSyntheseB  = useGetDossier({ paginated: true, page: 1, pageSize: 10, filterState: true, state: '8' })
  const getTotalDossier      = useGetDossier({ paginated: true, page: 1, pageSize: 10 })

  const total = getTotalDossier?.data?.total || 0

  const countEnCour    = (getDossierEnCour?.data?.total || 0) + (getDossierAVerifier?.data?.total || 0) + (getDossierAModifier?.data?.total || 0)
  const countCloture   = (getDossierCloturer?.data?.total || 0) + (getDossierSyntheseB?.data?.total || 0)
  const countEnAttente = getDossierEnAttante?.data?.total || 0
  const countIncomplet = getDossierInComplet?.data?.total || 0
  const countNouv      = getDossierNouv?.data?.total || 0

  const pct = (n) => total > 0 ? Math.round((n * 100) / total) : 0

  return (
    <ApexChartWrapper>
      <Grid container spacing={5}>

        {/* ── Welcome Banner ── */}
        <Grid item xs={12} md={7}>
          <WelcomeBanner name={clientData?.name} />
        </Grid>

        {/* ── Quick summary panel ── */}
        <Grid item xs={12} md={5}>
          <DossierDonutChart
            total={total}
            countEnCour={countEnCour}
            countCloture={countCloture}
            countEnAttente={countEnAttente}
            countIncomplet={countIncomplet}
            countNouv={countNouv}
          />
        </Grid>

        {/* ── KPI Stat Cards ── */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={6} sm={4} md={2.4}>
              <DossierStatCard
                title="Nouveaux"
                icon="mdi:folder-plus-outline"
                color="#6366f1"
                number={countNouv}
                percentage={pct(countNouv)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <DossierStatCard
                title="En Cours"
                icon="mdi:folder-clock-outline"
                color="#f59e0b"
                number={countEnCour}
                percentage={pct(countEnCour)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <DossierStatCard
                title="Clôturés"
                icon="mdi:folder-lock-outline"
                color="#10b981"
                number={countCloture}
                percentage={pct(countCloture)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <DossierStatCard
                title="En Attente"
                icon="mdi:folder-play-outline"
                color="#f97316"
                number={countEnAttente}
                percentage={pct(countEnAttente)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <DossierStatCard
                title="Incomplets"
                icon="mdi:folder-question-outline"
                color="#ef4444"
                number={countIncomplet}
                percentage={pct(countIncomplet)}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ── Dossier Table ── */}
        <Grid item xs={12}>
          <MainCard
            title="Liste des Dossiers"
            headerColor="primary.main"
            secondary={
              <button
                onClick={() => setShowTodayDossiers(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  borderRadius: 10,
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  background: showTodayDossiers ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.3px'
                }}
              >
                <span style={{ fontSize: 16 }}>{showTodayDossiers ? '📋' : '📅'}</span>
                {showTodayDossiers ? "Tous les Dossiers" : "Dossiers d'aujourd'hui"}
              </button>
            }
          >
            <DossierList
              showTodayDossiers={showTodayDossiers}
              columnProfile="dashboard"
              clientId={false}
              filter={true}
              selection={false}
              addNewButton={false}
              generateButton={false}
            />
          </MainCard>
        </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
