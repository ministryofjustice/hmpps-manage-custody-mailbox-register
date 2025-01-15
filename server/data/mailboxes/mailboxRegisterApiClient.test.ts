import nock from 'nock'
import config from '../../config'
import { MailboxRegisterApiClient } from '..'
import { LocalDeliveryUnitMailbox } from '../../@types/mailboxRegisterApiClientTypes'
import { createLduMailbox, returnLduMailbox } from '../testutils/mockLduMailboxes'
import { mockRequest } from '../../routes/testutils/requestTestUtils'

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let mailboxRegisterApiClient: MailboxRegisterApiClient
  const mailboxRequest = createLduMailbox({})
  const createdMailbox = returnLduMailbox({})
  const req = mockRequest({})

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.mailboxRegisterApi.url)
    // @ts-expect-error - temporary linting bypass
    mailboxRegisterApiClient = new MailboxRegisterApiClient(req.middleware.clientToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('create mailboxes', () => {
    it('should create an LDU mailbox', async () => {
      const response: { data: LocalDeliveryUnitMailbox } = {
        data: createdMailbox,
      }

      fakeComponentsApi
        .post(`/local-delivery-unit-mailboxes`)
        // @ts-expect-error - temporary linting bypass
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(201, response)

      const output = await mailboxRegisterApiClient.createLocalDeliveryUnitMailbox(mailboxRequest)
      expect(output).toEqual(response)
    })
  })
})
