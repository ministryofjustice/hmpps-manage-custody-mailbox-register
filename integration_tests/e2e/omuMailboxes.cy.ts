import IndexPage from '../pages/index'
import OmuMailboxesPage from '../pages/omuMailboxes'
import OmuMailboxForm from '../pages/omuMailboxForm'

context('Creating an OMU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubCreateOmuMailbox')
    cy.task('stubListOmuMailboxes')
    cy.task('stubListPrisonCodes')
    cy.signIn()
  })

  it('Enters the details and submits the form', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.omuMailboxes().click()

    const omuMailboxesPage = new OmuMailboxesPage()
    omuMailboxesPage.createNewOmuMailbox().click()

    const newOmuMailboxPage = new OmuMailboxForm()
    newOmuMailboxPage.submitMailbox({
      name: 'Test LDU',
      emailAddress: 'ldu@example.com',
      prisonCode: 'LEI',
      role: 'CVL',
    })

    // omuMailboxesPage.emailAddresses().should('contain', 'ldu@example.com')
  })
})
