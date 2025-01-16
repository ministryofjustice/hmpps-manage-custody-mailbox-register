import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const lduMailbox = {
  id: '1',
  name: 'Test LDU',
  emailAddress: 'ldu@example.com',
  country: 'England',
  unitCode: 'OTHERLDU',
  areaCode: 'OTHERAREA',
  createdAt: '2024-06-06T12:14:48.465+01:00',
  updatedAt: '2024-06-06T12:14:48.465+01:00',
}

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
        jsonBody: lduMailbox,
      },
    }),

  stubListLduMailboxes: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/mailbox-register-api/local-delivery-unit-mailboxes',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [lduMailbox],
      },
    }),
}
