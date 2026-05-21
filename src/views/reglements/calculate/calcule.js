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
    montant_HT_total: 0,
    montant_TTC_total: 0,
    montant_TVA_total: 0,
    montant_HTNet_total: 0,
    montant_Remise: 0
  }
  for (var i = 0; i < list.length; i++) {
    total.montant_HT_total = total.montant_HT_total + (parseInt(list[i].montant_HT) || 0)
    total.montant_TTC_total = total.montant_TTC_total + (parseInt(list[i].montant_TTC) || 0)
    total.montant_TVA_total = total.montant_TVA_total + (parseInt(list[i].montant_TVA) || 0)
    total.montant_HTNet_total = total.montant_HTNet_total + (parseInt(list[i].montant_HTNet) || 0)
  }
  total.montant_Remise = total.montant_HT_total - total.montant_HTNet_total

  return total
}
