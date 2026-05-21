import React, { useState } from 'react'
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
  Checkbox // Import Checkbox from @mui/material
} from '@mui/material'

const SelectArticleDialog = ({
  isDialogOpen,
  listArticles,
  selectedArticles,
  closeDialog,
  onSelectArticle,
  onRemoveArticle,
  headerCellsBackGroundColor
}) => {
  const handleToggleArticle = (event, article) => {
    if (event?.target?.checked) {
      onSelectArticle(article)
    } else {
      onRemoveArticle(article?.id)
    }
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth={'lg'}>
      <DialogTitle>Selectionner Bien</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',
                    borderTopLeftRadius: 15,
                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    pr: 3,
                    textAlign: 'center' // Add this to center the header text
                  }}
                >
                  Select
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Benificiaire
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Opération
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Quantité
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Prix Unitaire HT
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Remise
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Montant HTNet
                </TableCell>
                <TableCell
                  sx={{
                    pl: 3,
                    whiteSpace: 'nowrap',
                    borderTopRightRadius: 15,

                    backgroundColor: headerCellsBackGroundColor,
                    color: 'white !important',
                    textAlign: 'center' // Center the header text
                  }}
                >
                  Montant TTC
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(listArticles)?listArticles:(listArticles?.data??[])).map((article, index) => (
                <TableRow key={index}>
                  <TableCell align='center'>
                    <Checkbox
                      checked={selectedArticles?.find(row => row?.id === article?.id)}
                      onChange={event => handleToggleArticle(event, article)}
                    />
                  </TableCell>
                  <TableCell align='center'>{article.benificiaire ? article.benificiaire : 'N/A'}</TableCell>
                  <TableCell align='center'>{article.designation_article}</TableCell>
                  <TableCell align='center'>{article.qte}</TableCell>
                  <TableCell align='center'>{article.prix_unitaire_HT}</TableCell>
                  <TableCell align='center'>{article.remise}</TableCell>
                  <TableCell align='center'>{article.prix_unitaire_HTNet}</TableCell>
                  <TableCell align='center'>{article.prix_unitaire_TTC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {(!listArticles || (listArticles && !listArticles.length)) && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '81px' }}>
            <div>Aucun article trouvé</div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color='primary'>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SelectArticleDialog
