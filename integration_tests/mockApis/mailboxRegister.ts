import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubMailboxRegisterPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/mailbox-register-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubCreateLduMailbox: (httpStatus = 201): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/mailbox-register-api/local-delivery-unit-mailboxes',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    }),
}
