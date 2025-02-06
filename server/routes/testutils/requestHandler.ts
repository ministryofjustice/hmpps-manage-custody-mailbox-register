import { NextFunction, Request, Response } from 'express'

type TestRequestHelperConfig = {
  requestBody?: unknown
  requestParams?: unknown
  user?: unknown
}
type TestRequestHelperReturns = [Request, Response, NextFunction, Record<string, string>]

export const testRequestHandler = (config: TestRequestHelperConfig): TestRequestHelperReturns => {
  const flash: Record<string, string> = {}
  const flasher = (name: string, message: string) => {
    flash[name] = message
  }
  const req = {
    body: config.requestBody || {},
    params: config.requestParams || {},
    middleware: { clientToken: 'CL13NT_T0K3N' },
    user: config.user || { username: 'TEST_USER', userRoles: ['ROLE_1', 'ROLE_2'] },
    flash: flasher,
  } as unknown as Request
  const res = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
  const next = jest.fn()

  return [req, res, next, flash]
}
