import React from 'react'
import { useRouter } from 'next/router'
import CompanyUpdate from 'src/views/companies/forms/UpdateForm'
import MainCard from 'src/components/MainCard'

export default function Update() {
  const router = useRouter()

  return (
    <MainCard title='Modifier sociétés' headerColor='primary.main' backButton goBackLink='/companies'>
      <CompanyUpdate companyId={router?.query?.id} />{' '}
    </MainCard>
  )
}
