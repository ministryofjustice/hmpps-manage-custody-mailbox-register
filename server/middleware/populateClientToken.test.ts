import populateClientToken from './populateClientToken'
import { mockNext, mockRequest, mockResponse } from '../routes/testutils/requestTestUtils'
import { createMockHmppsAuthClient } from '../data/testutils/mocks'
import logger from '../../logger'

jest.mock('../../logger')

const token = 'token-1'
const req = mockRequest({ middleware: {} })
const res = mockResponse({
  locals: {
    user: {
      username: 'LocalName',
    },
  },
})
const next = mockNext()
const hmppsAuthClient = createMockHmppsAuthClient()

describe('authorisationMiddleware', () => {
  beforeEach(() => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return next and set token', async () => {
    await populateClientToken(hmppsAuthClient)(req, res, next)
    // @ts-expect-error
    expect(req.middleware.clientToken).toEqual(token)
    expect(next).toHaveBeenCalled()
  })

  it('should return next and log info', async () => {
    hmppsAuthClient.getSystemClientToken.mockResolvedValue(null)
    await populateClientToken(hmppsAuthClient)(req, res, next)
    expect(logger.info).toHaveBeenCalledWith('No client token available')
    expect(next).toHaveBeenCalled()
  })

  it('should return next with an error', async () => {
    const error = new Error('SOME-ERROR')
    hmppsAuthClient.getSystemClientToken.mockRejectedValue(error)
    await populateClientToken(hmppsAuthClient)(req, res, next)
    expect(logger.error).toHaveBeenCalledWith(error, 'Failed to retrieve client token for: LocalName')
    expect(next).toHaveBeenCalled()
  })
})
