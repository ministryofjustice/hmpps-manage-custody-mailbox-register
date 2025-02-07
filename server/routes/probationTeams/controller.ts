import { body, matchedData } from 'express-validator'
import { RequestHandlerWithServices } from '../../services'
import { validatedRequest } from '../../services/validation'
import { clientToken } from '../clientToken'

export const newProbationTeam: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const localDeliveryUnitMailboxes = await mailboxRegisterService.listLocalDeliveryUnitMailboxes(clientToken(req))
    const localDeliveryUnitMailboxOptions = localDeliveryUnitMailboxes.map(({ id, emailAddress }) => {
      return { text: emailAddress, value: id }
    })
    localDeliveryUnitMailboxOptions.unshift({ text: 'Please Select', value: null })
    res.render('pages/probationTeams/new', { localDeliveryUnitMailboxOptions })
  }

export const index: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const probationTeams = await mailboxRegisterService.listProbationTeams(clientToken(req))
    res.render('pages/probationTeams/index', { probationTeams })
  }

export const create: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest({ validations, onValidationErrorRedirectTo: '/probation-teams/new' }, async (req, res) => {
    const { emailAddress, teamCode, localDeliveryUnitMailboxId } = matchedData(req)
    const probationTeam = { emailAddress, teamCode, localDeliveryUnitMailboxId }
    await mailboxRegisterService.createProbationTeam(clientToken(req), probationTeam)
    res.redirect('/probation-teams')
  })

const validations = [
  body('emailAddress').isEmail().withMessage('Please enter a valid email address'),
  body('teamCode').notEmpty().withMessage('Please enter a team code'),
  body('localDeliveryUnitMailboxId').notEmpty().withMessage('Please select a Local Delivery Unit'),
]
