// ** React Imports
import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'

// Core viewer
import { Worker, Viewer } from '@react-pdf-viewer/core'

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import { pdfjs } from 'react-pdf'
import IconifyIcon from 'src/@core/components/icon'

export default function PDFViewer({ fileURL, file, fileName }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

  // Extract the file extension from the URL
  const fileExtension = fileName?.match(/\.([^.]+)$/)?.[1]?.toLowerCase()

  // Check if the file extension is one of the document formats
  const isDocument = ['pdf'].includes(fileExtension)
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)
  console.log('fileURL', fileURL)

  return (
    <>
      {isDocument ? (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
          <div style={{ width: '100%' }}>
            <Viewer withCredentials={true} fileUrl={fileURL} />
          </div>
        </Worker>
      ) : isImage ? (
        <img src={fileURL} alt='Image' />
      ) : (
        <div className='flex flex-col gap-6 text-center justify-center my-14 text-xl'>
          <IconifyIcon
            className='w-[400px] h-40 self-center text-gray-600 max-w-[400px] max-h-40 min-w-[400px] min-h-40 '
            icon='mdi:file-document-error-outline'
          />
          Fichier non supporté
        </div>
      )}
    </>
  )
}
