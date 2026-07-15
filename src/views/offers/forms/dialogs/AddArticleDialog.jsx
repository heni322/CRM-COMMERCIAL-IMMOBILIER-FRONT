import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  Grid,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack
} from '@mui/material'

import { MONTANTHT, MONTANTHTNET, MONTANTTTC, PUHTNET, PUTTC } from '../calcule'
import toast from 'react-hot-toast'
import { getType } from '@reduxjs/toolkit'
import CurrencyInput from 'src/components/CurrencyInput'
import CustomCurrency from 'src/components/CustomCurrency'

// import logoText from '../assets/images/brand/logo-text.png';

// Safely coerce any value to a finite number (handles undefined/null/empty/NaN -> 0)
const num = v => {
  const n = parseFloat(v)
  
return Number.isFinite(n) ? n : 0
}

const AddArticleDialog = ({ formData, isDialogOpen, closeDialog, onAddArticle, onEditArticle, step, preferences }) => {
  const isEditing = formData !== null

  const initialFormState = {
    percentage: 40,
    d_contrat_id: null,
    chemin_fichier: null,
    generate_inspections: 0
  }

  const [itemForm, setItemForm] = useState({
    reference_property: '',
    designation_article: '',
    qte: 1,
    price_unitaire_HT: 0,
    price_unitaire_HTNet: 0,
    price_unitaire_TTC: 0,
    montant_HTNet: 0,
    montant_TTC: 0,
    montant_HT: 0,
    montant_TVA: 0,
    tva: preferences?.tva,
    discount: 0,
    id: 0,
    amount_HT: null,
    amount_HTNet: null,
    amount_TTC: null,
    amount_TVA: null,
    comment: null,
    cpf: null,
    created_at: '',
    d_document_header_id: 0,
    d_property_id: 0
  })

  useEffect(() => {
    setItemForm(formData)

  }, [formData])

  useEffect(() => {
    setItemForm(f => {
      /* removed */

      return {
        ...f,
        price_unitaire_HTNet: PUHTNET(num(f?.price_unitaire_HT), num(f?.discount ?? 0)),
        price_unitaire_TTC: PUTTC(num(f?.price_unitaire_HTNet), num(preferences?.tva ?? 19)),
        amount_total:
          PUTTC(num(f?.price_unitaire_HTNet), num(f?.tva)) +
          (step === 2
            ? num(f?.registration_fees) +
              num(f?.registration_fees_compl) +
              num(f?.others_fees) +
              num(f?.folder_fees) +
              num(f?.lawyer_fees) +
              num(f?.trustee_fees) +
              num(f?.cpf) +
              num(f?.lotiss_fees)
            : 0),
        montant_TVA: calculateMontantTVA(
          PUTTC(num(f?.price_unitaire_HTNet), num(preferences?.tva ?? 19)),
          num(PUHTNET(num(f?.price_unitaire_HT), num(f?.discount)))
        )
      }
    })
  }, [
    itemForm?.discount,
    itemForm?.price_unitaire_HT,
    itemForm?.registration_fees,
    itemForm?.registration_fees_compl,
    itemForm?.others_fees,
    itemForm?.folder_fees,
    itemForm?.lawyer_fees,
    itemForm?.trustee_fees,
    itemForm?.lotiss_fees,
    formData
  ])

  const handleChange = event => {
    const { name, value } = event.target

    /* removed */
    setItemForm({
      ...itemForm,
      [name]: (value === '' || value === null || value === undefined || Number.isNaN(parseFloat(value))) ? 0 : parseFloat(value)
    })
  }

  const handleCloseDialog = event => {
    closeDialog()
  }

  const submitForm = () => {

    // Check if all the required fields have data
    if (
      itemForm.reference_property &&
      itemForm.price_unitaire_HT &&
      itemForm.price_unitaire_HTNet &&
      itemForm.price_unitaire_TTC
    ) {
      if (isEditing) {
        // If you're editing, call the onEditArticle prop
        onEditArticle(itemForm)
      } else {
        // If you're adding, call the onAddArticle prop
        onAddArticle(itemForm)
      }
      closeDialog()
    } else {
      // Display an error message or handle the validation error as needed
      toast.error('Veuillez remplir tous les champs obligatoires.')
    }
  }

  // const handleClosDialog = (event) => {
  //   closeDialog;
  // };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth={'lg'}>
      <DialogTitle>{isEditing ? 'Modifier Bien' : 'Ajouter Bien'}</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <form id='Form1'>
          <Grid container spacing={4}>
            {step === 1 && (
              <>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Référence
                    </Typography>
                    <TextField
                      disabled
                      inputProps={{
                        form: 'Form1'
                      }}
                      required
                      fullWidth
                      type='text'
                      name='reference_property'
                      value={itemForm?.reference_property}
                      onChange={handleChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Prix Unitaire HT
                    </Typography>
                    <TextField
                      inputProps={{
                        form: 'Form1'
                      }}
                      required
                      fullWidth
                      type='number'
                      name='price_unitaire_HT'
                      value={itemForm?.price_unitaire_HT}
                      onChange={handleChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Remise (%)
                    </Typography>
                    <TextField
                      inputProps={{
                        form: 'Form1'
                      }}
                      required
                      fullWidth
                      type='number'
                      name='discount'
                      value={itemForm?.discount}
                      onChange={handleChange}
                    />{' '}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Taux Tva (%)
                    </Typography>
                    <TextField
                      required
                      disabled
                      inputProps={{
                        form: 'Form1'
                      }}
                      fullWidth
                      type='number'
                      name='tva'
                      value={itemForm?.tva}
                      onChange={handleChange}
                    />{' '}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Prix Unitaire HTNet
                    </Typography>
                    <TextField
                      inputProps={{
                        form: 'Form1'
                      }}
                      required
                      disabled
                      fullWidth
                      type='number'
                      name='price_unitaire_HTNet'
                      value={itemForm?.price_unitaire_HTNet}
                      onChange={handleChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' id='itemAmount'>
                      Prix Unitaire TTC
                    </Typography>
                    <TextField
                      inputProps={{
                        form: 'Form1'
                      }}
                      required
                      disabled
                      fullWidth
                      type='number'
                      name='price_unitaire_TTC'
                      value={itemForm?.price_unitaire_TTC}
                      onChange={handleChange}
                    />
                  </Stack>
                </Grid>
              </>
            )}

            {step === 2 && (
              <>
                <Grid item xs={12} md={12}>
                  <Card elevation={1}>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='itemAmount'>
                              <strong>Référence</strong>
                            </Typography>
                            <Typography variant='body1'>{itemForm?.reference_property}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='itemAmount'>
                              <strong>Prix Unitaire HT</strong>
                            </Typography>
                            {/* <Typography variant='body1'>{itemForm?.price_unitaire_HT}</Typography> */}
                            <CustomCurrency
                              suffix=' TND'
                              value={itemForm?.price_unitaire_HT ?? 0}
                              allowNegative={false}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='itemAmount'>
                              <strong>Remise (%)</strong>
                            </Typography>
                            <Typography variant='body1'>{itemForm?.discount ?? 0}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='itemAmount'>
                              <strong>Taux Tva (%)</strong>
                            </Typography>
                            <Typography variant='body1'>{preferences?.tva}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='price_unitaire_HTNet'>
                              <strong>Prix Unitaire HTNet</strong>
                            </Typography>
                            {/* <Typography variant='body1'>{itemForm?.price_unitaire_HTNet}</Typography> */}
                            <CustomCurrency
                              suffix=' TND'
                              value={itemForm?.price_unitaire_HTNet ?? 0}
                              allowNegative={false}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='price_unitaire_TTC'>
                              <strong>Prix Unitaire TTC</strong>
                            </Typography>
                            {/* <Typography variant='body1'>{itemForm?.price_unitaire_TTC}</Typography> */}
                            <CustomCurrency
                              suffix=' TND'
                              value={itemForm?.price_unitaire_TTC ?? 0}
                              allowNegative={false}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Card elevation={1}>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='registration_fees'>
                              Frais d'inscription
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='registration_fees'
                              value={itemForm?.registration_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='registration_fees'
                              value={itemForm?.registration_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='registration_fees_compl'>
                              Frais complémentaires d'inscription
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='registration_fees_compl'
                              value={itemForm?.registration_fees_compl}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='registration_fees_compl'
                              value={itemForm?.registration_fees_compl}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='lotissFees'>
                              Frais de lotissement
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='lotiss_fees'
                              value={itemForm?.lotiss_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='lotiss_fees'
                              value={itemForm?.lotiss_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='trustee_fees'>
                              Frais de syndic
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='trustee_fees'
                              value={itemForm?.trustee_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='trustee_fees'
                              value={itemForm?.trustee_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='folderFees'>
                              Frais de dossier
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='folder_fees'
                              value={itemForm?.folder_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='folder_fees'
                              value={itemForm?.folder_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='lawyerFees'>
                              Frais d'avocat
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='lawyer_fees'
                              value={itemForm?.lawyer_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='lawyer_fees'
                              value={itemForm?.lawyer_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='cpffees'>
                              CPF
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='cpf'
                              value={itemForm?.cpf}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='cpf'
                              value={itemForm?.cpf}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1}>
                            <Typography variant='subtitle1' id='othersFees'>
                              Autres frais
                            </Typography>
                            {/* <TextField
                              inputProps={{
                                form: 'Form1'
                              }}
                              required
                              fullWidth
                              type='number'
                              name='others_fees'
                              value={itemForm?.others_fees}
                              onChange={handleChange}
                            /> */}
                            <CurrencyInput
                              fullWidth
                              variant='outlined'
                              name='others_fees'
                              value={itemForm?.others_fees}
                              onChange={handleChange}
                              size='big'
                              suffix=' TND'
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {/* <Grid item container justifyContent="flex-end">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button color="error" onClick={() => setisModalOpen(false)}>
                    {readOnly ? 'Fermer' : 'Annuler'}
                  </Button>
                  {!readOnly && (
                    <Button
                      form="Form1"
                      // disabled={!ItemForm?.id || !selectedQuantity || Boolean(errors.quantityError)}
                      variant="contained"
                      size="small"
                      // onClick={handleOk}
                      type="submit"
                    >
                      {isEditMode ? 'Modifier' : 'Ajouter'}
                    </Button>
                  )}
                </Stack>
              </Grid> */}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color='primary'>
          Annuler
        </Button>
        <Button onClick={submitForm} variant='contained' color='primary'>
          {isEditing ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddArticleDialog

export function calculateMontantTVA(montant_ttc, montantHt) {
  return montant_ttc - montantHt
}
