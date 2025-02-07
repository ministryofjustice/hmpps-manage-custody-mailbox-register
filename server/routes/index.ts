import { RequestHandler, Router } from 'express'
import { Services } from '../services'
import * as home from './home/controller'
import * as localDeliveryUnitMailboxes from './localDeliveryUnitMailboxes/controller'
import * as offenderManagementUnitMailboxes from './offenderManagementUnitMailboxes/controller'
import * as probationTeams from './probationTeams/controller'
import asyncMiddleware from '../middleware/asyncMiddleware'
import roleCheckMiddleware from '../middleware/roleCheckMiddleware'
import AuthRole from '../data/authRole'

export default (services: Services): Router => {
  const router = Router()

  const prisonOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PRISON, AuthRole.ADMIN])
  const probationOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PROBATION, AuthRole.ADMIN])

  const get = (path: string, ...handlers: RequestHandler[]) => router.get(path, handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(path, handlers.map(asyncMiddleware))
  const destroy = (path: string, ...handlers: RequestHandler[]) => router.delete(path, handlers.map(asyncMiddleware))

  get('/', home.index)

  get('/local-delivery-unit-mailboxes', prisonOrAdminRoleCheck, localDeliveryUnitMailboxes.index(services))
  get('/local-delivery-unit-mailboxes/new', prisonOrAdminRoleCheck, localDeliveryUnitMailboxes.newMailbox)
  post('/local-delivery-unit-mailboxes', prisonOrAdminRoleCheck, localDeliveryUnitMailboxes.create(services))
  get('/local-delivery-unit-mailboxes/:id/edit', prisonOrAdminRoleCheck, localDeliveryUnitMailboxes.edit(services))
  post('/local-delivery-unit-mailboxes/:id', prisonOrAdminRoleCheck, localDeliveryUnitMailboxes.update(services))
  get(
    '/local-delivery-unit-mailboxes/:id/delete',
    prisonOrAdminRoleCheck,
    localDeliveryUnitMailboxes.confirmDelete(services),
  )
  destroy(
    '/local-delivery-unit-mailboxes/:id',
    prisonOrAdminRoleCheck,
    localDeliveryUnitMailboxes.deleteMailbox(services),
  )

  get('/offender-management-unit-mailboxes', probationOrAdminRoleCheck, offenderManagementUnitMailboxes.index(services))
  get(
    '/offender-management-unit-mailboxes/new',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.newMailbox(services),
  )
  post(
    '/offender-management-unit-mailboxes',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.create(services),
  )
  get(
    '/offender-management-unit-mailboxes/:id/edit',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.edit(services),
  )
  post(
    '/offender-management-unit-mailboxes/:id',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.update(services),
  )
  get(
    '/offender-management-unit-mailboxes/:id/delete',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.confirmDelete(services),
  )
  destroy(
    '/offender-management-unit-mailboxes/:id',
    probationOrAdminRoleCheck,
    offenderManagementUnitMailboxes.deleteMailbox(services),
  )

  get('/probation-teams', prisonOrAdminRoleCheck, probationTeams.index(services))
  get('/probation-teams/new', prisonOrAdminRoleCheck, probationTeams.newProbationTeam(services))
  post('/probation-teams', prisonOrAdminRoleCheck, probationTeams.create(services))
  get('/probation-teams/:id/edit', prisonOrAdminRoleCheck, probationTeams.edit(services))
  post('/probation-teams/:id', prisonOrAdminRoleCheck, probationTeams.update(services))

  return router
}
