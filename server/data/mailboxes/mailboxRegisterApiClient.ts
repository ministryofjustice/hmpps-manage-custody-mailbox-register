import { RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'
import type {
  CreateLocalDeliveryUnitMailboxRequest,
  CreateOffenderManagementUnitMailboxRequest,
  CreateProbationTeamRequest,
  LocalDeliveryUnitMailbox,
  OffenderManagementUnitMailbox,
  PrisonCodesResult,
  ProbationTeam,
} from '../../@types/mailboxRegisterApiClientTypes'
import config from '../../config'
import logger from '../../../logger'

export type MailboxRegisterResponse = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export default class MailboxRegisterApiClient extends RestClient {
  private readonly token: string

  constructor(token: string) {
    super('mailboxRegisterApiClient', config.apis.mailboxRegisterApi, logger)
    this.token = token
  }

  async createLocalDeliveryUnitMailbox(
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.post<MailboxRegisterResponse>(
      {
        path: '/local-delivery-unit-mailboxes',
        data: mailbox,
      },
      asUser(this.token),
    )
  }

  async updateLocalDeliveryUnitMailbox(
    id: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.put<MailboxRegisterResponse>(
      {
        path: `/local-delivery-unit-mailboxes/${id}`,
        data: mailbox,
      },
      asUser(this.token),
    )
  }

  async listLocalDeliveryUnitMailboxes(): Promise<LocalDeliveryUnitMailbox[]> {
    return this.get<LocalDeliveryUnitMailbox[]>({ path: '/local-delivery-unit-mailboxes' }, asUser(this.token))
  }

  async getLocalDeliveryUnitMailbox(id: string): Promise<LocalDeliveryUnitMailbox> {
    return this.get<LocalDeliveryUnitMailbox>({ path: `/local-delivery-unit-mailboxes/${id}` }, asUser(this.token))
  }

  async deleteLocalDeliveryUnitMailbox(id: string): Promise<void> {
    return this.delete<void>({ path: `/local-delivery-unit-mailboxes/${id}` }, asUser(this.token))
  }

  async listPrisonCodes(): Promise<PrisonCodesResult> {
    return this.get<PrisonCodesResult>({ path: `/prison-codes` }, asUser(this.token))
  }

  async createOffenderManagementUnitMailbox(
    mailbox: CreateOffenderManagementUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.post<MailboxRegisterResponse>(
      {
        path: '/offender-management-unit-mailboxes',
        data: mailbox,
      },
      asUser(this.token),
    )
  }

  async updateOffenderManagementUnitMailbox(
    id: string,
    mailbox: CreateOffenderManagementUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.put<MailboxRegisterResponse>(
      {
        path: `/offender-management-unit-mailboxes/${id}`,
        data: mailbox,
      },
      asUser(this.token),
    )
  }

  async listOffenderManagementUnitMailboxes(): Promise<OffenderManagementUnitMailbox[]> {
    return this.get<OffenderManagementUnitMailbox[]>(
      { path: '/offender-management-unit-mailboxes' },
      asUser(this.token),
    )
  }

  async getOffenderManagementUnitMailbox(id: string): Promise<OffenderManagementUnitMailbox> {
    return this.get<OffenderManagementUnitMailbox>(
      { path: `/offender-management-unit-mailboxes/${id}` },
      asUser(this.token),
    )
  }

  async deleteOffenderManagementUnitMailbox(id: string): Promise<void> {
    return this.delete<void>({ path: `/offender-management-unit-mailboxes/${id}` })
  }

  async createProbationTeam(probationTeam: CreateProbationTeamRequest): Promise<MailboxRegisterResponse> {
    return this.post<MailboxRegisterResponse>(
      {
        path: '/probation-teams',
        data: probationTeam,
      },
      asUser(this.token),
    )
  }

  async updateProbationTeam(id: string, probationTeam: CreateProbationTeamRequest): Promise<MailboxRegisterResponse> {
    return this.put<MailboxRegisterResponse>(
      {
        path: `/probation-teams/${id}`,
        data: probationTeam,
      },
      asUser(this.token),
    )
  }

  async getProbationTeam(id: string): Promise<ProbationTeam> {
    return this.get<ProbationTeam>(
      {
        path: `/probation-teams/${id}`,
      },
      asUser(this.token),
    )
  }

  async listProbationTeams(): Promise<ProbationTeam[]> {
    return this.get<ProbationTeam[]>({ path: `/probation-teams` }, asUser(this.token))
  }

  async deleteProbationTeam(id: string): Promise<void> {
    return this.delete<void>({ path: `/probation-teams/${id}` }, asUser(this.token))
  }
}
