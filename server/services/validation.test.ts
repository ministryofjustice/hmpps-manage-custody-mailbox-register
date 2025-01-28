import { Request } from 'express'
import { redirectPath } from './validation'

describe('redirectPath', () => {
  it('replaces param placeholders in the redirection path with params from the current request', () => {
    const req = {
      params: { id: 123, modifier: 'ABC', another: 'awesome', oneMore: 'left untouched' },
    } as unknown as Request
    expect(redirectPath('/a-cool-resource/:id/edit/:modifier/:another', req)).toEqual(
      '/a-cool-resource/123/edit/ABC/awesome',
    )
  })
})
