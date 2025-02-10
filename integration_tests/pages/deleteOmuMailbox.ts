import Page, { PageElement } from './page'

export default class DeleteOmuMailboxPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Delete OMU Mailbox')
  }

  submitButton = (): PageElement => cy.get('button[type="submit"]')
}
