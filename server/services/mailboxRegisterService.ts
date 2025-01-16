import type {
  LocalDeliveryUnitMailbox,
  CreateLocalDeliveryUnitMailboxRequest,
} from '../@types/mailboxRegisterApiClientTypes'
import { RestClientBuilder } from '../data'
import MailboxRegisterApiClient from '../data/mailboxes/mailboxRegisterApiClient'

export default class MailboxRegisterService {
  constructor(private readonly mailboxRegisterApiClientBuilder: RestClientBuilder<MailboxRegisterApiClient>) {}

  public async createLocalDeliveryUnitMailbox(
    token: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<CreateLocalDeliveryUnitMailboxRequest> {
    return this.mailboxRegisterApiClientBuilder(token).createLocalDeliveryUnitMailbox(mailbox)
  }

  public async listLocalDeliveryUnitMailboxes(token: string): Promise<LocalDeliveryUnitMailbox[]> {
    return this.mailboxRegisterApiClientBuilder(token).listLocalDeliveryUnitMailboxes()
  }
}
