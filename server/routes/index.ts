import { Router } from 'express'

import type { Services } from '../services'
import type { CreateLocalDeliveryUnitMailboxRequest } from '../@types/mailboxRegisterApiClientTypes'

export default function routes({ mailboxRegisterService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => res.render('pages/index'))

  router.get('/local-delivery-unit-mailboxes', async (req, res, next) => res.render('pages/lduMailboxes/index'))
  router.post('/local-delivery-unit-mailboxes', async (req, res, next) => {
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

    res.redirect('/local-delivery-unit-mailboxes')
  })

  router.get('/local-delivery-unit-mailboxes/new', async (req, res, next) => res.render('pages/lduMailboxes/new'))

  return router
}
