import { RequestHandler, Router } from 'express'
import { Services } from '../services'
import * as localDeliveryUnitMailboxes from './localDeliveryUnitMailboxes/controller'
import * as offenderManagementUnitMailboxes from './offenderManagementUnitMailboxes/controller'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default (services: Services): Router => {
  const router = Router()

  const get = (path: string, ...handlers: RequestHandler[]) => router.get(path, handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(path, handlers.map(asyncMiddleware))
  const destroy = (path: string, ...handlers: RequestHandler[]) => router.delete(path, handlers.map(asyncMiddleware))

  get('/', async (req, res, next) => res.render('pages/index'))
  get('/local-delivery-unit-mailboxes', localDeliveryUnitMailboxes.index(services))
  get('/local-delivery-unit-mailboxes/new', localDeliveryUnitMailboxes.newMailbox)
  post('/local-delivery-unit-mailboxes', localDeliveryUnitMailboxes.create(services))
  get('/local-delivery-unit-mailboxes/:id/edit', localDeliveryUnitMailboxes.edit(services))
  post('/local-delivery-unit-mailboxes/:id', localDeliveryUnitMailboxes.update(services))
  get('/local-delivery-unit-mailboxes/:id/delete', localDeliveryUnitMailboxes.confirmDelete(services))
  destroy('/local-delivery-unit-mailboxes/:id', localDeliveryUnitMailboxes.deleteMailbox(services))

  get('/offender-management-unit-mailboxes', offenderManagementUnitMailboxes.index)
  get('/offender-management-unit-mailboxes/new', offenderManagementUnitMailboxes.newMailbox(services))

  return router
}
