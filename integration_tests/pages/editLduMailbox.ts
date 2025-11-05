import LduMailboxForm from './lduMailboxForm'

export default class EditLduMailboxPage extends LduMailboxForm {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Edit LDU Mailbox')
  }

  deleteLink = () => cy.get('a').contains('Delete')
}
