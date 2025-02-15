import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  public constructor() {
    super('HMPPS Manage Custody Mailbox Register - Home')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  probationTeams = (): PageElement => cy.get('a').contains('Probation Teams')

  lduMailboxes = (): PageElement => cy.get('a').contains('Local Delivery Units')

  omuMailboxes = (): PageElement => cy.get('a').contains('Offender Management Units')
}
