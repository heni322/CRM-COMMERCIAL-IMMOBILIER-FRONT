import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox, // Import Checkbox from @mui/material
  Paper
} from '@mui/material'
import CustomCurrency from 'src/components/CustomCurrency'

const SelectArticleDialogStepTwo = ({ isDialogOpen, listArticles, selectedArticles, closeDialog, onSelectArticle }) => {
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    if (selectedArticles && selectedArticles?.length) setSelectedItems(selectedArticles)
    else setSelectedItems([])
  }, [selectedArticles])

  const handleToggleArticle = article => {
    const isSelected = selectedItems?.includes(article)
    if (isSelected) {
      setSelectedItems(selectedItems?.filter(selected => selected !== article))
    } else {
      setSelectedItems([...selectedItems, article])
    }
  }

  const handleConfirmSelection = () => {
    // Pass the selected articles back to the parent component
    onSelectArticle(selectedItems)
    closeDialog()
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'xl'}>
      <DialogTitle>Selectionner Bien</DialogTitle>
      <DialogContent>
        <div className='p-2'>
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
                    Select
                  </TableCell>
                  <TableCell
                    sx={{ pl: 3, whiteSpace: 'nowrap', bborderTopLeftRadius: 15, color: 'white !important' }}
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
                {(Array.isArray(listArticles)?listArticles:(listArticles?.data??[])).map((article, index) => (
                  <TableRow key={index}>
                    <TableCell align='center'>
                      <Checkbox
                        checked={selectedItems?.includes(article)}
                        onChange={() => handleToggleArticle(article)}
                      />
                    </TableCell>
                    <TableCell align='center'>{article?.project_name}</TableCell>
                    <TableCell align='center'>{article?.reference_property}</TableCell>
                    <TableCell align='center'>{article?.entitled_property}</TableCell>
                    <TableCell align='center'>{article?.property_type}</TableCell>
                    <TableCell align='center'>
                      <CustomCurrency value={article?.price_unitaire_HT ?? 0} allowNegative={false} />
                    </TableCell>
                    <TableCell align='center'>
                      <CustomCurrency value={article?.price_unitaire_TTC ?? 0} allowNegative={false} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {(!listArticles || (listArticles && !listArticles.length)) && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '81px' }}>
            <div>Aucun article trouvé</div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color='primary'>
          Annuler
        </Button>
        <Button onClick={handleConfirmSelection} variant='contained' color='primary'>
          Selectionner
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectArticleDialogStepTwo
