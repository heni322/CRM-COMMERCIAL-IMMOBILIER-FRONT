import React from 'react'
import { useRouter } from 'next/router'
import FodlerUpdate from 'src/views/folder/edit'

export default function Update() {
  const router = useRouter()

  return <FodlerUpdate folderId={router?.query?.id} />
}
