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
import { Fragment, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import SelectArticleDialog from 'src/views/components/article-dialog/SelectArticleDialog'
import StepperAlternativeLabel from 'src/views/forms/form-wizard/StepperAlternativeLabel'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import StepOneFragment from './steps/StepOneFragment'
import ChooseTypeDialog from './dialogs/ChooseTypeDialog'
import moment from 'moment'
import { useCreateOffer } from 'src/services/offers.service'
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
  }
]

const CreateForm = () => {
  const router = useRouter()

  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(true)
  const [activeStep, setActiveStep] = useState(1)

  const createOfferMutation = useCreateOffer()

  const [formInputParent, setFormInputParent] = useState({
    date_document: '',
    date_echeance: '',
    residence_id: 0,
    d_client_id: 0,
    commercial_id: 0,
    nature: null,
    client_contact: '',
    comment: ''
  })

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
    // Validate required fields before attempting to create
    if (!formInputParent?.d_client_id) {
      toast.error('Veuillez selectionner un client.')
      
return
    }
    if (!Array.isArray(formInputParent?.project_ids) || formInputParent.project_ids.length === 0) {
      toast.error('Veuillez selectionner au moins une residence.')
      
return
    }
    if (formInputParent?.nature === null || formInputParent?.nature === undefined) {
      toast.error('Veuillez choisir le type de document.')
      
return
    }

    try {
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
      values.date_document = moment(formInputParent?.date_document).format('YYYY-MM-DD')
      values.date_echeance = moment(formInputParent?.date_echeance).format('YYYY-MM-DD')
      values.project_ids = formInputParent?.project_ids
      values.d_client_id = formInputParent?.d_client_id
      values.commercial_id = formInputParent?.commercial_id
      values.client_contact = formInputParent?.client_contact
      values.nature = formInputParent?.nature
      values.comment = formInputParent?.comment

      const response = await createOfferMutation?.mutateAsync(values)

      // /* removed */

      router.push(`/offers/${response?.data?.id}/update`)
    } catch (error) {
      // setLoading(false)
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 1:
        return (
          <StepOneFragment
            handleSubmit={handleSubmit}
            create={true}
            setFormInputParent={data => {
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
                      updatedFields[key] = moment(data[key])?.format('YYYY-MM-DD')
                    }
                    if (key == 'date_echeance') {
                      updatedFields[key] = moment(data[key])?.format('YYYY-MM-DD')
                    }
                    if (key == 'project_ids') {
                      updatedFields[key] = data[key]?.map(item => item)
                    }
                  })
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
          <Stepper activeStep={activeStep - 1} alternativeLabel>
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

        <div className='mx-20'>{getStepContent(activeStep)}</div>

        <Divider></Divider>
        <div className='flex justify-between'>
          <LoadingButton
            size='large'
            variant='outlined'
            color='secondary'
            loading={createOfferMutation?.isLoading}
            disabled={activeStep === 1}
          >
            <IconifyIcon icon='ic:baseline-keyboard-double-arrow-left' className='!text-neutral-500' />
            Back
          </LoadingButton>

          <LoadingButton
            size='large'
            onClick={handleSubmit}
            loading={createOfferMutation?.isLoading}
            variant='contained'
          >
            {activeStep === steps.length - 1 ? 'Envoyer' : 'Suivant'}
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

      <ChooseTypeDialog
        open={isTypeDialogOpen}
        handleClose={() => {

          if (formInputParent?.nature >= 0) setIsTypeDialogOpen(false)
        }}
        setNature={value => {

          setFormInputParent({
            ...formInputParent,
            nature: value
          })
        }}
      />
    </>
  )
}

export default CreateForm
