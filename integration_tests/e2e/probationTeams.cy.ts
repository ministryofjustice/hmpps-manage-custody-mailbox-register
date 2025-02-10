import IndexPage from '../pages/index'
import AuthRole from '../../server/data/authRole'
import ProbationTeamsPage from '../pages/probationTeams'
import EditProbationTeamPage from '../pages/editProbationTeam'
import DeleteProbationTeamPage from '../pages/deleteProbationTeam'
import NewProbationTeamPage from '../pages/newProbationTeam'

context('Creating a probation team', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubListLduMailboxes')
    cy.task('stubCreateProbationTeam')
    cy.task('stubListProbationTeams')
  })

  it('Denies access to user without the PRISON role', () => {
    cy.task('stubSignIn', { roles: [] })
    cy.signIn()

    cy.visit('/probation-teams', { failOnStatusCode: false })
    cy.url().should('contain', '/access-denied')
  })

  it('Enters the details and submits the form', () => {
    cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
    cy.signIn()

    const page = new IndexPage()
    page.probationTeams().click()

    const probationTeamsPage = new ProbationTeamsPage()
    probationTeamsPage.createNewProbationTeam().click()

    const newProbationTeamPage = new NewProbationTeamPage()
    newProbationTeamPage.submitProbationTeam({
      teamCode: 'XYZ',
      emailAddress: 'pt@example.com',
      localDeliveryUnitMailboxId: '123',
    })

    probationTeamsPage.emailAddresses().should('contain', 'pt@example.com')
    probationTeamsPage.lduNames().should('contain', 'Test LDU')
  })
})

context('Deleting a probation team', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthRole.PRISON] })
    cy.task('stubListLduMailboxes')
    cy.task('stubListProbationTeams')
    cy.task('stubGetProbationTeam')
    cy.task('stubDeleteProbationTeam')
    cy.signIn()
  })

  it('Shows confirmation page and deletes the probation team', () => {
    cy.visit('/')

    const page = new IndexPage()
    page.probationTeams().click()

    const probationTeamsPage = new ProbationTeamsPage()
    probationTeamsPage.teams().first().click()

    const editProbationTeamPage = new EditProbationTeamPage()
    editProbationTeamPage.deleteLink().click()

    const deleteProbationTeamPage = new DeleteProbationTeamPage()
    cy.contains('pt@example.com').should('be.visible')
    deleteProbationTeamPage.submitButton().click()

    // Redirects back to the list of probation teams
    cy.url().should('contain', '/probation-teams')
  })
})
