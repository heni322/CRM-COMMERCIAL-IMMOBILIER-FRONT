/**
 * queryKeys.js — Centralised React Query key factory
 *
 * WHY THIS EXISTS
 * ───────────────
 * Scattered string literals across 25 service files meant:
 *  • Typos caused silent cache misses (e.g. 'prefrences' vs 'preferences')
 *  • invalidateQueries() calls targeted the wrong cache entries
 *  • Impossible to know at a glance every key in use
 *
 * This factory gives every key a single definition, makes partial
 * invalidation safe (invalidate all 'residences' or just 'residences detail 5'),
 * and is fully tree-shakeable.
 *
 * USAGE
 * ─────
 *   import { queryKeys } from 'src/lib/api/queryKeys'
 *
 *   // In a useQuery:
 *   queryKey: queryKeys.residences.list(filters)
 *
 *   // To invalidate all residence queries:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.residences.all })
 *
 *   // To invalidate only the detail for id=5:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.residences.detail(5) })
 */

export const queryKeys = {

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    loggedUser: ['auth', 'logged-user'],
  },

  // ── Users (collaborators) ─────────────────────────────────────────────────
  users: {
    all:    ['users'],
    lists:  () => [...queryKeys.users.all, 'list'],
    list:   filters => [...queryKeys.users.lists(), filters],
    detail: id => [...queryKeys.users.all, 'detail', id],
    roles:  () => [...queryKeys.users.all, 'roles'],
  },

  // ── Clients ───────────────────────────────────────────────────────────────
  clients: {
    all:        ['clients'],
    lists:      () => [...queryKeys.clients.all, 'list'],
    list:       filters => [...queryKeys.clients.lists(), filters],
    detail:     id => [...queryKeys.clients.all, 'detail', id],
    documents:  id => [...queryKeys.clients.all, 'documents', id],
    appointments: id => [...queryKeys.clients.all, 'appointments', id],
    categories: () => [...queryKeys.clients.all, 'categories'],
    types:      () => [...queryKeys.clients.all, 'types'],
    natures:    () => [...queryKeys.clients.all, 'natures'],
  },

  // ── Residences (Projects) ─────────────────────────────────────────────────
  residences: {
    all:        ['residences'],
    lists:      () => [...queryKeys.residences.all, 'list'],
    list:       filters => [...queryKeys.residences.lists(), filters],
    detail:     id => [...queryKeys.residences.all, 'detail', id],
    blocs:      id => [...queryKeys.residences.all, 'blocs', id],
    properties: id => [...queryKeys.residences.all, 'properties', id],
    images:     id => [...queryKeys.residences.all, 'images', id],
    documents:  id => [...queryKeys.residences.all, 'documents', id],
  },

  // ── Blocs ─────────────────────────────────────────────────────────────────
  blocs: {
    all:    ['blocs'],
    lists:  () => [...queryKeys.blocs.all, 'list'],
    list:   filters => [...queryKeys.blocs.lists(), filters],
    detail: id => [...queryKeys.blocs.all, 'detail', id],
    byResidence: residenceId => [...queryKeys.blocs.all, 'by-residence', residenceId],
  },

  // ── Properties ────────────────────────────────────────────────────────────
  properties: {
    all:       ['properties'],
    lists:     () => [...queryKeys.properties.all, 'list'],
    list:      filters => [...queryKeys.properties.lists(), filters],
    detail:    id => [...queryKeys.properties.all, 'detail', id],
    images:    id => [...queryKeys.properties.all, 'images', id],
    documents: id => [...queryKeys.properties.all, 'documents', id],
    forOffer:  filters => [...queryKeys.properties.all, 'for-offer', filters],
  },

  // ── Offers (Documents) ────────────────────────────────────────────────────
  offers: {
    all:      ['offers'],
    lists:    () => [...queryKeys.offers.all, 'list'],
    list:     filters => [...queryKeys.offers.lists(), filters],
    detail:   id => [...queryKeys.offers.all, 'detail', id],
    pdf:      id => [...queryKeys.offers.all, 'pdf', id],
    payments: id => [...queryKeys.offers.all, 'payments', id],
    byProperty: propertyId => [...queryKeys.offers.all, 'by-property', propertyId],
  },

  // ── Appointments ──────────────────────────────────────────────────────────
  appointments: {
    all:    ['appointments'],
    lists:  () => [...queryKeys.appointments.all, 'list'],
    list:   filters => [...queryKeys.appointments.lists(), filters],
    detail: id => [...queryKeys.appointments.all, 'detail', id],
    types:  () => [...queryKeys.appointments.all, 'types'],
  },

  // ── Payments / Echeances ──────────────────────────────────────────────────
  payments: {
    all:    ['payments'],
    types:  () => [...queryKeys.payments.all, 'types'],
    banks:  () => [...queryKeys.payments.all, 'banks'],
    detail: id => [...queryKeys.payments.all, 'detail', id],
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: {
    all:  ['notifications'],
    list: () => [...queryKeys.notifications.all, 'list'],
  },

  // ── References / Param tables ─────────────────────────────────────────────
  states: {
    all:  ['states'],
    list: model => [...queryKeys.states.all, model],
  },

  natures: {
    all:  ['natures'],
    list: filters => [...queryKeys.natures.all, filters],
  },

  preferences: {
    all:  ['preferences'],
    list: () => [...queryKeys.preferences.all, 'list'],
  },

  pieces: {
    all:  ['pieces'],
    list: () => [...queryKeys.pieces.all, 'list'],
  },

  propertyTypes: {
    all:  ['property-types'],
    list: () => [...queryKeys.propertyTypes.all, 'list'],
  },

  usageTypes: {
    all:  ['usage-types'],
    list: () => [...queryKeys.usageTypes.all, 'list'],
  },

  stats: {
    all:        ['stats'],
    properties: () => [...queryKeys.stats.all, 'properties'],
    documents:  () => [...queryKeys.stats.all, 'documents'],
  },

  tvas: {
    all:  ['tvas'],
    list: () => [...queryKeys.tvas.all, 'list'],
  },
}
