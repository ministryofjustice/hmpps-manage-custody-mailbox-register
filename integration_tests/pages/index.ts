import Page from './page'

export default class IndexPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Home')
  }

  headerUserName = () => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = () => cy.get('[data-qa=header-phase-banner]')

  probationTeams = () => cy.get('a').contains('Probation Teams')

  lduMailboxes = () => cy.get('a').contains('Local Delivery Units')

  omuMailboxes = () => cy.get('a').contains('Offender Management Units')
}
