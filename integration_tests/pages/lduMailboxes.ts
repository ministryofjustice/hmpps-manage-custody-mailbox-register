import Page, { PageElement } from './page'

export default class LduMailboxesPage extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - LDU Mailboxes')
  }

  createNewLduMailbox = (): PageElement => cy.get('a').contains('Create new Local Delivery Unit Mailbox')

  mailboxes = () => cy.get('td[data-qa=name-column] a.govuk-link')

  emailAddresses = () =>
    cy.get('[data-qa=email-column]').then(cells => cells.map((index, cell) => cell.innerText).get())
}
