import React from 'react'
import { useRouter } from 'next/router'
import PropertyUpdate from 'src/views/properties/edit'

export default function Update() {
  const router = useRouter()
  const id = router?.query?.id
  console.log(id)

  return <PropertyUpdate propertyId={id} />
}
