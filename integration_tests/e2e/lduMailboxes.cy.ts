import IndexPage from '../pages/index'
import LduMailboxesPage from '../pages/lduMailboxes'
import NewLduMailboxPage from '../pages/newLduMailbox'

context('Creating an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubCreateLduMailbox')
  })

  it('Enters the details and submits the form', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.lduMailboxes().click()

    const lduMailboxesPage = new LduMailboxesPage()
    lduMailboxesPage.createNewLduMailbox().click()

    const newLduMailboxPage = new NewLduMailboxPage()
    newLduMailboxPage.nameTextInput().type('Test LDU')
    newLduMailboxPage.emailAddressTextInput().type('ldu@example.com')
    newLduMailboxPage.countryTextInput().type('England')
    newLduMailboxPage.unitCodeTextInput().type('OTHERLDU')
    newLduMailboxPage.areaCodeTextInput().type('OTHERAREA')
    newLduMailboxPage.submitButton().click()

    lduMailboxesPage.emailAddresses().should('contain', 'ldu@example.com')
  })
})
