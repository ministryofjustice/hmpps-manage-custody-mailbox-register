import AuthRole from '../../server/data/authRole'
import IndexPage from '../pages'

describe('Homepage cards', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  context('User with PRISON role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
      cy.signIn()
    })

    // TODO: Adapt this test once we are using the PROBATION role
    it('Shows the LDU card but not the OMU card', () => {
      const page = new IndexPage()
      page.lduMailboxes().should('exist')
      page.omuMailboxes().should('exist')
    })
  })

  context('User with PROBATION role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.PROBATION] })
      cy.signIn()
    })

    // TODO: Adapt this test once we are using the PROBATION role
    it('Shows the OMU card but not the LDU card', () => {
      const page = new IndexPage()
      page.lduMailboxes().should('not.exist')
      page.omuMailboxes().should('not.exist')
    })
  })

  context('User with ADMIN role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.ADMIN] })
      cy.signIn()
    })

    it('Shows the LDU card and the OMU card', () => {
      const page = new IndexPage()
      page.lduMailboxes().should('exist')
      page.omuMailboxes().should('exist')
    })
  })

  context('User with an unrecognised role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: ['ROLE_FOOBAR'] })
      cy.signIn()
    })

    it('Hides the LDU card and the OMU card', () => {
      const page = new IndexPage()
      page.lduMailboxes().should('not.exist')
      page.omuMailboxes().should('not.exist')
    })
  })
})
