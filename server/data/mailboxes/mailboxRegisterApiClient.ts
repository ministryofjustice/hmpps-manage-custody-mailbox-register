import type { LocalDeliveryUnitMailbox } from '../../@types/mailboxRegisterApiClientTypes'
import config, { ApiConfig } from '../../config'
import RestClient from '../restClient'

export default class MailboxRegisterApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'mailboxRegisterApiClient',
      config.apis.mailboxRegisterApiClient as ApiConfig,
      token,
    )
  }

  async createLocalDeliveryUnitMailbox(mailbox: LocalDeliveryUnitMailbox): Promise<LocalDeliveryUnitMailbox> {
    return this.restClient.post<LocalDeliveryUnitMailbox>({ path: '/local-delivery-unit-mailboxes', data: mailbox })
  }
}
