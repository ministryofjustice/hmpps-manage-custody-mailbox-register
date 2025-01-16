import IndexPage from '../pages/index'
import LduMailboxesPage from '../pages/lduMailboxes'
import NewLduMailboxPage from '../pages/newLduMailbox'

context('Creating an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubCreateLduMailbox')
    cy.task('stubListLduMailboxes')
    cy.signIn()
  })

  it('Enters the details and submits the form', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.lduMailboxes().click()

    const lduMailboxesPage = new LduMailboxesPage()
    lduMailboxesPage.createNewLduMailbox().click()

    const newLduMailboxPage = new NewLduMailboxPage()
    newLduMailboxPage.submitNewMailbox({
      name: 'Test LDU',
      emailAddress: 'ldu@example.com',
      country: 'England',
      unitCode: 'OTHERLDU',
      areaCode: 'OTHERAREA',
    })

    lduMailboxesPage.emailAddresses().should('contain', 'ldu@example.com')
  })
})
