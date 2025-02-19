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

export const edit: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const probationTeam = await mailboxRegisterService.getProbationTeam(clientToken(req), req.params.id)
    const localDeliveryUnitMailboxes = await mailboxRegisterService.listLocalDeliveryUnitMailboxes(clientToken(req))
    const localDeliveryUnitMailboxOptions = localDeliveryUnitMailboxes.map(({ id, emailAddress }) => {
      return { text: emailAddress, value: id, selected: id === probationTeam.localDeliveryUnitMailbox.id }
    })
    localDeliveryUnitMailboxOptions.unshift({ text: 'Please Select', value: null, selected: false })
    res.render('pages/probationTeams/edit', { probationTeam, localDeliveryUnitMailboxOptions })
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

export const update: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest({ validations, onValidationErrorRedirectTo: '/probation-teams/:id/edit' }, async (req, res) => {
    const { id } = req.params
    const { emailAddress, teamCode, localDeliveryUnitMailboxId } = matchedData(req)
    const probationTeam = { emailAddress, teamCode, localDeliveryUnitMailboxId }
    await mailboxRegisterService.updateProbationTeam(clientToken(req), id, probationTeam)
    res.redirect('/probation-teams')
  })

export const confirmDelete: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const probationTeam = await mailboxRegisterService.getProbationTeam(clientToken(req), req.params.id)
    res.render('pages/probationTeams/delete', { probationTeam })
  }

export const deleteProbationTeam: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const { id } = req.params
    await mailboxRegisterService.deleteProbationTeam(clientToken(req), id)
    res.redirect('/probation-teams')
  }

const validations = [
  body('teamCode').notEmpty().withMessage('Please enter a team code'),
  body('emailAddress').isEmail().withMessage('Please enter a valid email address'),
  body('localDeliveryUnitMailboxId').notEmpty().withMessage('Please select a Local Delivery Unit'),
]
