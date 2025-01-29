import { Request } from 'express'

// @ts-expect-error - temporary linting bypass
export const clientToken = (req: Request) => req?.middleware?.clientToken
