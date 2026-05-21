import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetDossier = ({
  page = 1,
  paginated = false,
  search = '',
  pageSize,
  state = '',
  clientId = false,
  userId = false,
  filterState = false,
  isBilled = false,
  today = false,
  myFolders = false,
  operation,
  type = false
}) => {
  try {
    return useQuery(
      [
        'folders',
        type,
        userId,
        page,
        paginated,
        search,
        pageSize,
        state,
        clientId,
        isBilled,
        today,
        myFolders,
        operation
      ],
      () =>
        axiosClient
          .get(
            `bba/folders?page=${page}&search=${search}&${
              paginated ? `paginated=${paginated}&page_size=${pageSize}&` : ''
            }${userId ? `user=${userId}&` : ''}${clientId ? `client=${clientId}&` : ''}${
              isBilled !== false ? `billed=${isBilled}&` : ''
            }${state ? `state=${state}&` : ''}${today ? `today=${today}&` : ''}${
              myFolders ? `my_folders=${myFolders}&` : ''
            }${operation ? `operation=${operation}&` : ''}${type ? `type=${type}&` : ''}`
          )
          .then(res => res.data),
      {}
    )
  } catch (err) {

  }
}

export const useGetStatusState = () => {
  return useQuery(
    ['folder', idFolder, searchedData],
    () => axiosClient.get(`bba/folders/${idFolder}/${searchedData}`).then(res => res.data),
    {}
  )
}

export const useGetTodayDossiers = () => {
  return useQuery(
    ['folders-today'],
    () =>
      axiosClient.get(`bba/folders?today=true`).then(res => {
        // /* removed */

        return res
      }),
    {}
  )
}

export const useGetAvailableIng = ({ start_date = '', group = false }) => {

  return useQuery(
    [['groupe', 'engineer'], group], // Include startDate in the query key to trigger a refetch when it changes
    () => axiosClient.get(`bba/folders/availaible-engineer?${group ? `group_id=${group}` : ''}`).then(res => res.data),
    {}
  )
}

export const useGetDateFinPrevu = clientId => {
  return useQuery(
    ['folder', clientId], // Include startDate in the query key to trigger a refetch when it changes
    () => axiosClient.get(`bba/users/${clientId}/expected-date`).then(res => res.data),
    {}
  )
}

export const useGetClientArticles = clientId => {
  return useQuery(
    ['folder-articles', clientId], // Include startDate in the query key to trigger a refetch when it changes
    () => axiosClient.get(`bba/folders/${clientId}/client-folders-auditer`).then(res => res.data),
    {}
  )
}

export function useCreateDossier() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/folders`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)

        // queryClient.invalidateQueries()

        return data
      },
      onError: data => {
        toast.error(data?.message)
      }
    }
  )
}

export function useUploadFiles() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values, file_comment, response, folderId }) => {
      if (folderId) {
        const res = await axiosClient.post(
          `bba/folders/${folderId}/upload-files${file_comment ? '?file_comment=' + file_comment : ''}`,
          values
        )

        return res.data
      } else {
        const res = await axiosClient.post(`bba/folders/${response?.data?.id}/upload-files`, values)

        return res.data
      }
    },
    {
      onSuccess: data => {
        // toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export function useUploadReport() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values, response, folderId }) => {
      if (folderId) {

        const res = await axiosClient.post(`bba/folders/${folderId}/file/rapport`, values)

        return res.data
      } else {
        const res = await axiosClient.post(`bba/folders/${response?.data?.id}/file/rapport`, values)

        return res.data
      }
    },
    {
      onSuccess: data => {
        // toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export function useUploadReportVersion(reportIdSuccess) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values, response, reportId }) => {
      if (reportId) {

        const res = await axiosClient.post(`bba/files/${reportId}/version`, values)

        return res.data
      }

      // else {
      //   const res = await axiosClient.post(`bba/folders/${response?.data?.id}/file/rapport`, values)

      //   return res.data
      // }
    },
    {
      onSuccess: data => {
        // toast.success(data?.message)
        queryClient.invalidateQueries(['report-files', reportIdSuccess])
      }
    }
  )
}

export function useAddfiles() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/folders`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export function useUpdateDossier() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values, folderId }) => {
      const res = await axiosClient.put(`bba/folders/${folderId}`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export function useDeleteDossier() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/folders/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.response?.data?.message)
      }
    }
  )
}

