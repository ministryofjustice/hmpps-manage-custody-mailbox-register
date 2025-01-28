import Page, { PageElement } from './page'

export default class OmuMailboxesPage extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - OMU Mailboxes')
  }

  createNewOmuMailbox = (): PageElement => cy.get('a').contains('Create new Offender Management Unit Mailbox')

  mailboxes = () => cy.get('td[data-qa=name-column] a.govuk-link')

  emailAddresses = () =>
    cy.get('[data-qa=email-column]').then(cells => cells.map((index, cell) => cell.innerText).get())
}
