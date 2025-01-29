import Page, { PageElement } from './page'
import { CreateOffenderManagementUnitMailboxRequest } from '../../server/@types/mailboxRegisterApiClientTypes'

export default class OmuMailboxForm extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - New OMU Mailbox')
  }

  submitMailbox(mailbox: CreateOffenderManagementUnitMailboxRequest) {
    this.nameTextInput().clear().type(mailbox.name)
    this.emailAddressTextInput().clear().type(mailbox.emailAddress)
    this.prisonCodeInput().select(mailbox.prisonCode)
    this.roleInput().check(mailbox.role)
    this.submitButton().click()
  }

  private nameTextInput = (): PageElement => cy.get('input[name="name"]')

  private emailAddressTextInput = (): PageElement => cy.get('input[name="emailAddress"]')

  private prisonCodeInput = (): PageElement => cy.get('select[name="prisonCode"]')

  private roleInput = (): PageElement => cy.get('input[name="role"]')

  private submitButton = (): PageElement => cy.get('button[type="submit"]')
}
