import { MailboxRegisterApiClient, HmppsAuthClient } from '..'

jest.mock('..')

const createMailboxRegisterApiClient = () =>
  new MailboxRegisterApiClient(null) as jest.Mocked<MailboxRegisterApiClient>

const createMockHmppsAuthClient = () =>
  new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

export { createMailboxRegisterApiClient, createMockHmppsAuthClient }
