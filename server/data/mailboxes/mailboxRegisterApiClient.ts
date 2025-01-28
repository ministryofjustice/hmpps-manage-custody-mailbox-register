import type {
  CreateLocalDeliveryUnitMailboxRequest,
  CreateOffenderManagementUnitMailboxRequest,
  LocalDeliveryUnitMailbox,
  PrisonCodesResult,
} from '../../@types/mailboxRegisterApiClientTypes'
import config, { ApiConfig } from '../../config'
import RestClient from '../restClient'

export type MailboxRegisterResponse = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export default class MailboxRegisterApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('mailboxRegisterApiClient', config.apis.mailboxRegisterApi as ApiConfig, token)
  }

  async createLocalDeliveryUnitMailbox(
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.restClient.post<MailboxRegisterResponse>({
      path: '/local-delivery-unit-mailboxes',
      data: mailbox,
    })
  }

  async updateLocalDeliveryUnitMailbox(
    id: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.restClient.put<MailboxRegisterResponse>({
      path: `/local-delivery-unit-mailboxes/${id}`,
      data: mailbox,
    })
  }

  async listLocalDeliveryUnitMailboxes(): Promise<LocalDeliveryUnitMailbox[]> {
    return this.restClient.get<LocalDeliveryUnitMailbox[]>({ path: '/local-delivery-unit-mailboxes' })
  }

  async getLocalDeliveryUnitMailbox(id: string): Promise<LocalDeliveryUnitMailbox> {
    return this.restClient.get<LocalDeliveryUnitMailbox>({ path: `/local-delivery-unit-mailboxes/${id}` })
  }

  async deleteLocalDeliveryUnitMailbox(id: string): Promise<void> {
    return this.restClient.delete<void>({ path: `/local-delivery-unit-mailboxes/${id}` })
  }

  async listPrisonCodes(): Promise<PrisonCodesResult> {
    return this.restClient.get<PrisonCodesResult>({ path: `/prison-codes` })
  }

  async createOffenderManagementUnitMailbox(
    mailbox: CreateOffenderManagementUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.restClient.post<MailboxRegisterResponse>({
      path: '/offender-management-unit-mailboxes',
      data: mailbox,
    })
  }
}
