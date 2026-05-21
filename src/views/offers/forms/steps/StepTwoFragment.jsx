import {
  Autocomplete,
  Box,
  Button,
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
  TextField
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
import { totalHeaderCalcule } from '../calcule'
import SelectArticleDialogStepTwo from '../dialogs/SelectArticleDialogStepTwo'
import { useCalculateOffer } from 'src/services/offers.service'
import CustomCurrency from 'src/components/CustomCurrency'

const StepTwoFragment = ({
  handleSubmit,
  formInputParent,
  setFormInputParent,
  offer,
  activeStep,
  offerArticles,
  isSuccess,
  isFetching,
  preferences
}) => {
  const [offerDate, setOfferDate] = useState()
  const [formErrors, setFormErrors] = useState({})

  const [newArticles, setNewArticles] = useState([])

  // const [listArticles, setListArticles] = useState([])

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

  const getPropertiesQuery = useGetPropertiesByResidenceIds({ projects: offer?.project_ids })
  const listArticles = getPropertiesQuery?.data
  const calculateMutation = useCalculateOffer()

  const getClientQuery = useGetClientById({ stats: false, userId: offer?.d_client_id })
  const clientData = getClientQuery?.data

  const residencesQuery = useGetResidences({ paginated: false })
  const residencesData = residencesQuery?.data

  const handleChange = e => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    })
  }

  // Removed: useEffect that mirrored formInput to parent fired before calculate() resolved,
  // causing document_lines to be empty. setFormInputParent is now called directly in calculate().

  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    // Initialize the line list exactly once from the saved articles.
    // Re-running on every offer change would overwrite user-selected lines with stale data.
    if (offer && !initialized) {
      setFormInput(prev => ({ ...prev, ...offer, step: 1 }))
      calculate(Array.isArray(offerArticles) ? offerArticles : [])
      setInitialized(true)
    }
  }, [offer, initialized, offerArticles])

  const calculate = async array => {
    const response = await calculateMutation?.mutateAsync(array)
    const calculatedLines = response?.lines ?? []
    setNewArticles(calculatedLines)
    setFormInput(prev => ({
      ...prev,
      step: 1,
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
                <div className='shadow-md'>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead
                        style={{
                          backgroundColor: '#243b5a'
                        }}
                      >
                        <TableRow>
                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', borderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Résidence
                          </TableCell>
                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Référence
                          </TableCell>
                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Intitulé
                          </TableCell>

                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Type du Bien
                          </TableCell>

                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Prix Unitaire HT
                          </TableCell>
                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Montant TVA
                          </TableCell>
                          <TableCell
                            sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
                            align='center'
                          >
                            Montant TTC
                          </TableCell>
                          <TableCell
                            sx={{
                              pl: 3,
                              whiteSpace: 'nowrap',
                              borderTopRightRadius: 15,
                              color: 'white !important',
                              pr: 3
                            }}
                            align='center'
                          />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newArticles.map((article, index) => (
                          <TableRow key={index}>
                            <TableCell align='center'>{article?.project_name}</TableCell>
                            <TableCell align='center'>{article?.reference_property}</TableCell>
                            <TableCell align='center'>{article?.entitled_property}</TableCell>
                            <TableCell align='center'>{article?.property_type}</TableCell>
                            <TableCell align='center'>
                              <CustomCurrency value={article?.price_unitaire_HT ?? 0} allowNegative={false} />
                            </TableCell>
                            <TableCell align='center'>
                              <CustomCurrency value={article?.amount_TVA ?? 0} allowNegative={false} />
                            </TableCell>
                            <TableCell align='center'>
                              <CustomCurrency value={article?.price_unitaire_TTC ?? 0} allowNegative={false} />
                            </TableCell>
                            <TableCell align='center'>
                              <IconButton onClick={() => handleEditClick(index)}>
                                <Icon icon='mdi:pencil' style={{ color: 'blue' }} fontSize={20} />
                              </IconButton>
                              <IconButton onClick={() => handleDeleteClick(index)}>
                                <Icon icon='mdi:trash-can' style={{ color: '#EF4444' }} fontSize={20} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )
            ) : (
              <div class='flex justify-center items-center mt-10'>
                <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
              </div>
            )}
            <Divider></Divider>
            <div>
              <TotalCard productsData={newArticles} allAmounts={allAmounts} />
            </div>
          </div>
          {isSelectDialogOpen && (
            <SelectArticleDialogStepTwo
              isDialogOpen={isSelectDialogOpen}
              listArticles={listArticles}
              selectedArticles={newArticles} // Pass the selected articles to the dialog
              closeDialog={() => setIsSelectDialogOpen(false)}
              onSelectArticle={value => handleSelectArticle(value)}
            />
          )}

          {isDialogOpen && (
            <AddArticleDialog
              formData={editedArticle ? editedArticle : null} // Pass the article to edit or null for adding
              isDialogOpen={isDialogOpen}
              preferences={preferences}
              step={activeStep}
              closeDialog={closeDialog}
              onEditArticle={editedData => {
                const updatedArticles = [...newArticles]
                updatedArticles[editIndex] = editedData // Update the article in the array
                const response = calculate(updatedArticles)

                // setNewArticles(response?.lines)
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

export default StepTwoFragment
