import type { CreateLocalDeliveryUnitMailboxRequest } from '../@types/mailboxRegisterApiClientTypes'
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
}
