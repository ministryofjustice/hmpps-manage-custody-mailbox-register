import ProbationTeamForm from './probationTeamForm'

export default class EditProbationTeamPage extends ProbationTeamForm {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Edit Probation Team')
  }

  deleteLink = () => cy.get('a').contains('Delete')
}
