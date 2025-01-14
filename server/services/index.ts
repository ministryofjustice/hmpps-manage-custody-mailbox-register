import { dataAccess } from '../data'
import AuditService from './auditService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  return {
    applicationInfo,
    auditService,
    hmppsAuthClient,
  }
}

export type Services = ReturnType<typeof services>
