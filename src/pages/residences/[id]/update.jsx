import React from 'react'
import { useRouter } from 'next/router'
import ResidenceUpdate from 'src/views/residences/edit'

export default function Update() {
  const router = useRouter()

  return <ResidenceUpdate residenceId={router?.query?.id} />
}
