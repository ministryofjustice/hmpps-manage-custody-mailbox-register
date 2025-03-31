import { RequestHandler, Router } from 'express'
import { Services } from '../services'
import * as home from './home/controller'
import * as ldus from './localDeliveryUnitMailboxes/controller'
import * as omus from './offenderManagementUnitMailboxes/controller'
import * as probationTeams from './probationTeams/controller'
import asyncMiddleware from '../middleware/asyncMiddleware'
import roleCheckMiddleware from '../middleware/roleCheckMiddleware'
import AuthRole from '../data/authRole'

export default (services: Services): Router => {
  const router = Router()

  const adminRoleCheck = roleCheckMiddleware([AuthRole.MOIC_ADMIN, AuthRole.SUPPORT])
  const prisonOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PRISON, AuthRole.MOIC_ADMIN, AuthRole.SUPPORT])
  const probationOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PROBATION, AuthRole.MOIC_ADMIN, AuthRole.SUPPORT])

  const get = (path: string, ...handlers: RequestHandler[]) => router.get(path, handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(path, handlers.map(asyncMiddleware))
  const destroy = (path: string, ...handlers: RequestHandler[]) => router.delete(path, handlers.map(asyncMiddleware))

  get('/', home.index)

  get('/local-delivery-unit-mailboxes', prisonOrAdminRoleCheck, ldus.index(services))
  get('/local-delivery-unit-mailboxes/new', adminRoleCheck, ldus.newMailbox)
  post('/local-delivery-unit-mailboxes', adminRoleCheck, ldus.create(services))
  get('/local-delivery-unit-mailboxes/:id/edit', adminRoleCheck, ldus.edit(services))
  post('/local-delivery-unit-mailboxes/:id', adminRoleCheck, ldus.update(services))
  get('/local-delivery-unit-mailboxes/:id/delete', adminRoleCheck, ldus.confirmDelete(services))
  destroy('/local-delivery-unit-mailboxes/:id', adminRoleCheck, ldus.deleteMailbox(services))

  get('/offender-management-unit-mailboxes', probationOrAdminRoleCheck, omus.index(services))
  get('/offender-management-unit-mailboxes/new', adminRoleCheck, omus.newMailbox(services))
  post('/offender-management-unit-mailboxes', adminRoleCheck, omus.create(services))
  get('/offender-management-unit-mailboxes/:id/edit', adminRoleCheck, omus.edit(services))
  post('/offender-management-unit-mailboxes/:id', adminRoleCheck, omus.update(services))
  get('/offender-management-unit-mailboxes/:id/delete', adminRoleCheck, omus.confirmDelete(services))
  destroy('/offender-management-unit-mailboxes/:id', adminRoleCheck, omus.deleteMailbox(services))

  get('/probation-teams', prisonOrAdminRoleCheck, probationTeams.index(services))
  get('/probation-teams/new', adminRoleCheck, probationTeams.newProbationTeam(services))
  post('/probation-teams', adminRoleCheck, probationTeams.create(services))
  get('/probation-teams/:id/edit', adminRoleCheck, probationTeams.edit(services))
  post('/probation-teams/:id', adminRoleCheck, probationTeams.update(services))
  get('/probation-teams/:id/delete', adminRoleCheck, probationTeams.confirmDelete(services))
  destroy('/probation-teams/:id', adminRoleCheck, probationTeams.deleteProbationTeam(services))

  return router
}
