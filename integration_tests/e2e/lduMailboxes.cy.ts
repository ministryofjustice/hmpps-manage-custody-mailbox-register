import IndexPage from '../pages/index'

context('Creating an LDU mailbox', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('blah blah blah', () => {
    cy.visit('/')
    const page = new IndexPage()
    page.lduMailboxes().click()
  })
})
