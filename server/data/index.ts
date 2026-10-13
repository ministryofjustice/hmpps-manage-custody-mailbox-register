/* eslint-disable import/first */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import applicationInfoSupplier from '../applicationInfo'
import MailboxRegisterApiClient from './mailboxes/mailboxRegisterApiClient'

const applicationInfo = applicationInfoSupplier()

import { createRedisClient } from './redisClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import logger from '../../logger'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    mailboxRegisterApiClientBuilder: (token: string) => new MailboxRegisterApiClient(token),
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, HmppsAuditClient, MailboxRegisterApiClient }
export type { RestClientBuilder }
