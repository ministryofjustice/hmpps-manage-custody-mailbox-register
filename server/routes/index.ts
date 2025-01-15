import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import type { CreateLocalDeliveryUnitMailboxRequest } from '../@types/mailboxRegisterApiClientTypes'

export default function routes({ mailboxRegisterService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => res.render('pages/index'))

  get('/local-delivery-unit-mailboxes', async (req, res, next) => res.render('pages/lduMailboxes/index'))
  post('/local-delivery-unit-mailboxes', async (req, res, next) => {
    const { name, emailAddress, country, unitCode, areaCode } = req.body

    const mailbox: CreateLocalDeliveryUnitMailboxRequest = {
      name,
      emailAddress,
      country,
      unitCode,
      areaCode,
    }

    // @ts-expect-error - temporary linting bypass
    await mailboxRegisterService.createLocalDeliveryUnitMailbox(req?.middleware?.clientToken, mailbox)

    res.render('pages/index')
  })

  get('/local-delivery-unit-mailboxes/new', async (req, res, next) => res.render('pages/lduMailboxes/new'))

  return router
}
