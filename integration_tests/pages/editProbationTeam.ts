import { PageElement } from './page'
import ProbationTeamForm from './probationTeamForm'

export default class EditProbationTeamPage extends ProbationTeamForm {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Edit Probation Team')
  }

  deleteLink = (): PageElement => cy.get('a').contains('Delete')
}
