export const PUHTNET = (PUHT, DEISCOUNT) => {
  return PUHT - PUHT * (DEISCOUNT / 100)
}

export const MONTANTHT = (PUHT, QTE) => {
  return PUHT * QTE
}

export const MONTANTHTNET = (PUHNET, QTE) => {
  return PUHNET * QTE
}

export const PUTTC = (PUHTNET, TVA) => {
  return PUHTNET + (PUHTNET * TVA) / 100
}

export const MONTANTTTC = (PUTTC, QTE) => {
  return PUTTC * QTE
}

export const totalHeaderCalcule = list => {
  let total = {
    amount_total: 0,
    montant_HT_total: 0,
    montant_TTC_total: 0,
    montant_TVA_total: 0,
    montant_HTNet_total: 0,
    montant_Remise: 0
  }
  for (var i = 0; i < list?.length; i++) {
    total.amount_total = total.amount_total + (parseFloat(list[i].amount_total) || 0)
    total.montant_HT_total = total.montant_HT_total + (parseFloat(list[i].price_unitaire_HT) || 0)
    total.montant_HTNet_total =
      total.montant_HTNet_total +
      (parseFloat(list[i].price_unitaire_HT) -
        (parseFloat(list[i].price_unitaire_HT) * parseFloat(list[i].remise)) / 100 || 0)
    total.montant_TTC_total = total.montant_TTC_total + (parseFloat(list[i].price_unitaire_TTC) || 0)
    total.montant_TVA_total = total.montant_TVA_total + (parseFloat(list[i].amount_TVA) || 0)

    // /* removed */
  }
  total.montant_Remise = total.montant_HT_total - total.montant_HTNet_total

  return total
}