export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/files/${id}`)

      return res
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.response?.data?.message)
      }
    }
  )
}

export function useAssignEngineer() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, values }) => {
      const res = await axiosClient.post(`bba/folders/${id}/assign-engineer`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export function useGetFile(fileId) {
  // if (!fileId) {
  //   // Return an empty query result since fileId is null
  //   return {
  //     data: undefined,
  //     isLoading: false,
  //     isError: false,
  //     error: null,
  //     refetch: () => {} // Empty refetch function
  //   }
  // }

  return useQuery(['file', fileId], async () => {
    const response = await axiosClient.get(`bba/files/${fileId}`)

    return response.data
  })
}

export function useGetFolderFiles(folderId) {
  return useQuery(['folder-files', folderId], async () => {
    const response = await axiosClient.get(`bba/folders/${folderId}/files`)

    return response.data
  })
}

export function useGetReportHistory(reportId) {
  return useQuery(['report-files', reportId], async () => {
    const response = await axiosClient.get(`bba/files/${reportId}/version`)

    return response.data
  })
}

export const useGetFilesCommentsAsObject = ({ fileId = 0, paginated = false, order = 'desc', cursor = '' }) => {
  try {
    return useQuery(
      ['file-comments', fileId, paginated, order, cursor],
      () =>
        axiosClient
          .get(
            `bba/files/${fileId}/comments?order=${order}&${paginated ? `paginated=${paginated}&` : ''}&${
              cursor ? `cursor=${cursor}&` : ''
            }`
          )
          .then(res => res.data),
      {}
    )
  } catch (err) {
    // /* removed */
  }
}

export const useGetFolderCommentsAsObject = ({ folderId = 0, paginated = false, order = 'desc', cursor = '' }) => {
  try {
    return useQuery(
      ['folder-comments', folderId, paginated, order, cursor],
      () =>
        axiosClient
          .get(
            `bba/folders/${folderId}/comments?order=${order}&${paginated ? `paginated=${paginated}&` : ''}&${
              cursor ? `cursor=${cursor}&` : ''
            }`
          )
          .then(res => res.data),
      {}
    )
  } catch (err) {
    // /* removed */
  }
}

export function useGetFileStates() {
  return useQuery(
    [],
    () => {
      return axiosClient.get(`bba/files/states`).then(res => res.data)
    },
    {}
  )
}

export function useGetFilePreview(fileId) {
  return useQuery(
    ['file-preview', fileId],
    () => {
      return axiosClient.get(`bba/files/${fileId}/file`).then(res => res.data)
    },
    {}
  )
}

// export function useGetDownloadFolderFiles(folderId) {
//   return useQuery(
//     ['folder-files-download', folderId],
//     () => {
//       return axiosClient.post(`bba/folders/${fileId}/folder-files`).then(res => res.data)
//     },
//     {}
//   )
// }

export function useGetDownloadFolderFiles(folderId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ folderId }) => {
      return axiosClient
        .get(`bba/folders/${folderId}/folder-files`, {
          responseType: 'arraybuffer'
        })
        .then(res => res.data)
    },
    {
      onSuccess: data => {
        // queryClient.invalidateQueries(['file-comments', idComm])
        // queryClient.invalidateQueries(['file', idComm])
      },
      onError: error => {
        // /* removed */
      }
    }
  )
}

export function useGetYearStats() {
  return useQuery(
    ['folder-stats'],
    () => {
      return axiosClient.get(`bba/dashboard/charts-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetFolderGraph() {
  return useQuery(
    ['folder-graph'],
    () => {
      return axiosClient.get(`bba/dashboard/graph-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetAffaireGraph() {
  return useQuery(
    ['accountant-graph'],
    () => {
      return axiosClient.get(`bba/dashboard/graph-accountant`).then(res => res.data)
    },
    {}
  )
}

export function useGetInvoiceNumbers() {
  return useQuery(
    ['invoice-stats'],
    () => {
      return axiosClient.get(`bba/dashboard/charts-accountant`).then(res => res.data)
    },
    {}
  )
}

export function useGetNewFolders() {
  return useQuery(
    ['new-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/new-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetFoldersInProgress() {
  return useQuery(
    ['inprogress-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/inprogress-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetFoldersWaiting() {
  return useQuery(
    ['waiting-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/waiting-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetClosedFolders() {
  return useQuery(
    ['closed-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/closed-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetIncompletFolders() {
  return useQuery(
    ['incomplete-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/incomplet-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetEditFolders() {
  return useQuery(
    ['edit-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/edit-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetSoonExpiredFolders() {
  return useQuery(
    ['soon-expired-folders'],
    () => {
      return axiosClient.get(`bba/dashboard/soon-expired-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetExpiredFolders() {
  return useQuery(
    ['expired-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/expired-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetVerifiedFolders() {
  return useQuery(
    ['verified-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/verified-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetAuditFolders() {
  return useQuery(
    ['audit-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/audit-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetSyntheseFolders() {
  return useQuery(
    ['synthese-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/synthese-folders`).then(res => res.data)
    },
    {}
  )
}

export function useGetPreInvoice() {
  return useQuery(
    ['preinvoice-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/preinvoice`).then(res => res.data)
    },
    {}
  )
}

export function useGetInvoice() {
  return useQuery(
    ['invoice-folder'],
    () => {
      return axiosClient.get(`bba/dashboard/invoice`).then(res => res.data)
    },
    {}
  )
}

export function useGetRapports(folderId) {
  return useQuery(
    ['folder-rapports'],
    () => {
      return axiosClient.get(`bba/folders/${folderId}/rapports`).then(res => res.data)
    },
    {}
  )
}

export function useChangeState() {
  const queryClient = useQueryClient()
  var folderId = 0

  return useMutation(
    async ({ id, state, form }) => {
      const res = await axiosClient.put(`bba/folders/${id}/state/${state}`, form)
      folderId = id

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)

        queryClient.invalidateQueries()

        // queryClient.invalidateQueries(['folders-by-id', folderId + ''])
      },
      onError: data => {
        toast.error(data?.response?.data?.message)
      }
    }
  )
}

export function useValidateReport() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.put(`bba/folders/${id}/version/validate`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        // /* removed */
        // toast.error(data?.message)
      }
    }
  )
}

export function useReadFolderComments() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.put(`bba/folder-comments/${id}/read`)

      return res.data
    },
    {
      onSuccess: data => {
        // toast.success(data?.message)

        queryClient.invalidateQueries(['folders-by-id', data?.id + ''])
      },
      onError: data => {

      }
    }
  )
}

export function useReadFolderReport() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.put(`bba/folder-comments/${id}/read`)

      return res.data
    },
    {
      onSuccess: data => {
        // toast.success(data?.message)

        queryClient.invalidateQueries(['folders-by-id', data?.id + ''])
      },
      onError: data => {

      }
    }
  )
}

