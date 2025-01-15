import Page, { PageElement } from './page'

export default class NewLduMailboxPage extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - New LDU Mailbox')
  }

  nameTextInput = (): PageElement => cy.get('input[name="name"]')

  emailAddressTextInput = (): PageElement => cy.get('input[name="emailAddress"]')

  countryTextInput = (): PageElement => cy.get('input[name="country"]')

  unitCodeTextInput = (): PageElement => cy.get('input[name="unitCode"]')

  areaCodeTextInput = (): PageElement => cy.get('input[name="areaCode"]')

  submitButton = (): PageElement => cy.get('button[type="submit"]')
}
