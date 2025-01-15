import Page, { PageElement } from './page'
import { CreateLocalDeliveryUnitMailboxRequest } from '../../server/@types/mailboxRegisterApiClientTypes'

export default class NewLduMailboxPage extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - New LDU Mailbox')
  }

  submitNewMailbox(newMailbox: CreateLocalDeliveryUnitMailboxRequest) {
    this.nameTextInput().type(newMailbox.name)
    this.emailAddressTextInput().type(newMailbox.emailAddress)
    this.countryTextInput().type(newMailbox.country)
    this.unitCodeTextInput().type(newMailbox.unitCode)
    this.areaCodeTextInput().type(newMailbox.areaCode)
    this.submitButton().click()
  }

  private nameTextInput = (): PageElement => cy.get('input[name="name"]')

  private emailAddressTextInput = (): PageElement => cy.get('input[name="emailAddress"]')

  private countryTextInput = (): PageElement => cy.get('input[name="country"]')

  private unitCodeTextInput = (): PageElement => cy.get('input[name="unitCode"]')

  private areaCodeTextInput = (): PageElement => cy.get('input[name="areaCode"]')

  private submitButton = (): PageElement => cy.get('button[type="submit"]')
}
