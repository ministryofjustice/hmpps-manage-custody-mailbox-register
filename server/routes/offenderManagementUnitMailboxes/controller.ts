import { RequestHandler } from 'express'
import { body, matchedData } from 'express-validator'
import { RequestHandlerWithServices } from '../../services'
import { prisonCodeOptions } from './prisons'
import { validatedRequest } from '../../services/validation'
import { clientToken } from '../clientToken'

export const index: RequestHandler = async (req, res, next) => res.render('pages/omuMailboxes/index')

export const newMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const prisonCodes = await mailboxRegisterService.listPrisonCodes(clientToken(req))
    const prisonOptions = prisonCodeOptions(prisonCodes, res.locals.submittedForm?.prisonCode)
    res.render('pages/omuMailboxes/new', { prisonOptions })
  }

export const create: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    { validations, onValidationErrorRedirectTo: '/offender-management-unit-mailboxes/new' },
    async (req, res) => {
      const { name, emailAddress, prisonCode, role } = matchedData(req)
      const mailbox = { name, emailAddress, prisonCode, role }
      await mailboxRegisterService.createOffenderManagementUnitMailbox(clientToken(req), mailbox)
      return res.redirect('/offender-management-unit-mailboxes')
    },
  )

export const edit: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const mailbox = await mailboxRegisterService.getOffenderManagementUnitMailbox(clientToken(req), req.params.id)
    const prisonCodes = await mailboxRegisterService.listPrisonCodes(clientToken(req))
    const prisonOptions = prisonCodeOptions(prisonCodes, mailbox.prisonCode)
    res.render('pages/omuMailboxes/edit', { mailbox, prisonOptions })
  }

export const update: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    { validations, onValidationErrorRedirectTo: '/offender-management-unit-mailboxes/:id/edit' },
    async (req, res) => {
      const { name, emailAddress, prisonCode, role } = matchedData(req)
      const mailbox = { name, emailAddress, prisonCode, role }
      await mailboxRegisterService.updateOffenderManagementUnitMailbox(clientToken(req), req.params.id, mailbox)
      return res.redirect('/offender-management-unit-mailboxes')
    },
  )

export const confirmDelete: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const mailbox = await mailboxRegisterService.getOffenderManagementUnitMailbox(clientToken(req), req.params.id)
    res.render('pages/omuMailboxes/delete', { mailbox })
  }

export const deleteMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res) => {
    const { id } = req.params
    await mailboxRegisterService.deleteOffenderManagementUnitMailbox(clientToken(req), id)
    res.redirect('/offender-management-unit-mailboxes')
  }

const validations = [
  body('name').notEmpty().withMessage('Please enter a name'),
  body('emailAddress').isEmail().withMessage('Please enter a valid email address'),
  body('prisonCode').notEmpty().withMessage('Please select a prison'),
  body('role').notEmpty().withMessage('Please select a role / activity'),
]
