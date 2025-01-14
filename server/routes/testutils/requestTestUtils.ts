import { NextFunction, Request, Response } from 'express'

const exampleUserDetails = {
  username: 'USER1',
  active: true,
  name: 'User 1',
  authSource: 'nomis',
  staffId: 123456,
  userId: '654321',
}

const clientToken = {
  clientToken: 'token-1',
}

type CookieValues = Record<string, string>

type ValidationError = { text?: string; href: string }

type RequestParams = {
  userDetails?: unknown
  middleware?: {
    clientToken?: string
  }
  params?: Record<string, string>
  body?: Record<string, string>
  baseUrl?: string
  path?: string
  hostname?: string
  query?: Record<string, string> | string
  signedCookies?: Record<string, CookieValues>
  errors?: ValidationError[]
}

type ResponseParams = {
  locals?: unknown
}

const mockRequest = ({
  userDetails = exampleUserDetails,
  middleware = clientToken,
  params = {},
  query = {},
  body = {},
  signedCookies = {},
  baseUrl,
  path,
  hostname,
  errors = undefined,
}: RequestParams): jest.Mocked<Request> =>
  ({
    session: {
      userDetails,
    },
    middleware,
    signedCookies,
    query,
    params,
    flash: jest.fn().mockReturnValue([]),
    body,
    baseUrl,
    path,
    hostname,
    errors,
  }) as unknown as jest.Mocked<Request>

const mockResponse = ({ locals = { context: {}, user: {} } }: ResponseParams): jest.Mocked<Response> =>
  ({
    locals,
    sendStatus: jest.fn(),
    send: jest.fn(),
    contentType: jest.fn(),
    set: jest.fn(),
    redirect: jest.fn(),
    render: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  }) as unknown as jest.Mocked<Response>

const mockNext = (): jest.MockedFunction<NextFunction> => jest.fn()

const mockedDate = (date: number | Date) => jest.useFakeTimers().setSystemTime(date)

export { mockRequest, mockResponse, mockNext, mockedDate }
