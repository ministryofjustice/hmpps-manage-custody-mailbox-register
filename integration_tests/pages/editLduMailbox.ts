import LduMailboxForm from './lduMailboxForm'
import { PageElement } from './page'

export default class EditLduMailboxPage extends LduMailboxForm {
  public constructor() {
    super('HMPPS Mailbox Register - Edit LDU Mailbox')
  }

  deleteLink = (): PageElement => cy.get('a').contains('Delete')
}
