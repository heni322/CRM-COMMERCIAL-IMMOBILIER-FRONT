import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import SelectArticleDialog from 'src/views/components/article-dialog/SelectArticleDialog'
import StepperAlternativeLabel from 'src/views/forms/form-wizard/StepperAlternativeLabel'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import StepOneFragment from './steps/StepOneFragment'
import ChooseTypeDialog from './dialogs/ChooseTypeDialog'
import moment from 'moment'
import { useCreateOffer, useGetOfferById, useUpdateOffer } from 'src/services/offers.service'
import StepTwoFragment from './steps/StepTwoFragment'
import StepThreeFragment from './steps/StepThreeFragment'
import StepFourFragment from './steps/StepFourFragment'
import StepFiveFragment from './steps/StepFiveFragment'
import useStates from 'src/hooks/useStates'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'

const steps = [
  {
    title: 'Information'

    // subtitle: 'Enter your Account Details'
  },
  {
    title: 'Détails biens'

    // subtitle: 'Setup Information'
  },
  {
    title: 'Total Prix'

    // subtitle: 'Setup Information'
  },
  {
    title: 'Confirmation'

    // subtitle: 'Add Social Links'
  },
  {
    title: 'Contract'

    // subtitle: 'Add Social Links'
  }
]

const UpdateForm = ({ offerId }) => {
  const router = useRouter()

  const offerQuery = useGetOfferById({ offerId: offerId, type: 1 })
  const offerData = offerQuery?.data
  const createOfferMutation = useCreateOffer()
  const updateOfferMutation = useUpdateOffer()

  const { getPreferences } = useStates()
  const preferences = getPreferences()

  const [activeStep, setActiveStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [offer, setOffer] = useState()
  const [offerArticles, setOfferArticles] = useState([])
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(true)
  const [contratSkeletonLocalData, setContratSkeletonLocalData] = useState()

  // Ref mirrors the latest document_lines synchronously so validation never reads stale React state
  const documentLinesRef = useRef([])

  const [formInputParent, setFormInputParent] = useState({
    date_document: '',
    date_echeance: '',
    project_ids: [],
    d_client_id: 0,
    commercial_id: 0,
    nature: null,
    client_contact: '',
    comment: ''
  })

  // Initialize page state from the server ONCE. Re-running this on every refetch
  // (e.g. after the Suivant save invalidates the detail query) would reset
  // activeStep back to the saved step and overwrite the user's selected biens
  // with stale backend data - that is what made the selection disappear when
  // moving from "Details biens" to "Total Prix".
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    if (!offerQuery?.isFetching && offerQuery?.isSuccess && offerData) {
      initializedRef.current = true
      setActiveStep(offerData?.information?.step)
      setFormInputParent(offerData?.information)
      setOfferArticles(Array.isArray(offerData?.details) ? offerData.details : [])
      setOffer(offerData?.information)
      setContratSkeletonLocalData(offerData?.skeleton)

      // Seed the ref with already-saved lines so back/forward navigation keeps validation accurate
      if (Array.isArray(offerData?.details) && offerData.details.length) {
        documentLinesRef.current = offerData.details
      }
    }
  }, [offerQuery?.isFetching, offerQuery?.isSuccess, offerData])

  // The backend regenerates the contract skeleton (which embeds the selected biens)
  // on every save. The run-once init above intentionally does NOT re-run on refetch,
  // so the freshly built skeleton would never reach the Confirmation/Contract step
  // until a full page reload. This effect re-syncs ONLY the skeleton from fresh
  // server data after each refetch settles, without resetting activeStep / offer /
  // offerArticles. We skip syncing while the user is on the final Contract step
  // (activeStep === 4) so we never overwrite their in-progress text edits there.
  useEffect(() => {
    if (!initializedRef.current) return
    if (offerQuery?.isFetching || !offerQuery?.isSuccess) return
    if (activeStep === 4) return

    // Only adopt the server skeleton when it actually has content. During the brief
    // window right after a save the backend may momentarily return an empty skeleton;
    // applying it would blank out the biens list we just rebuilt.
    const serverSkeleton = offerData?.skeleton
    const hasContent = Array.isArray(serverSkeleton) ? serverSkeleton.length > 0 : Boolean(serverSkeleton)
    if (hasContent) {
      setContratSkeletonLocalData(serverSkeleton)
    }
  }, [offerQuery?.isFetching, offerQuery?.isSuccess, offerData?.skeleton, activeStep])

  const [selectedArticles, setSelectedArticles] = useState([])

  const handleSelectArticle = selected => {
    // Update the newArticles state with the unique selected articles
    setSelectedArticles(prevArticles => [...prevArticles, selected])
  }

  const handleRemoveArticle = id => {
    // Update the newArticles state with the unique selected articles
    setSelectedArticles(prevArticles => {
      return prevArticles?.filter(item => item?.id !== id)
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    switch (activeStep + 1) {
      case 1:
        {
          try {
            if (offerData && offerData?.information?.step > 0) {
              // let currentForm = formInputParent
              let values = {
                date_document: '',
                date_echeance: '',
                project_ids: [],
                d_client_id: 0,
                commercial_id: 0,
                nature: 0,
                client_contact: '',
                comment: ''
              }
              values.step = 0
              values.date_document = moment(formInputParent?.date_document).format('YYYY-MM-DD')
              values.date_echeance = moment(formInputParent?.date_echeance).format('YYYY-MM-DD')
              values.project_ids = formInputParent?.project_ids
              values.d_client_id = formInputParent?.d_client_id
              values.commercial_id = formInputParent?.commercial_id
              values.client_contact = formInputParent?.client_contact
              values.nature = formInputParent?.nature
              values.comment = formInputParent?.comment
              await updateOfferMutation?.mutateAsync({ data: values, id: offer?.id })

              // Advance explicitly; we no longer rely on the refetch effect to move steps.
              setActiveStep(activeStep + 1)
            } else {
              const created = await createOfferMutation?.mutateAsync(formInputParent)

              // Capture the newly created offer so later saves target it, then advance.
              if (created?.information) {
                setOffer(created.information)
                setFormInputParent(created.information)
              }
              setActiveStep(activeStep + 1)
            }

            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
          }
        }
        break
      case 2:
        {
          const lines = (documentLinesRef.current && documentLinesRef.current.length)
            ? documentLinesRef.current
            : formInputParent?.document_lines
          if (!Array.isArray(lines) || lines.length === 0) {
            toast.error('Aucun article a enregistrer. Veuillez verifier les details des biens.')
            setIsLoading(false)
            break
          }
          const values = { step: 1, document_lines: lines }
          try {
            await updateOfferMutation?.mutateAsync({ data: values, id: offer?.id })
            setActiveStep(activeStep + 1)
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
          }
        }
        break

      case 3:
        {
          const lines = (documentLinesRef.current && documentLinesRef.current.length)
            ? documentLinesRef.current
            : formInputParent?.document_lines
          if (!Array.isArray(lines) || lines.length === 0) {
            toast.error('Aucun article a enregistrer. Veuillez verifier les details des biens.')
            setIsLoading(false)
            break
          }
          const values = { step: 2, document_lines: lines }
          try {
            await updateOfferMutation?.mutateAsync({ data: values, id: offer?.id })
            setActiveStep(activeStep + 1)
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
          }
        }
        break
      case 4:
        {
          try {
            let values = {
              step: 3,
              skeleton: {}
            }
            values.step = 3
            values.skeleton = contratSkeletonLocalData

            // /* removed */

            const response = await updateOfferMutation?.mutateAsync({ data: values, id: offer?.id })

            // Advance explicitly to the Contract (PDF) step.
            setActiveStep(activeStep + 1)
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
          }
        }
        break
      case 5:
        {
          router.push(`/offers`)
        }
        break

      default:
        return `Une erreur s'est produide`
    }
    setIsLoading(false)
  }

  const getStepContent = step => {
    switch (step) {
      case 1:
        return (
          <StepOneFragment
            offer={offer}
            activeStep={activeStep}
            isFetching={offerQuery?.isFetching}
            isSuccess={offerQuery?.isSuccess}
            setFormInputParent={data => {
              // Keep the ref current synchronously so Next-button validation never reads stale state
              if (data && Array.isArray(data.document_lines)) {
                documentLinesRef.current = data.document_lines

                // Keep offerArticles in sync so later steps (Total Prix, Contract)
                // initialize from the biens the user just selected, not stale
                // server data that may not include the new selection yet.
                setOfferArticles(data.document_lines)
              }
              setFormInputParent(prevState => {
                const updatedFields = { ...prevState }

                if (data) {
                  // Iterate through formInput keys
                  Object?.keys(data)?.forEach(key => {
                    // Check if the key is not 'nature'
                    if (key !== 'nature') {
                      // Update the field in formInputParent
                      updatedFields[key] = data[key]
                    }
                    if (key == 'date_document') {
                      updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                    }
                    if (key == 'date_echeance') {
                      updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                    }
                    if (key == 'project_ids') {
                      updatedFields[key] = data[key]?.map(item => item)
                    }
                  })
                }

                // /* removed */

                return updatedFields
              })
            }}
          />
        )
      case 2:
        return (
          <StepTwoFragment
            activeStep={activeStep}
            offer={offer}
            isFetching={offerQuery?.isFetching}
            isSuccess={offerQuery?.isSuccess}
            offerArticles={offerArticles}
            preferences={preferences}
            setFormInputParent={data => {
              // Keep the ref current synchronously so Next-button validation never reads stale state
              if (data && Array.isArray(data.document_lines)) {
                documentLinesRef.current = data.document_lines

                // Keep offerArticles in sync so later steps (Total Prix, Contract)
                // initialize from the biens the user just selected, not stale
                // server data that may not include the new selection yet.
                setOfferArticles(data.document_lines)
              }
              setFormInputParent(prevState => {
                const updatedFields = { ...prevState }
                if (data) {
                  // Iterate through formInput keys
                  Object?.keys(data).forEach(key => {
                    // Check if the key is not 'nature'
                    if (key !== 'nature') {
                      // Update the field in formInputParent
                      updatedFields[key] = data[key]
                    }
                    if (key == 'date_document') {
                      updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                    }
                    if (key == 'project_ids') {
                      updatedFields[key] = data[key].map(item => item)
                    }
                  })
                }

                return updatedFields
              })
            }}
          />
        )
      case 3:
        return (
          <StepThreeFragment
            activeStep={activeStep}
            offer={offer}
            document={offerData}
            preferences={preferences}
            isFetching={offerQuery?.isFetching}
            isSuccess={offerQuery?.isSuccess}
            offerArticles={offerArticles}
            setFormInputParent={data => {
              // Keep the ref current synchronously so Next-button validation never reads stale state
              if (data && Array.isArray(data.document_lines)) {
                documentLinesRef.current = data.document_lines

                // Keep offerArticles in sync so later steps (Total Prix, Contract)
                // initialize from the biens the user just selected, not stale
                // server data that may not include the new selection yet.
                setOfferArticles(data.document_lines)
              }
              setFormInputParent(prevState => {
                const updatedFields = { ...prevState }
                if (data) {
                  // Iterate through formInput keys
                  Object?.keys(data).forEach(key => {
                    // Check if the key is not 'nature'
                    if (key !== 'nature') {
                      // Update the field in formInputParent
                      updatedFields[key] = data[key]
                    }
                    if (key == 'date_document') {
                      updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                    }
                    if (key == 'project_ids') {
                      updatedFields[key] = data[key].map(item => item)
                    }
                  })
                }

                return updatedFields
              })
            }}
          />
        )
      case 4:
        return (
          <StepFourFragment
            activeStep={activeStep}
            offer={offer}
            isFetching={offerQuery?.isFetching}
            isSuccess={offerQuery?.isSuccess}
            setContratSkeletonLocalData={setContratSkeletonLocalData}
            contratSkeletonLocalData={contratSkeletonLocalData}
            setFormInputParent={data => {
              // Keep the ref current synchronously so Next-button validation never reads stale state
              if (data && Array.isArray(data.document_lines)) {
                documentLinesRef.current = data.document_lines

                // Keep offerArticles in sync so later steps (Total Prix, Contract)
                // initialize from the biens the user just selected, not stale
                // server data that may not include the new selection yet.
                setOfferArticles(data.document_lines)
              }
              setFormInputParent(prevState => {
                const updatedFields = { ...prevState }
                if (data) {
                  // Iterate through formInput keys
                  Object?.keys(data).forEach(key => {
                    // Check if the key is not 'nature'
                    if (key !== 'nature') {
                      // Update the field in formInputParent
                      updatedFields[key] = data[key]
                    }
                    if (key == 'date_document') {
                      updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                    }
                    if (key == 'project_ids') {
                      updatedFields[key] = data[key].map(item => item)
                    }
                  })
                }

                return updatedFields
              })
            }}
          />
        )
      case 5:
        return (
          <StepFiveFragment
            activeStep={activeStep}
            offer={offer}
            isFetching={offerQuery?.isFetching}
            isSuccess={offerQuery?.isSuccess}
            setContratSkeletonLocalData={setContratSkeletonLocalData}
            contratSkeletonLocalData={contratSkeletonLocalData}
            setFormInputParent={data => {
              // Keep the ref current synchronously so Next-button validation never reads stale state
              if (data && Array.isArray(data.document_lines)) {
                documentLinesRef.current = data.document_lines

                // Keep offerArticles in sync so later steps (Total Prix, Contract)
                // initialize from the biens the user just selected, not stale
                // server data that may not include the new selection yet.
                setOfferArticles(data.document_lines)
              }
              setFormInputParent(prevState => {
                const updatedFields = { ...prevState }
                if (data) {
                  // /* removed */
                  if (data) {
                    // Iterate through formInput keys
                    Object?.keys(data)?.forEach(key => {
                      // Check if the key is not 'nature'
                      if (key !== 'nature') {
                        // Update the field in formInputParent
                        updatedFields[key] = data[key]
                      }
                      if (key == 'date_document') {
                        updatedFields[key] = moment(data[key]).format('YYYY-MM-DD')
                      }
                      if (key == 'project_ids') {
                        updatedFields[key] = data[key].map(item => item)
                      }
                    })
                  }
                }

                return updatedFields
              })
            }}
          />
        )

      default:
        return 'Unknown Step'
    }
  }

  return (
    <>
      <Fragment>
        <StepperWrapper>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => {
              return (
                <Step key={index + 1}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <div>
                        <Typography className='step-title'>{step?.title}</Typography>
                        <Typography className='step-subtitle'>{step?.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
        <Divider></Divider>

        <div className='mx-20 my-8'>{getStepContent(activeStep + 1)}</div>

        <Divider></Divider>
        <div className='flex justify-between'>
          <LoadingButton
            size='large'
            variant='outlined'
            color='secondary'
            loading={activeStep === 0 || isLoading}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            <IconifyIcon icon='ic:baseline-keyboard-double-arrow-left' className='!text-neutral-500' />
            Précédent
          </LoadingButton>

          <LoadingButton
            loading={isLoading}
            size='large'
            onClick={() => {
              handleSubmit()
            }}
            variant='contained'
          >
            {activeStep === steps.length - 1 ? 'Valider' : 'Suivant'}
            <IconifyIcon icon='material-symbols:double-arrow' />
          </LoadingButton>
        </div>
        {/* <CardContent>{renderContent()}</CardContent> */}
      </Fragment>
      {isSelectDialogOpen && (
        <SelectArticleDialog
          isDialogOpen={isSelectDialogOpen}
          listArticles={[
            {
              id: 1,
              benificiaire: 'test',
              designation_article: 'test',
              qte: 1,
              prix_unitaire_HT: 220,
              remise: 0,
              prix_unitaire_HTNet: 10,
              prix_unitaire_TTC: 250
            },
            {
              id: 2,
              benificiaire: 'test',
              designation_article: 'test',
              qte: 1,
              prix_unitaire_HT: 220,
              remise: 0,
              prix_unitaire_HTNet: 10,
              prix_unitaire_TTC: 250
            }
          ]}
          selectedArticles={selectedArticles} // Pass the selected articles to the dialog
          closeDialog={() => setIsSelectDialogOpen(false)}
          onSelectArticle={handleSelectArticle}
          headerCellsBackGroundColor={'red'}
          onRemoveArticle={handleRemoveArticle}
        />
      )}
    </>
  )
}

export default UpdateForm