export function useReadFileComments(folderId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.put(`bba/files-comments/${id}/read`)

      return res.data
    },
    {
      onSuccess: data => {
        // toast.success(data?.id)
        queryClient.invalidateQueries(['file-comments', data?.id])
        queryClient.invalidateQueries(['folder-comments', folderId])
        queryClient.invalidateQueries(['file', data?.id])
      },
      onError: data => {

      }
    }
  )
}

export function useChangeStateFile() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.put(`bba/files/${id}/change-state`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {

      }
    }
  )
}

export function useCreateDossierComment(folderId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values }) => {
      const res = await axiosClient.post(`bba/folder-comments`, values)

      return res.data
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['folder-comments', folderId])
      },
      onError: error => {}
    }
  )
}

export function useCreateFileComment(idComm) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values }) => {
      const res = await axiosClient.post(`bba/files-comments`, values)

      return res.data
    },
    {
      onSuccess: data => {

        // queryClient.invalidateQueries(['file-comments', {idComm}])
        // queryClient.invalidateQueries(['file-comments', { fileId: idComm }])
        queryClient.invalidateQueries(['file-comments', 10, true, 'desc', ''])
        queryClient.invalidateQueries(['file', idComm])
      },
      onError: error => {
        // /* removed */
      }
    }
  )
}

export const useGetSelectedDossier = (idFolder = '') => {
  return useQuery(['folder', idFolder], () => {
    axiosClient.get(`bba/folders/${idFolder}`).then(res => res.data), {}
  })
}

export const useGetDossierStatus = (folderId = '') => {
  try {
    return useQuery(
      ['folders', folderId],
      () => axiosClient.get(`bba/folders/${folderId}/status`).then(res => res.data),
      {}
    )
  } catch (err) {
    toast.error(err)
  }
}

export const useGetDossierById = folderId => {
  return useQuery(
    ['folders-by-id', folderId],
    () => axiosClient.get(`bba/folders/${folderId}`).then(res => res.data),
    {}
  )
}

export const useGetClientsDossier = (clientId = '') => {
  return useQuery(
    ['folders', clientId],
    () => axiosClient.get(`bba/folders/${clientId}/client-folders`).then(res => res.data),
    {}
  )
}

export const useChangeDossierSold = folderId => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values, folderId }) => {
      const res = await axiosClient.put(`bba/folders/${folderId}/sold-out`, values)

      return res.data
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['folders-by-id', folderId + ''])
      },
      onError: error => {}
    }
  )
}
