import type {
  LocalDeliveryUnitMailbox,
  CreateLocalDeliveryUnitMailboxRequest,
  PrisonCodesResult,
  CreateOffenderManagementUnitMailboxRequest,
  OffenderManagementUnitMailbox,
  CreateProbationTeamRequest,
  ProbationTeam,
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

  public async updateLocalDeliveryUnitMailbox(
    token: string,
    id: string,
    mailbox: CreateLocalDeliveryUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).updateLocalDeliveryUnitMailbox(id, mailbox)
  }

  public async listLocalDeliveryUnitMailboxes(token: string): Promise<LocalDeliveryUnitMailbox[]> {
    return this.mailboxRegisterApiClientBuilder(token).listLocalDeliveryUnitMailboxes()
  }

  public async getLocalDeliveryUnitMailbox(token: string, id: string): Promise<LocalDeliveryUnitMailbox> {
    return this.mailboxRegisterApiClientBuilder(token).getLocalDeliveryUnitMailbox(id)
  }

  public async deleteLocalDeliveryUnitMailbox(token: string, id: string): Promise<void> {
    return this.mailboxRegisterApiClientBuilder(token).deleteLocalDeliveryUnitMailbox(id)
  }

  public async listPrisonCodes(token: string): Promise<PrisonCodesResult> {
    return this.mailboxRegisterApiClientBuilder(token).listPrisonCodes()
  }

  public async listOffenderManagementUnitMailboxes(token: string): Promise<OffenderManagementUnitMailbox[]> {
    return this.mailboxRegisterApiClientBuilder(token).listOffenderManagementUnitMailboxes()
  }

  public async createOffenderManagementUnitMailbox(
    token: string,
    mailbox: CreateOffenderManagementUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).createOffenderManagementUnitMailbox(mailbox)
  }

  public async updateOffenderManagementUnitMailbox(
    token: string,
    id: string,
    mailbox: CreateOffenderManagementUnitMailboxRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).updateOffenderManagementUnitMailbox(id, mailbox)
  }

  public async getOffenderManagementUnitMailbox(token: string, id: string): Promise<OffenderManagementUnitMailbox> {
    return this.mailboxRegisterApiClientBuilder(token).getOffenderManagementUnitMailbox(id)
  }

  public async deleteOffenderManagementUnitMailbox(token: string, id: string): Promise<void> {
    return this.mailboxRegisterApiClientBuilder(token).deleteOffenderManagementUnitMailbox(id)
  }

  public async createProbationTeam(
    token: string,
    probationTeam: CreateProbationTeamRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).createProbationTeam(probationTeam)
  }

  public async updateProbationTeam(
    token: string,
    id: string,
    probationTeam: CreateProbationTeamRequest,
  ): Promise<MailboxRegisterResponse> {
    return this.mailboxRegisterApiClientBuilder(token).updateProbationTeam(id, probationTeam)
  }

  public async getProbationTeam(token: string, id: string): Promise<ProbationTeam> {
    return this.mailboxRegisterApiClientBuilder(token).getProbationTeam(id)
  }

  public async listProbationTeams(token: string): Promise<ProbationTeam[]> {
    return this.mailboxRegisterApiClientBuilder(token).listProbationTeams()
  }

  public async deleteProbationTeam(token: string, id: string): Promise<void> {
    return this.mailboxRegisterApiClientBuilder(token).deleteProbationTeam(id)
  }
}
