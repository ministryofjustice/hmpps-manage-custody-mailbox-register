import { RequestHandler } from 'express'
import { body, matchedData } from 'express-validator'
import { RequestHandlerWithServices } from '../../services'
import { prisonCodeOptions } from './prisons'
import { validatedRequest } from '../../services/validation'

export const index: RequestHandler = async (req, res, next) => res.render('pages/omuMailboxes/index')

export const newMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    res.locals.prisonOptions = prisonCodeOptions(
      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.listPrisonCodes(req?.middleware?.clientToken),
      res.locals.submittedForm.prisonCode,
    )
    res.locals.roleOptions = [
      { value: 'CVL', text: 'CVL', checked: res.locals.submittedForm.role === 'CVL' },
      { value: 'HDC', text: 'HDC', checked: res.locals.submittedForm.role === 'HDC' },
    ]

    res.render('pages/omuMailboxes/new')
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
