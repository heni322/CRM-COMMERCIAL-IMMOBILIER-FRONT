import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useAuth } from 'src/hooks/useAuth'
import CreateForm from 'src/views/residences/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateResidence = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  return (
    <MainCard title='Ajouter une résidence' headerColor='primary.main' backButton goBackLink='/residences'>
      <CreateForm />
    </MainCard>
  )
}

export default CreateResidence
