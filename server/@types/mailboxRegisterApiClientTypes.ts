import { components } from './mailboxRegisterApiImport'

export type LocalDeliveryUnitMailbox = components['schemas']['LocalDeliveryUnitMailbox']
export type OffenderManagementUnitMailbox = components['schemas']['OffenderManagementUnitMailbox']
export type CreateLocalDeliveryUnitMailboxRequest = components['schemas']['CreateLocalDeliveryUnitMailboxRequest']
export type PrisonCodesResult = { prisons: Record<string, string> }
export type CreateOffenderManagementUnitMailboxRequest =
  components['schemas']['CreateOffenderManagementUnitMailboxRequest']
export type CreateProbationTeamRequest = components['schemas']['CreateProbationTeamRequest']
export type ProbationTeam = components['schemas']['ProbationTeam']
