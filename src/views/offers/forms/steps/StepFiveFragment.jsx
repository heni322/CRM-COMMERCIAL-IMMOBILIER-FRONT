import React, { useRef } from 'react'
import { useState } from 'react'
import { useGetOffrePDF } from 'src/services/offers.service'

const ContentEditableWithRef = props => {
  const defaultValue = useRef(props.value)

  const handleInput = event => {
    if (props.onChange) {
      props.onChange(event)
    }
  }

  return (
    <div
      contentEditable={props?.disabled}
      style={props?.style}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  )
}

const StepFiveFragment = ({ offer, isSuccess, isFetching }) => {
  const getOfferPDFQuery = useGetOffrePDF(offer?.id)

  return (
    <>
      {isSuccess && !isFetching ? (
        <div className='mt-11 pl-5 h-[800px]'>
          <iframe
            title='PDF Viewer'
            src={`${process.env.NEXT_PUBLIC_API_URL}/documents/${offer?.id}/pdf`}
            width='100%'
            height='800px'
          ></iframe>
        </div>
      ) : (
        <div class='flex justify-center items-center mt-10'>
          <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </>
  )
}

export default StepFiveFragment
