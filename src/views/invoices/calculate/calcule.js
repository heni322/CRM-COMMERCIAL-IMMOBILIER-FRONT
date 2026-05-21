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
