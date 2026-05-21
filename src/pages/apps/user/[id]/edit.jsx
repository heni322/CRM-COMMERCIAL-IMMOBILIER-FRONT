import React from 'react'
import FormValidationUserEdit from './FormValidationUserEdit'
import { useRouter } from 'next/router'

export default function Edit() {
  const router = useRouter()

  return (
    <div>
      <FormValidationUserEdit id={router.query.id} />
    </div>
  )
}
