import Page, { PageElement } from './page'

export default class DeleteProbationTeamPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Delete Probation Team')
  }

  submitButton = (): PageElement => cy.get('button[type="submit"]')
}
