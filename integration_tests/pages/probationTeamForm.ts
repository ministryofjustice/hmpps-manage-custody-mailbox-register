import Page, { PageElement } from './page'
import { CreateProbationTeamRequest } from '../../server/@types/mailboxRegisterApiClientTypes'

export default class ProbationTeamForm extends Page {
  submitProbationTeam(probationTeam: CreateProbationTeamRequest) {
    this.teamCodeInput().clear().type(probationTeam.teamCode)
    this.emailAddressTextInput().clear().type(probationTeam.emailAddress)
    this.lduIdInput().select(probationTeam.localDeliveryUnitMailboxId)
    this.submitButton().click()
  }

  private teamCodeInput = (): PageElement => cy.get('input[name="teamCode"]')

  private emailAddressTextInput = (): PageElement => cy.get('input[name="emailAddress"]')

  private lduIdInput = (): PageElement => cy.get('select[name="localDeliveryUnitMailboxId"]')

  private submitButton = (): PageElement => cy.get('button[type="submit"]')
}
