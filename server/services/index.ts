import { RequestHandler } from 'express'
import { dataAccess } from '../data'
import AuditService from './auditService'
import MailboxRegisterService from './mailboxRegisterService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient, mailboxRegisterApiClientBuilder } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const mailboxRegisterService = new MailboxRegisterService(mailboxRegisterApiClientBuilder)

  return {
    applicationInfo,
    auditService,
    hmppsAuthClient,
    mailboxRegisterService,
  }
}

export type Services = ReturnType<typeof services>
export type RequestHandlerWithServices =
  | ((services: Services) => RequestHandler | RequestHandler[])
  | (() => RequestHandler | RequestHandler[])
export { RequestHandler }
