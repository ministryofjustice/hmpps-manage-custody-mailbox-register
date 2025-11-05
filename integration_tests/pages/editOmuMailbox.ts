import OmuMailboxForm from './omuMailboxForm'

export default class EditOmuMailboxPage extends OmuMailboxForm {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Edit OMU Mailbox')
  }

  deleteLink = () => cy.get('a').contains('Delete')
}
