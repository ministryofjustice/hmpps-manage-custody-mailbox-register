import Page, { PageElement } from './page'

export default class DeleteLduMailboxPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Delete LDU Mailbox')
  }

  submitButton = (): PageElement => cy.get('button[type="submit"]')
}
