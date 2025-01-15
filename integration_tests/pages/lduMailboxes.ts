import Page, { PageElement } from './page'

export default class LduMailboxesPage extends Page {
  public constructor() {
    super('HMPPS Mailbox Register - LDU Mailboxes')
  }

  createNewLduMailbox = (): PageElement => cy.get('a').contains('Create new Local Delivery Unit Mailbox')

  emailAddresses = () => cy.get('table td.email-column').then(cells => cells.map((index, cell) => cell.innerText).get())
}
