import nock from 'nock'
import config from '../../config'
import { MailboxRegisterApiClient } from '../'
import { LocalDeliveryUnitMailbox } from '../../@types/mailboxRegisterApiClientTypes'
import { createLduMailbox } from '../testutils/testObjects'
import { mockRequest } from '../../routes/testutils/requestTestUtils'

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let mailboxRegisterApiClient: MailboxRegisterApiClient
  const mailbox = createLduMailbox({})
  const req = mockRequest({})

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.mailboxRegisterApiClient.url)
    // @ts-expect-error
    mailboxRegisterApiClient = new MailboxRegisterApiClient(req.middleware.clientToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('create mailboxes', () => {
    it('should create an LDU mailbox', async () => {
      const response: { data: LocalDeliveryUnitMailbox } = {
        data: mailbox,
      }

      fakeComponentsApi
        .post(`/local-delivery-unit-mailboxes`)
        // @ts-expect-error
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(201, response)

      const output = await mailboxRegisterApiClient.createLocalDeliveryUnitMailbox(mailbox)
      expect(output).toEqual(response)
    })
  })
})
