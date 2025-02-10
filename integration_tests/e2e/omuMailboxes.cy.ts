import IndexPage from '../pages/index'
import OmuMailboxesPage from '../pages/omuMailboxes'
import AuthRole from '../../server/data/authRole'
import NewOmuMailboxPage from '../pages/newOmuMailbox'
import EditOmuMailboxPage from '../pages/editOmuMailbox'
import DeleteOmuMailboxPage from '../pages/deleteOmuMailbox'

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

    const newOmuMailboxPage = new NewOmuMailboxPage()
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

context('Deleting an OMU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthRole.PROBATION] })
    cy.task('stubListPrisonCodes')
    cy.task('stubListOmuMailboxes')
    cy.task('stubGetOmuMailbox')
    cy.task('stubDeleteOmuMailbox')
    cy.signIn()
  })

  it('Shows confirmation page and deletes the OMU mailbox', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.omuMailboxes().click()

    const omuMailboxesPage = new OmuMailboxesPage()
    omuMailboxesPage.mailboxes().first().click()

    const editOmuMailboxPage = new EditOmuMailboxPage()
    editOmuMailboxPage.deleteLink().click()

    const deleteOmuMailboxPage = new DeleteOmuMailboxPage()
    cy.contains('Test OMU').should('be.visible')
    deleteOmuMailboxPage.submitButton().click()

    // Redirects back to the list of probation teams
    cy.url().should('contain', '/offender-management-unit-mailboxes')
  })
})
