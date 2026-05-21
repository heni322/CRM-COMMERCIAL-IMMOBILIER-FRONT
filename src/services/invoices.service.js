import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetInvoices = ({
  paginated = false,
  user = false,
  search = false,
  pageSize,
  page,
  date,
  payed,
  relance,
  state,
  clientId
}) => {
  return useQuery(
    ['invoices', paginated, user, search, pageSize, page, date, payed, relance, state, clientId],
    () =>
      axiosClient
        .get(
          `bba/invoices?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${
            user ? `user=${user}&` : ''
          }${search ? `search=${search}` : ''}${date !== 'Invalid date' ? `date=${date}&` : ''}${
            payed !== false ? `payed=${payed}&` : ''
          }${relance !== false ? `relance=${relance}&` : ''}${state !== false ? `state=${state}&` : ''}${
            clientId ? `clientId=${clientId}&` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export const useGetInvoiceById = (invoiceId = '') => {
  return useQuery(['invoices', invoiceId], () => axiosClient.get(`bba/invoices/${invoiceId}`).then(res => res.data), {})
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ data, id }) => {
      const res = await axiosClient.post(`bba/users/${id}?_method=PUT`, data)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
      },
      onError: (error, data) => {
        toast.error(error?.response?.data?.message)
      }
    }
  )
}

export function useCreateInvoice(invoiceId = '') {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/invoices`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: (error, data) => {
        toast.error(error?.response?.data?.message)

        // /* removed */
      }
    }
  )
}

export function useCreateInvoiceAvoir(invoiceId) {
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      const res = await axiosClient.post(`bba/invoices/${invoiceId}/avoir`)

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

export function useUpdateInvoice(invoiceId) {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.put(`bba/invoices/${invoiceId}`, values)

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

export function useSendInvoiceEmail() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.put(`bba/invoices/send-mail`, values)

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

export function useGenerateInvoicesArchive() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/invoices/download/generate-invoices`, values, {
        responseType: 'arraybuffer'
      })

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)

        // queryClient.invalidateQueries()
      }
    }
  )
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/users/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.message)
      }
    }
  )
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/invoices/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.message)
      }
    }
  )
}

export const useGetNextRefrence = id => {
  try {
    return useQuery(
      ['invoices-next-refrences', id],
      () => axiosClient.get(`bba/invoices/${id}/next-reference`).then(res => res.data),
      {}
    )
  } catch (err) {

  }
}

export const useGetHeaderTotal = lines => {
  const queryClient = useQueryClient()
  try {
    return useQuery(
      ['total-invoice-preview', lines],
      () => axiosClient.post(`bba/invoices/preview/total-invoice`, { lines: lines }).then(res => res.data),
      {}
    )
  } catch (err) {

  }
}

export const useValidateInvoice = invoiceId => {
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      const res = await axiosClient.put(`bba/invoices/${invoiceId}/validate-invoice`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.message)
      }
    }
  )
}

export const useCancelInvoice = invoiceId => {
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      const res = await axiosClient.put(`bba/invoices/${invoiceId}/cancel-invoice`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.message)
      }
    }
  )
}
