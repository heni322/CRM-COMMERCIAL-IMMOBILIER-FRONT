import React from 'react'
import { useRouter } from 'next/router'
import UpdateForm from 'src/views/offers/forms/UpdateForm'
import MainCard from 'src/components/MainCard'

export default function Update() {
  const router = useRouter()

  return (
    <MainCard title='Modifier document' headerColor='primary.main' backButton goBackLink='/offers'>
      <UpdateForm offerId={router?.query?.id} />
    </MainCard>
  )
}
