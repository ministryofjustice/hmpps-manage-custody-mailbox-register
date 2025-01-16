import type {
  LocalDeliveryUnitMailbox,
  CreateLocalDeliveryUnitMailboxRequest,
} from '../@types/mailboxRegisterApiClientTypes'
import { RestClientBuilder } from '../data'
import MailboxRegisterApiClient, { MailboxRegisterResponse } from '../data/mailboxes/mailboxRegisterApiClient'

export default class MailboxRegisterService {
  constructor(private readonly mailboxRegisterApiClientBuilder: RestClientBuilder<MailboxRegisterApiClient>) {}

  public async createLocalDeliveryUnitMailbox(
    token: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).createLocalDeliveryUnitMailbox(mailbox)
  }

  public async updateDeliveryUnitMailbox(
    token: string,
    id: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<LocalDeliveryUnitMailbox> {
    return this.mailboxRegisterApiClientBuilder(token).updateLocalDeliveryUnitMailbox(id, mailbox)
  }

  public async listLocalDeliveryUnitMailboxes(token: string): Promise<LocalDeliveryUnitMailbox[]> {
    return this.mailboxRegisterApiClientBuilder(token).listLocalDeliveryUnitMailboxes()
  }

  public async getLocalDeliveryUnitMailbox(token: string, id: string): Promise<LocalDeliveryUnitMailbox> {
    return this.mailboxRegisterApiClientBuilder(token).getLocalDeliveryUnitMailbox(id)
  }
}
