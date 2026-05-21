import CrudDataGrid from 'src/components/CrudDataGrid'
import { useAuth } from 'src/hooks/useAuth'
import { useGetDocuments } from 'src/services/documents.service'
import { memo, useState } from 'react'
import DocumentColum from './DocumentColum'

const DocumentList = () => {
  // **AUTH
  const auth = useAuth()

  /// **STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')

  // **LIST COLUMNS
  const documentColumn = DocumentColum({ userRole: auth?.user?.role })

  /// **DATA
  const documentsQuery = useGetDocuments({ paginated: true, page: page, pageSize: pageSize, search: search })
  const documentsData = documentsQuery?.data

  return (
    <CrudDataGrid
      query={documentsQuery}
      columns={documentColumn}
      data={documentsData}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      search={search}
      setSearch={setSearch}
      addNewLink='/documents/create'
      rousource='documents'
    />
  )
}

export default memo(DocumentList)
