import { useState } from 'react'
import MainCard from 'src/components/MainCard'
import { useGetBlocs, useGetBlocsByResidenceId } from 'src/services/blocs.service'
import { useGetResidences } from 'src/services/residences.service'
import { useGetLocalTypes, useGetTypes } from 'src/services/type-locals.service'
import CreateForm from 'src/views/properties/forms/CreateForm'

// import MainCard from 'src/components/MainCard'

const CreateBloc = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const [residence, setResidence] = useState()

  const blocsQuery = useGetBlocsByResidenceId({ residenceId: residence?.id })
  const blocsData = blocsQuery?.data

  const residencesQuery = useGetResidences({ paginated: false, search: search })
  const residencesData = residencesQuery?.data

  const typesQuery = useGetLocalTypes({ paginated: true, page: page, pageSize: pageSize, search: search })
  const typesData = typesQuery?.data?.data

  return (
    <MainCard title='Ajouter un Bien' headerColor='primary.main' backButton goBackLink='/properties'>
      <CreateForm
        blocsData={blocsData ? blocsData : []}
        residence={residence}
        residencesData={residencesData ? residencesData : []}
        setResidence={setResidence}
        typesData={typesData}
      />
    </MainCard>
  )
}

export default CreateBloc
