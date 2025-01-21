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
export type RequestHandlerWithServices = (services?: Services) => RequestHandler
export type MultipleRequestHandlerWithServices = (services?: Services) => RequestHandler[]
export type ValidatedRequestHandlerWithServices = MultipleRequestHandlerWithServices
export { RequestHandler }
