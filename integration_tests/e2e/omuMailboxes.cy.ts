import IndexPage from '../pages/index'
import OmuMailboxesPage from '../pages/omuMailboxes'
import OmuMailboxForm from '../pages/omuMailboxForm'
import AuthRole from '../../server/data/authRole'

context('Creating an OMU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateOmuMailbox')
    cy.task('stubListOmuMailboxes')
    cy.task('stubListPrisonCodes')
  })

  it('Denies access to user without the PROBATION role', () => {
    cy.task('stubSignIn', { roles: [] })
    cy.signIn()

    cy.visit('/offender-management-unit-mailboxes', { failOnStatusCode: false })
    cy.url().should('contain', '/access-denied')
  })

  it('Enters the details and submits the form', () => {
    cy.task('stubSignIn', { roles: [AuthRole.PROBATION] })
    cy.signIn()

    const page = new IndexPage()
    page.omuMailboxes().click()

    const omuMailboxesPage = new OmuMailboxesPage()
    omuMailboxesPage.createNewOmuMailbox().click()

    const newOmuMailboxPage = new OmuMailboxForm()
    newOmuMailboxPage.submitMailbox({
      name: 'Test OMU',
      emailAddress: 'omu@example.com',
      prisonCode: 'LEI',
      role: 'CVL',
    })

    omuMailboxesPage.emailAddresses().should('contain', 'omu@example.com')
    omuMailboxesPage.prisons().should('contain', 'Leeds')
  })
})
