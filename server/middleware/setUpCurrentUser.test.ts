import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import setUpCurrentUser from './setUpCurrentUser'
import logger from '../../logger'

jest.mock('../../logger')

describe('setUpCurrentUser telemetry', () => {
  const userUuid = '25e43a79-bca4-4e67-b399-73b0f089d0c7'
  const setSpanAttributes = jest.spyOn(telemetry, 'setSpanAttributes')

  const appForToken = (token: string) => {
    const app = express()
    app.use((_req, res, next) => {
      res.locals.user = {
        username: 'USER1',
        token,
        authSource: 'nomis',
        userRoles: [],
        userId: 'stale-user-id',
        userUuid,
        name: '',
        displayName: '',
        staffId: 0,
      }
      next()
    })
    app.use(setUpCurrentUser())
    app.get('/', (_req, res) => res.json(res.locals.user))
    app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ message: error.message })
    })
    return app
  }

  beforeEach(() => {
    setSpanAttributes.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    setSpanAttributes.mockRestore()
  })

  it('reads both identifiers from the token while preserving existing user setup', async () => {
    const token = jwt.sign(
      { user_id: '12345', user_uuid: userUuid, name: 'JOHN SMITH', authorities: ['ROLE_ADMIN'] },
      'secret',
    )
    const response = await request(appForToken(token)).get('/').expect(200)

    expect(response.body).toMatchObject({
      userId: '12345',
      userUuid,
      staffId: 12345,
      displayName: 'John Smith',
      userRoles: ['ADMIN'],
    })
    expect(setSpanAttributes).toHaveBeenCalledTimes(1)
    expect(setSpanAttributes).toHaveBeenCalledWith({ userId: '12345', userUuid })
  })

  it.each([
    [{ user_id: '12345' }, { userId: '12345' }],
    [{ user_uuid: userUuid }, { userUuid }],
    [
      { user_id: '12345', user_uuid: 'trusted-token-value' },
      { userId: '12345', userUuid: 'trusted-token-value' },
    ],
    [{ user_id: 12345, user_uuid: userUuid }, { userUuid }],
  ])('sends populated identifiers as supplied by the token for %j', async (claims, attributes) => {
    await request(appForToken(jwt.sign(claims, 'secret')))
      .get('/')
      .expect(200)

    expect(setSpanAttributes).toHaveBeenCalledTimes(1)
    expect(setSpanAttributes).toHaveBeenCalledWith(attributes)
  })

  it.each([{}, { user_id: '', user_uuid: '' }, { user_id: ' ', user_uuid: null }])(
    'does not send identifiers or retain stale values when claims are unavailable: %j',
    async claims => {
      const response = await request(appForToken(jwt.sign(claims, 'secret')))
        .get('/')
        .expect(200)

      expect(setSpanAttributes).not.toHaveBeenCalled()
      expect(response.body).not.toHaveProperty('userId')
      expect(response.body).not.toHaveProperty('userUuid')
    },
  )

  it('logs malformed tokens and forwards the error without sending metadata', async () => {
    await request(appForToken('not-a-jwt')).get('/').expect(500)

    expect(logger.error).toHaveBeenCalledWith(expect.any(Error), 'Failed to populate user details for: USER1')
    expect(setSpanAttributes).not.toHaveBeenCalled()
  })
})
