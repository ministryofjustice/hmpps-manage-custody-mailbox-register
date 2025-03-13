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

    it('Shows the Probation Teams card and the LDU card but not the OMU card', () => {
      const page = new IndexPage()
      page.probationTeams().should('exist')
      page.lduMailboxes().should('exist')
      page.omuMailboxes().should('not.exist')
    })
  })

  context('User with PROBATION role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.PROBATION] })
      cy.signIn()
    })

    it('Shows the OMU card but not the Probation Teams or LDU cards', () => {
      const page = new IndexPage()
      page.probationTeams().should('not.exist')
      page.lduMailboxes().should('not.exist')
      page.omuMailboxes().should('exist')
    })
  })

  context('User with MOIC_ADMIN role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.MOIC_ADMIN] })
      cy.signIn()
    })

    it('Shows all the cards', () => {
      const page = new IndexPage()
      page.probationTeams().should('exist')
      page.lduMailboxes().should('exist')
      page.omuMailboxes().should('exist')
    })
  })

  context('User with SUPPORT role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: [AuthRole.SUPPORT] })
      cy.signIn()
    })

    it('Shows all the cards', () => {
      const page = new IndexPage()
      page.probationTeams().should('exist')
      page.lduMailboxes().should('exist')
      page.omuMailboxes().should('exist')
    })
  })

  context('User with an unrecognised role', () => {
    beforeEach(() => {
      cy.task('stubSignIn', { roles: ['ROLE_FOOBAR'] })
      cy.signIn()
    })

    it('Hides all the cards', () => {
      const page = new IndexPage()
      page.probationTeams().should('not.exist')
      page.lduMailboxes().should('not.exist')
      page.omuMailboxes().should('not.exist')
    })
  })
})
