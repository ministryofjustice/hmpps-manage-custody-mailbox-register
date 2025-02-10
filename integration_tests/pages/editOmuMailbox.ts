import { PageElement } from './page'
import OmuMailboxForm from './omuMailboxForm'

export default class EditOmuMailboxPage extends OmuMailboxForm {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Edit OMU Mailbox')
  }

  deleteLink = (): PageElement => cy.get('a').contains('Delete')
}
