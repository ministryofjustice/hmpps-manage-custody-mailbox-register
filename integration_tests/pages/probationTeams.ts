import Page from './page'

export default class ProbationTeamsPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Probation Teams')
  }

  createNewProbationTeam = () => cy.get('a').contains('Create a new Probation Team')

  teams = () => cy.get('td[data-qa=email-column] a.govuk-link')

  emailAddresses = () =>
    cy.get('[data-qa=email-column]').then(cells => cells.map((index, cell) => cell.innerText).get())

  lduNames = () => cy.get('[data-qa=ldu-name-column]').then(cells => cells.map((index, cell) => cell.innerText).get())
}
