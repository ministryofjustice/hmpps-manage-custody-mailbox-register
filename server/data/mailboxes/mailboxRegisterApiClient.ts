import type {
  CreateLocalDeliveryUnitMailboxRequest,
  LocalDeliveryUnitMailbox,
} from '../../@types/mailboxRegisterApiClientTypes'
import config, { ApiConfig } from '../../config'
import RestClient from '../restClient'

export default class MailboxRegisterApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('mailboxRegisterApiClient', config.apis.mailboxRegisterApi as ApiConfig, token)
  }

  async createLocalDeliveryUnitMailbox(
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<CreateLocalDeliveryUnitMailboxRequest> {
    return this.restClient.post<CreateLocalDeliveryUnitMailboxRequest>({
      path: '/local-delivery-unit-mailboxes',
      data: mailbox,
    })
  }

  async updateLocalDeliveryUnitMailbox(
    id: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<LocalDeliveryUnitMailbox> {
    return this.restClient.put<LocalDeliveryUnitMailbox>({
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
}
