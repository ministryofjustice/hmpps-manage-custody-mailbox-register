import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const apiPrefix = '/mailbox-register-api'
const lduBaseUri = 'local-delivery-unit-mailboxes'
const omuBaseUri = 'offender-managment-unit-mailboxes'
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

const omuMailbox = {
  id: '123',
  name: 'Test OMU',
  emailAddress: 'omu@example.com',
  prisonCode: 'LEI',
  role: 'CVL',
}

const prisonCodes = {
  LEI: 'Leeds',
  WHI: 'Woodhill',
  WMI: 'Wymott',
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
        urlPattern: `${apiPrefix}/${lduBaseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: lduMailbox,
      },
    }),

  stubCreateOmuMailbox: (httpStatus = 201): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `${apiPrefix}/${omuBaseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: omuMailbox,
      },
    }),

  stubListLduMailboxes: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${lduBaseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: [lduMailbox],
      },
    }),

  stubListOmuMailboxes: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${omuBaseUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: [omuMailbox],
      },
    }),

  stubGetLduMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${lduBaseUri}/${lduMailbox.id}`,
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
        urlPattern: `${apiPrefix}/${lduBaseUri}/${lduMailbox.id}`,
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
        urlPattern: `${apiPrefix}/${lduBaseUri}/${lduMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: {},
      },
    }),

  stubListPrisonCodes: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/prison-codes`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: { prisons: prisonCodes },
      },
    }),
}
