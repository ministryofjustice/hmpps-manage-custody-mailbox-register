import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'

export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => res.render('pages/index'))

  get('/local-delivery-unit-mailboxes', async (req, res, next) => res.render('pages/lduMailboxes/index'))
  post('/local-delivery-unit-mailboxes', async (req, res, next) => {
    const { name, emailAddress, country, unitCode, areaCode } = req.body
  })
  get('/local-delivery-unit-mailboxes/new', async (req, res, next) => res.render('pages/lduMailboxes/new'))

  return router
}
