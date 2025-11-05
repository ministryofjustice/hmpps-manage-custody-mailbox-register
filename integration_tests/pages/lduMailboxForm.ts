import Page from './page'
import { CreateLocalDeliveryUnitMailboxRequest } from '../../server/@types/mailboxRegisterApiClientTypes'

export default class LduMailboxForm extends Page {
  submitMailbox(mailbox: CreateLocalDeliveryUnitMailboxRequest) {
    this.nameTextInput().clear().type(mailbox.name)
    this.emailAddressTextInput().clear().type(mailbox.emailAddress)
    this.countrySelect().select(mailbox.country)
    this.unitCodeTextInput().clear().type(mailbox.unitCode)
    if (mailbox.areaCode != null) {
      this.areaCodeTextInput().clear().type(mailbox.areaCode)
    }
    this.submitButton().click()
  }

  private nameTextInput = () => cy.get('input[name="name"]')

  private emailAddressTextInput = () => cy.get('input[name="emailAddress"]')

  private countrySelect = () => cy.get('select[name="country"]')

  private unitCodeTextInput = () => cy.get('input[name="unitCode"]')

  private areaCodeTextInput = () => cy.get('input[name="areaCode"]')

  private submitButton = () => cy.get('button[type="submit"]')
}
