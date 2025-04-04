import { body, matchedData } from 'express-validator'
import { RequestHandler, RequestHandlerWithServices } from '../../services'
import { validatedRequest } from '../../services/validation'
import { clientToken } from '../clientToken'
import { hasAdminRole } from '../../utils/utils'

export const index: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const mailboxes = await mailboxRegisterService.listLocalDeliveryUnitMailboxes(clientToken(req))
    const viewContext = { hasAdminRole: hasAdminRole(req.user) }

    res.render('pages/lduMailboxes/index', { mailboxes, viewContext })
  }

export const create: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    { validations, onValidationErrorRedirectTo: '/local-delivery-unit-mailboxes/new' },
    async (req, res, next) => {
      const { name, emailAddress, country, unitCode, areaCode } = matchedData(req)

      const mailbox = {
        name,
        emailAddress,
        country,
        unitCode,
        areaCode,
      }

      await mailboxRegisterService.createLocalDeliveryUnitMailbox(clientToken(req), mailbox)

      return res.redirect('/local-delivery-unit-mailboxes')
    },
  )

export const newMailbox: RequestHandler = async (req, res, next) => res.render('pages/lduMailboxes/new')

export const edit: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params
    const mailbox = await mailboxRegisterService.getLocalDeliveryUnitMailbox(clientToken(req), id)

    res.render('pages/lduMailboxes/edit', { mailbox })
  }

export const update: RequestHandlerWithServices = ({ mailboxRegisterService }) =>
  validatedRequest(
    { validations, onValidationErrorRedirectTo: '/local-delivery-unit-mailboxes/:id/edit' },
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

      await mailboxRegisterService.updateLocalDeliveryUnitMailbox(clientToken(req), id, mailbox)

      res.redirect('/local-delivery-unit-mailboxes')
    },
  )

export const confirmDelete: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params
    const mailbox = await mailboxRegisterService.getLocalDeliveryUnitMailbox(clientToken(req), id)
    res.render('pages/lduMailboxes/delete', { mailbox })
  }

export const deleteMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    const { id } = req.params

    try {
      await mailboxRegisterService.deleteLocalDeliveryUnitMailbox(clientToken(req), id)
      res.redirect('/local-delivery-unit-mailboxes')
    } catch (error) {
      if (error.status === 400) {
        req.flash('error', error.data.errors.error)
        res.redirect(`/local-delivery-unit-mailboxes/${id}/delete`)
      } else {
        throw error
      }
    }
  }

export const validations = [
  body('name').trim().notEmpty().withMessage('Please enter a name'),
  body('emailAddress').trim().isEmail().withMessage('Please enter a valid email address'),
  body('country').trim().isIn(['England', 'Wales']).withMessage('Please select the country'),
  body('unitCode')
    .trim()
    .notEmpty()
    .withMessage('Please enter the unit code')
    .isAlphanumeric()
    .withMessage('Please enter only letters and numbers'),
  body('areaCode').optional().trim(),
]
