import { jwtDecode } from 'jwt-decode'
import express from 'express'
import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import { convertToTitleCase } from '../utils/utils'
import logger from '../../logger'

export default function setUpCurrentUser() {
  const router = express.Router()

  router.use((req, res, next) => {
    try {
      const {
        name,
        user_id: userIdClaim,
        user_uuid: userUuidClaim,
        authorities: roles = [],
      } = jwtDecode<{
        name?: string
        user_id?: unknown
        user_uuid?: unknown
        authorities?: string[]
      }>(res.locals.user.token)

      const userId = typeof userIdClaim === 'string' && userIdClaim.trim() ? userIdClaim : undefined
      const userUuid = typeof userUuidClaim === 'string' && userUuidClaim.trim() ? userUuidClaim : undefined

      res.locals.user = {
        ...res.locals.user,
        userId,
        userUuid,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = parseInt(userId, 10) || undefined
      }

      const attributes: Record<string, string> = {
        ...(userId && { userId }),
        ...(userUuid && { userUuid }),
      }
      if (Object.keys(attributes).length) {
        telemetry.setSpanAttributes(attributes)
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  })

  return router
}
