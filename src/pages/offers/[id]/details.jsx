import React, { useState } from 'react'
import { useRouter } from 'next/router'
import DetailsView from 'src/views/offers/details'
import MainCard from 'src/components/MainCard'
import { LoadingButton } from '@mui/lab'
import Icon from 'src/@core/components/icon'
import { Button } from '@mui/material'
import ChooseTypeDialog from 'src/views/offers/forms/dialogs/ChooseTypeDialog'
import { useChangeNature, useChangeState, useGetOfferById } from 'src/services/offers.service'

export default function Details() {
  const router = useRouter()
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [currentNature, setCurrentNature] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const offerQuery = useGetOfferById({ offerId: router?.query?.id, type: 1 })
  const offerData = offerQuery?.data

  const changeNatureMutation = useChangeNature()
  const changeStateMutation = useChangeState()

  const saveNature = async () => {
    try {
      setIsLoading(true)
      changeNatureMutation.mutateAsync({ nature: currentNature, id: router?.query?.id })
      setIsLoading(false)
      router.push('/offers')
    } catch (error) {
      console.error('error', error)
      setIsLoading(false)
    }
  }

  const changeState = async state => {
    try {
      setIsLoading(true)
      await changeStateMutation.mutateAsync({ state: state, id: router?.query?.id })
      setIsLoading(false)
    } catch (error) {
      console.error('error', error)
      setIsLoading(false)
    }
  }

  return (
    <MainCard
      title='Détail Document'
      headerColor='primary.main'
      secondary={
        <>
          {!changeStateMutation?.isLoading || !changeNatureMutation?.isLoading ? (
            <div className='flex flex-row gap-1'>
              {offerData?.information?.state === 7 && (
                <button
                  disabled={isLoading}
                  onClick={() => {
                    changeState(9)
                  }}
                  className={`px-4 py-2 rounded-md border-red-500 transition duration-300
        bg-primary text-white border-[1px] hover:bg-slate-700 cursor-pointer shadow-md
      `}
                >
                  Annuler
                </button>
              )}
              {offerData?.information?.state === 7 && (
                <button
                  disabled={isLoading}
                  onClick={() => {
                    changeState(8)
                  }}
                  className={`px-4 py-2 rounded-md border-green-500 transition duration-300
        bg-primary text-white border-[1px] hover:bg-slate-700 cursor-pointer shadow-md
      `}
                >
                  Valider
                </button>
              )}
              {offerData?.information?.nature != 3 &&
                !offerData?.information?.transferred &&
                offerData?.information?.state === 8 && (
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      if (!offerData?.information?.transferred) setIsTypeDialogOpen(true)
                    }}
                    className={`px-4 py-2 rounded-md border-blue-500 transition duration-300
        bg-primary text-white border-[1px] hover:bg-slate-700 cursor-pointer shadow-md
      `}
                  >
                    Transférer
                  </button>
                )}
            </div>
          ) : (
            <div class='flex justify-center items-center my-10'>
              <div class='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900'></div>
            </div>
          )}
        </>
      }
      backButton
      goBackLink='/offers'
    >
      <DetailsView offerId={router?.query?.id} offerData={offerData} offerQuery={offerQuery} />
      <ChooseTypeDialog
        open={isTypeDialogOpen}
        currentNature={offerData?.information?.nature}
        handleClose={() => {
          setIsTypeDialogOpen(false)
        }}
        setNature={value => {
          setCurrentNature(value)
        }}
        confirm={value => {
          console.log('slm')
          saveNature()
          setIsTypeDialogOpen(false)
        }}
      />
    </MainCard>
  )
}
