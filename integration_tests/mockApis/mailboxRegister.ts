import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const apiPrefix = '/mailbox-register-api'
const baseUri = 'local-delivery-unit-mailboxes'
const headers = { 'Content-Type': 'application/json;charset=UTF-8' }

const lduMailbox = {
  id: '123',
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
        urlPattern: `${apiPrefix}/health/ping`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubCreateLduMailbox: (httpStatus = 201): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `${apiPrefix}/${baseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: lduMailbox,
      },
    }),

  stubListLduMailboxes: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${baseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: [lduMailbox],
      },
    }),

  stubGetLduMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${baseUri}/${lduMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: lduMailbox,
      },
    }),

  stubUpdateLduMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PUT',
        urlPattern: `${apiPrefix}/${baseUri}/${lduMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: lduMailbox,
      },
    }),

  stubDeleteLduMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'DELETE',
        urlPattern: `${apiPrefix}/${baseUri}/${lduMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: {},
      },
    }),
}
