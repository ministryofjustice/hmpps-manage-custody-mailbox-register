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

  const prisonOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PRISON, AuthRole.MOIC_ADMIN, AuthRole.SUPPORT])
  const probationOrAdminRoleCheck = roleCheckMiddleware([AuthRole.PROBATION, AuthRole.MOIC_ADMIN, AuthRole.SUPPORT])

  const get = (path: string, ...handlers: RequestHandler[]) => router.get(path, handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(path, handlers.map(asyncMiddleware))
  const destroy = (path: string, ...handlers: RequestHandler[]) => router.delete(path, handlers.map(asyncMiddleware))

  get('/', home.index)

  get('/local-delivery-unit-mailboxes', prisonOrAdminRoleCheck, ldus.index(services))
  get('/local-delivery-unit-mailboxes/new', prisonOrAdminRoleCheck, ldus.newMailbox)
  post('/local-delivery-unit-mailboxes', prisonOrAdminRoleCheck, ldus.create(services))
  get('/local-delivery-unit-mailboxes/:id/edit', prisonOrAdminRoleCheck, ldus.edit(services))
  post('/local-delivery-unit-mailboxes/:id', prisonOrAdminRoleCheck, ldus.update(services))
  get('/local-delivery-unit-mailboxes/:id/delete', prisonOrAdminRoleCheck, ldus.confirmDelete(services))
  destroy('/local-delivery-unit-mailboxes/:id', prisonOrAdminRoleCheck, ldus.deleteMailbox(services))

  get('/offender-management-unit-mailboxes', probationOrAdminRoleCheck, omus.index(services))
  get('/offender-management-unit-mailboxes/new', probationOrAdminRoleCheck, omus.newMailbox(services))
  post('/offender-management-unit-mailboxes', probationOrAdminRoleCheck, omus.create(services))
  get('/offender-management-unit-mailboxes/:id/edit', probationOrAdminRoleCheck, omus.edit(services))
  post('/offender-management-unit-mailboxes/:id', probationOrAdminRoleCheck, omus.update(services))
  get('/offender-management-unit-mailboxes/:id/delete', probationOrAdminRoleCheck, omus.confirmDelete(services))
  destroy('/offender-management-unit-mailboxes/:id', probationOrAdminRoleCheck, omus.deleteMailbox(services))

  get('/probation-teams', prisonOrAdminRoleCheck, probationTeams.index(services))
  get('/probation-teams/new', prisonOrAdminRoleCheck, probationTeams.newProbationTeam(services))
  post('/probation-teams', prisonOrAdminRoleCheck, probationTeams.create(services))
  get('/probation-teams/:id/edit', prisonOrAdminRoleCheck, probationTeams.edit(services))
  post('/probation-teams/:id', prisonOrAdminRoleCheck, probationTeams.update(services))
  get('/probation-teams/:id/delete', prisonOrAdminRoleCheck, probationTeams.confirmDelete(services))
  destroy('/probation-teams/:id', prisonOrAdminRoleCheck, probationTeams.deleteProbationTeam(services))

  return router
}
