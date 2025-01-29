import { RequestHandler } from 'express'
import { body, matchedData } from 'express-validator'
import { RequestHandlerWithServices } from '../../services'
import { prisonCodeOptions } from './prisons'
import { validatedRequest } from '../../services/validation'

export const index: RequestHandler = async (req, res, next) => res.render('pages/omuMailboxes/index')

export const newMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const prisonOptions = prisonCodeOptions(
      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.listPrisonCodes(req?.middleware?.clientToken),
      res.locals.submittedForm?.prisonCode,
    )
    res.render('pages/omuMailboxes/new', { prisonOptions })
  }

export const create: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    {
      validations: [
        body('name').notEmpty().withMessage('Please enter a name'),
        body('emailAddress').isEmail().withMessage('Please enter a valid email address'),
        body('prisonCode').notEmpty().withMessage('Please select a prison'),
        body('role').notEmpty().withMessage('Please select a role / activity'),
      ],
      onValidationErrorRedirectTo: '/offender-management-unit-mailboxes/new',
    },
    async (req, res, next) => {
      const { name, emailAddress, prisonCode, role } = matchedData(req)
      const mailbox = { name, emailAddress, prisonCode, role }

      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.createOffenderManagementUnitMailbox(req?.middleware?.clientToken, mailbox)

      return res.redirect('/offender-management-unit-mailboxes')
    },
  )

export const edit: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    // @ts-expect-error - temporary linting bypass
    const clientToken = req?.middleware?.clientToken
    const mailbox = await mailboxRegisterService.getOffenderManagementUnitMailbox(clientToken, req.params.id)
    const prisonCodes = await mailboxRegisterService.listPrisonCodes(clientToken)
    const prisonOptions = prisonCodeOptions(prisonCodes, mailbox.prisonCode)
    res.render('pages/omuMailboxes/edit', { mailbox, prisonOptions })
  }
