import { body, matchedData } from 'express-validator'
import { RequestHandler, RequestHandlerWithServices } from '../../services'
import { validatedRequest } from '../../services/validation'

export const index: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    // @ts-expect-error - temporary linting bypass
    const mailboxes = await mailboxRegisterService.listLocalDeliveryUnitMailboxes(req?.middleware?.clientToken)

    res.render('pages/lduMailboxes/index', { mailboxes })
  }

export const create: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    {
      validations: [
        body('name'),
        body('emailAddress').isEmail().withMessage('Please enter a valid email address'),
        body('country'),
        body('unitCode').notEmpty().withMessage('Please enter the unit code'),
        body('areaCode').notEmpty().withMessage('Please enter the area code'),
      ],
      onValidationErrorRedirectTo: '/local-delivery-unit-mailboxes/new',
    },
    async (req, res, next) => {
      const { name, emailAddress, country, unitCode, areaCode } = matchedData(req)

      const mailbox = {
        name,
        emailAddress,
        country,
        unitCode,
        areaCode,
      }

      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.createLocalDeliveryUnitMailbox(req?.middleware?.clientToken, mailbox)

      return res.redirect('/local-delivery-unit-mailboxes')
    },
  )

export const newMailbox: RequestHandler = async (req, res, next) => res.render('pages/lduMailboxes/new')

export const edit: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params

    // @ts-expect-error - temporary linting bypass
    const mailbox = await mailboxRegisterService.getLocalDeliveryUnitMailbox(req?.middleware?.clientToken, id)

    res.render('pages/lduMailboxes/edit', { mailbox })
  }

export const update: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    {
      validations: [],
      onValidationErrorRedirectTo: '/local-delivery-unit-mailboxes/:id/edit',
    },
    async (req, res, next) => {
      const { name, emailAddress, country, unitCode, areaCode } = req.body
      const { id } = req.params

      const mailbox = {
        name,
        emailAddress,
        country,
        unitCode,
        areaCode,
      }

      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.updateLocalDeliveryUnitMailbox(req?.middleware?.clientToken, id, mailbox)

      res.redirect('/local-delivery-unit-mailboxes')
    },
  )

export const confirmDelete: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params

    // @ts-expect-error - temporary linting bypass
    const mailbox = await mailboxRegisterService.getLocalDeliveryUnitMailbox(req?.middleware?.clientToken, id)

    res.render('pages/lduMailboxes/delete', { mailbox })
  }

export const deleteMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params

    // @ts-expect-error - temporary linting bypass
    await mailboxRegisterService.deleteLocalDeliveryUnitMailbox(req?.middleware?.clientToken, id)

    res.redirect('/local-delivery-unit-mailboxes')
  }
