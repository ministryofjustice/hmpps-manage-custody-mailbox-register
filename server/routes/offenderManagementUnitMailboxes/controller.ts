import { RequestHandler } from 'express'
import { RequestHandlerWithServices } from '../../services'
import { prisonCodeOptions } from './prisons'

export const index: RequestHandler = async (req, res, next) => res.render('pages/omuMailboxes/index')

export const newMailbox: RequestHandlerWithServices =
  ({ mailboxRegisterService }) =>
  async (req, res, next) => {
    res.locals.prisonOptions = prisonCodeOptions(
      // @ts-expect-error - temporary linting bypass
      await mailboxRegisterService.listPrisonCodes(req?.middleware?.clientToken),
    )

    res.render('pages/omuMailboxes/new')
  }
