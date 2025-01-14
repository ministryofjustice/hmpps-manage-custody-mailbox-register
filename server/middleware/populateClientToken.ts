import { RequestHandler } from 'express'
import logger from '../../logger'
import { HmppsAuthClient } from '../data'

export default function populateClientToken(hmppsAuthClient: HmppsAuthClient): RequestHandler {
  return async (req, res, next) => {
    try {
      if (res.locals.user) {
        const clientToken = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
        if (clientToken) {
          // @ts-ignore
          req.middleware = { ...req.middleware, clientToken }
        } else {
          logger.info('No client token available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve client token for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}
