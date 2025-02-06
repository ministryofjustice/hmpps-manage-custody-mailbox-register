import IndexPage from '../pages/index'
import LduMailboxesPage from '../pages/lduMailboxes'
import NewLduMailboxPage from '../pages/newLduMailbox'
import EditLduMailboxPage from '../pages/editLduMailbox'
import DeleteLduMailboxPage from '../pages/deleteLduMailbox'
import AuthRole from '../../server/data/authRole'

context('Creating an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
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
    newLduMailboxPage.submitMailbox({
      name: 'Test LDU',
      emailAddress: 'ldu@example.com',
      country: 'England',
      unitCode: 'OTHERLDU',
      areaCode: 'OTHERAREA',
    })

    lduMailboxesPage.emailAddresses().should('contain', 'ldu@example.com')
  })
})

context('Updating an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
    cy.task('stubListLduMailboxes')
    cy.task('stubGetLduMailbox')
    cy.task('stubUpdateLduMailbox')
    cy.signIn()
  })

  it('Enters the details and submits the form', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.lduMailboxes().click()

    const lduMailboxesPage = new LduMailboxesPage()
    lduMailboxesPage.mailboxes().first().click()

    const editLduMailboxPage = new EditLduMailboxPage()
    editLduMailboxPage.submitMailbox({
      name: 'Updated Test LDU',
      emailAddress: 'ldu@example.com',
      country: 'England',
      unitCode: 'OTHERLDU',
      areaCode: 'OTHERAREA',
    })

    // Redirects back to the list of mailboxes
    cy.url().should('contain', '/local-delivery-unit-mailboxes')
  })
})

context('Deleting an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
    cy.task('stubListLduMailboxes')
    cy.task('stubGetLduMailbox')
    cy.task('stubDeleteLduMailbox')
    cy.signIn()
  })

  it('Shows confirmation page and deletes the mailbox', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.lduMailboxes().click()

    const lduMailboxesPage = new LduMailboxesPage()
    lduMailboxesPage.mailboxes().first().click()

    const editLduMailboxPage = new EditLduMailboxPage()
    editLduMailboxPage.deleteLink().click()

    const deleteLduMailboxPage = new DeleteLduMailboxPage()
    cy.contains('Test LDU').should('be.visible')
    deleteLduMailboxPage.submitButton().click()

    // Redirects back to the list of mailboxes
    cy.url().should('contain', '/local-delivery-unit-mailboxes')
  })
})
