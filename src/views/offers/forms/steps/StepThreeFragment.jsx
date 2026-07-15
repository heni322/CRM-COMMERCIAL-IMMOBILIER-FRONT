import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import { Fragment, useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Spacing from 'src/@core/theme/spacing'
import CustomDatePicker from 'src/components/CustomDatePicker'
import { useGetClientById, useGetClients, useGetUsersById } from 'src/services/users.service'
import renderArrayMultiline from 'src/@core/utils/utilities'
import { useGetResidences } from 'src/services/residences.service'
import moment from 'moment'
import { useGetPropertiesByResidenceIds } from 'src/services/properties.service'
import { LoadingButton } from '@mui/lab'
import SelectArticleDialog from '../dialogs/SelectArticleDialog'
import AddArticleDialog from '../dialogs/AddArticleDialog'
import TotalCard from '../dialogs/TotalCard'
import { PUTTC, totalHeaderCalcule } from '../calcule'
import TotalCardStep3 from '../dialogs/TotalCardStep3'
import CustomCurrency from 'src/components/CustomCurrency'
import useStates from 'src/hooks/useStates'
import { useCalculateOffer } from 'src/services/offers.service'

const StepThreeFragment = ({
  handleSubmit,
  formInputParent,
  setFormInputParent,
  offer,
  document,
  activeStep,
  offerArticles,
  isSuccess,
  isFetching,
  preferences
}) => {
  const [offerDate, setOfferDate] = useState()
  const [formErrors, setFormErrors] = useState({})

  const [newArticles, setNewArticles] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formInput, setFormInput] = useState({
    step: 1,
    document_lines: []
  })

  const [allAmounts, setAllAmounts] = useState({
    amount_total: 0,
    montant_HTNet_total: 0,
    montant_Remise: 0,
    montant_HT_total: 0,
    montant_TVA_total: 0,
    montant_TTC_total: 0
  })

  // /* removed */

  const getPropertiesQuery = useGetPropertiesByResidenceIds({ projects: offer?.project_ids })
  const listArticles = getPropertiesQuery?.data

  const getClientQuery = useGetClientById({ stats: false, userId: offer?.d_client_id })
  const clientData = getClientQuery?.data

  const residencesQuery = useGetResidences({ paginated: false })
  const residencesData = residencesQuery?.data

  const calculateMutation = useCalculateOffer()

  const calculate = async array => {
    const response = await calculateMutation?.mutateAsync(array)
    const calculatedLines = response?.lines ?? []
    setNewArticles(calculatedLines)
    setFormInput(prev => ({
      ...prev,
      step: 2,
      document_lines: calculatedLines
    }))

    // Directly update parent so document_lines is always current when Next is clicked
    setFormInputParent({ document_lines: calculatedLines })
    setAllAmounts(prev => {
      return {
        montant_HTNet_total: response?.total?.amount_HTNet_total,
        amount_total: response?.total?.amount_total,
        montant_HT_total: response?.total?.amount_HT_total,
        montant_TVA_total: response?.total?.amount_tva,
        montant_TTC_total: response?.total?.amount_TTC_total,
        montant_Remise: response?.total?.amount_discount
      }
    })

    return response
  }

  // Removed: useEffect mirror - replaced by direct setFormInputParent call in calculate()

  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    // Initialize once from saved articles; avoid overwriting user edits when offer refetches.
    if (offer && !initialized) {
      setFormInput(prev => ({ ...prev, ...offer, step: 2 }))
      calculate(Array.isArray(offerArticles) ? offerArticles : [])
      setInitialized(true)
    }
  }, [offer, initialized, offerArticles])

  const calculateTotalAmounts = array => {
    setTotalAmount(totalHeaderCalcule(array)?.amount_total)
    setAllAmounts(prev => {
      return {
        amount_total: totalHeaderCalcule(array)?.amount_total,
        montant_HTNet_total: totalHeaderCalcule(array)?.montant_HTNet_total,
        montant_HT_total: totalHeaderCalcule(array)?.montant_HT_total,
        montant_TVA_total: totalHeaderCalcule(array)?.montant_TVA_total,
        montant_TTC_total: totalHeaderCalcule(array)?.montant_TTC_total,
        montant_Remise: totalHeaderCalcule(array)?.montant_Remise
      }
    })
  }

  const handleSelectArticle = selected => {
    // Filter out selected articles that are not already in newArticles
    let updatedArticles = []

    const uniqueSelected = selected.filter(
      article =>
        !newArticles?.some(a => {
          return a?.d_property_id === article?.d_property_id

          // else return a.id === article?.id
        })
    )

    if (newArticles && newArticles.length) calculate([...newArticles, ...uniqueSelected])
    else calculate(uniqueSelected)

    setIsSelectDialogOpen(false) // Close the dialog after selecting articles
  }

  const handleDeleteClick = index => {
    const updatedArticles = [...newArticles]
    updatedArticles.splice(index, 1)
    const response = calculate(updatedArticles)

    // setNewArticles(response?.lines)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const [editIndex, setEditIndex] = useState(-1) // Index of the article being edited
  const [editedArticle, setEditedArticle] = useState(null) // Article being edited

  const handleEditClick = index => {
    setEditIndex(index)
    setEditedArticle(newArticles[index])
    openDialog()
  }

  return (
    <>
      {isSuccess && !isFetching ? (
        <div>
          <div className='flex flex-col gap-4 p-6'>
            <div>
              <TotalCardStep3 productsData={newArticles} allAmounts={allAmounts} />
            </div>
            <Divider></Divider>

            <div className='flex justify-between'>
              <div className='flex items-center'>
                <span className='font-bold text-gray-800'>Client:</span>
                <span className='ml-1'>{clientData?.name}</span>
              </div>
              <div style={{ display: 'flex', alignSelf: 'center', gap: '10px' }}>
                <Button variant='outlined' color='primary' onClick={e => setIsSelectDialogOpen(true)}>
                  Selectionner Bien
                </Button>
              </div>
            </div>
            <Divider></Divider>
            {calculateMutation?.isSuccess && !calculateMutation?.isFetching ? (
              newArticles &&
              newArticles?.length > 0 && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {newArticles?.map((article, index) => (
                    <Card elevation={1} key={index} className='shadow-md' style={{ position: 'relative' }}>
                      <CardContent>
                        <Typography variant='h6' component='h2'>
                          Référence: {article.reference_property}
                        </Typography>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Résidence:</span>
                          <span className='ml-1'>{article.project_name}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Intitulé:</span>
                          <span className='ml-1'>{article.entitled_property}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Type du Bien:</span>
                          <span className='ml-1'>{article.property_type}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Prix Unitaire HT:</span>
                          <span className='ml-1'>{article.price_unitaire_HT ?? 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Prix Unitaire TTC:</span>
                          <span className='ml-1'>{article.price_unitaire_TTC ? article.price_unitaire_TTC : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais d'inscription:</span>
                          <span className='ml-1'>{article.registration_fees ? article.registration_fees : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais complémentaires d'inscription:</span>
                          <span className='ml-1'>
                            {article.registration_fees_compl ? article.registration_fees_compl : 0}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais de lotissement:</span>
                          <span className='ml-1'>{article.lotiss_fees ? article.lotiss_fees : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais de syndic:</span>
                          <span className='ml-1'>{article.trustee_fees ? article.trustee_fees : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais de dossier:</span>
                          <span className='ml-1'>{article.folder_fees ? article.folder_fees : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Frais d'avocat:</span>
                          <span className='ml-1'>{article.lawyer_fees ? article.lawyer_fees : 0}</span>
                        </div>
                        <div className='flex items-center'>
                          <span className='font-bold text-gray-800'>Autres frais:</span>
                          <span className='ml-1'>{article.others_fees ? article.others_fees : 0}</span>
                        </div>
                      </CardContent>
                      <CardActions style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
                        <IconButton onClick={() => handleEditClick(index)}>
                          <Icon icon='mdi:pencil' style={{ color: 'blue' }} fontSize={20} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(index)}>
                          <Icon icon='mdi:trash-can' style={{ color: '#EF4444' }} fontSize={20} />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div class='flex justify-center items-center mt-10'>
                <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
              </div>
            )}

            <Divider></Divider>
            <div className='flex text-2xl items-center self-center'>
              <span className='font-bold text-gray-800'>Net à Payer:</span>
              <span className='ml-1'>
                <CustomCurrency value={allAmounts?.amount_total} suffix={' TN'} allowNegative={false} />
              </span>
            </div>
            <Divider></Divider>
          </div>
          {isSelectDialogOpen && (
            <SelectArticleDialog
              isDialogOpen={isSelectDialogOpen}
              listArticles={listArticles}
              selectedArticles={newArticles} // Pass the selected articles to the dialog
              closeDialog={() => setIsSelectDialogOpen(false)}
              onSelectArticle={handleSelectArticle}
            />
          )}

          {isDialogOpen && (
            <AddArticleDialog
              formData={editedArticle ? editedArticle : null} // Pass the article to edit or null for adding
              isDialogOpen={isDialogOpen}
              step={activeStep}
              preferences={preferences}
              closeDialog={closeDialog}
              onEditArticle={editedData => {
                const updatedArticles = [...newArticles]
                updatedArticles[editIndex] = editedData // Update the article in the array
                const response = calculate(updatedArticles)
                closeDialog()
              }}
            />
          )}
        </div>
      ) : (
        <div class='flex justify-center items-center mt-10'>
          <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </>
  )
}

export default StepThreeFragment
