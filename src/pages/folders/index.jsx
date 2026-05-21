import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAuth } from 'src/hooks/useAuth'
import DossierList from 'src/views/folder/List'

const Collaborator = () => {
  const auth = useAuth()
  const [showTodayDossiers, setShowTodayDossiers] = useState(false)
  const [showMyFolders, setShowMyFolders] = useState(false)

  return (
    <MainCard
      title='Liste Des Dossiers'
      headerColor='primary.main'
      content={false}
      secondary={
        <div className='flex gap-2'>
          {auth?.user?.role === 'engineer' && (
            <div
              className={`px-4 py-2 rounded-xl cursor-pointer border-white transition duration-300
        bg-primary text-white border-[1px] hover:bg-blue-800 shadow-md
      `}
              onClick={() => setShowMyFolders(prev => !prev)}
            >
              {!showMyFolders ? `Mes Dossiers` : 'Tous les Dossiers'}
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-xl cursor-pointer border-white transition duration-300
        bg-primary text-white border-[1px] hover:bg-slate-700 shadow-md
      `}
            onClick={() => setShowTodayDossiers(prev => !prev)}
          >
            {!showTodayDossiers ? `Dossiers d'aujourd'hui` : 'Tous les Dossiers'}
          </div>
        </div>
      }
    >
      <DossierList
        filter={true}
        selection={true}
        addNewButton={true}
        generateButton={true}
        showTodayDossiers={showTodayDossiers}
        showMyFolders={showMyFolders}
      />
    </MainCard>
  )
}

export default Collaborator
