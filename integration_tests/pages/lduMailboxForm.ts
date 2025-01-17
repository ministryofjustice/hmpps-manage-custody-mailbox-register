import Page, { PageElement } from './page'
import { CreateLocalDeliveryUnitMailboxRequest } from '../../server/@types/mailboxRegisterApiClientTypes'

export default class LduMailboxForm extends Page {
  submitMailbox(mailbox: CreateLocalDeliveryUnitMailboxRequest) {
    this.nameTextInput().clear().type(mailbox.name)
    this.emailAddressTextInput().clear().type(mailbox.emailAddress)
    this.countryTextInput().clear().type(mailbox.country)
    this.unitCodeTextInput().clear().type(mailbox.unitCode)
    this.areaCodeTextInput().clear().type(mailbox.areaCode)
    this.submitButton().click()
  }

  private nameTextInput = (): PageElement => cy.get('input[name="name"]')

  private emailAddressTextInput = (): PageElement => cy.get('input[name="emailAddress"]')

  private countryTextInput = (): PageElement => cy.get('input[name="country"]')

  private unitCodeTextInput = (): PageElement => cy.get('input[name="unitCode"]')

  private areaCodeTextInput = (): PageElement => cy.get('input[name="areaCode"]')

  private submitButton = (): PageElement => cy.get('button[type="submit"]')
}
