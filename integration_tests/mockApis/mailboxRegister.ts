import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const apiPrefix = '/mailbox-register-api'
const lduBaseUri = 'local-delivery-unit-mailboxes'
const omuBaseUri = 'offender-management-unit-mailboxes'
const probationTeamsUri = 'probation-teams'
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

const probationTeam = {
  id: '123',
  teamCode: 'XYZ',
  emailAddress: 'pt@example.com',
  localDeliveryUnitMailbox: lduMailbox,
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

  stubCreateProbationTeam: (httpStatus = 201): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: `${apiPrefix}/${probationTeamsUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: probationTeam,
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

  stubListProbationTeams: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${probationTeamsUri}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: [probationTeam],
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

  stubGetOmuMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${omuBaseUri}/${omuMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: omuMailbox,
      },
    }),

  stubGetProbationTeam: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `${apiPrefix}/${probationTeamsUri}/${probationTeam.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: probationTeam,
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

  stubDeleteOmuMailbox: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'DELETE',
        urlPattern: `${apiPrefix}/${omuBaseUri}/${omuMailbox.id}`,
      },
      response: {
        status: httpStatus,
        headers,
        jsonBody: {},
      },
    }),

  stubDeleteProbationTeam: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'DELETE',
        urlPattern: `${apiPrefix}/${probationTeamsUri}/${probationTeam.id}`,
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
