// ** React Imports

import React, { useRef, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import { useGetAffaireGraph, useGetFolderGraph } from 'src/services/dossier.service'
import { useAuth } from 'src/hooks/useAuth'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const StatisticsPieChart = ({ data }) => {
  const [stats, setStats] = useState([])

  const auth = useAuth()
  const userRole = auth?.user?.role

  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#40CDFA',
    series5: '#ffa1a1'
  }
  const [isDataEmpty, setIsDataEmpty] = useState(true)
  const theme = useTheme()
  console.log(data)

  const options = {
    stroke: { width: 0 },
    labels: data?.names,
    colors: [donutColors.series1, donutColors.series5, donutColors.series4, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: val => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: 'Status des biens',
              formatter: () => '',
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
  const RADIAN = Math.PI / 180

  return (
    <>
      {data?.values ? (
        <Card>
          <CardHeader
            title={userRole === 'accountant' ? 'Solde Client' : 'Repartition des biens par type'}
            subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
          />
          <CardContent>
            <ReactApexcharts type='donut' height={400} options={options} series={data?.values ?? [(0, 0, 0)]} />
          </CardContent>
        </Card>
      ) : (
        <div>Pas de données</div>
      )}
    </>
  )
}

export default StatisticsPieChart
