import { Request, Response } from 'express'
import { ResponseError } from 'superagent'
import { body } from 'express-validator'
import { redirectPath, validatedRequest } from './validation'

describe('validatedRequest', () => {
  it('a request with no validations is never redirected', async () => {
    const incomingRequest = { params: {} } as unknown as Request
    const outgoingResponse = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    const nextFn = jest.fn()
    const finalRequest = validatedRequest(
      {
        validations: [],
        onValidationErrorRedirectTo: '/home',
      },
      async (req, res, next) => res.render('its ok!'),
    )

    await finalRequest(incomingRequest, outgoingResponse, nextFn)
    expect(outgoingResponse.redirect).not.toHaveBeenCalled()
    expect(outgoingResponse.render).toHaveBeenCalledWith('its ok!')
  })

  it('a request with validations defined which are met is not redirected', async () => {
    const incomingRequest = { params: {}, body: { name: 'Present' } } as unknown as Request
    const outgoingResponse = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    const nextFn = jest.fn()
    const finalRequest = validatedRequest(
      {
        validations: [body('name').notEmpty()],
        onValidationErrorRedirectTo: '/home',
      },
      async (req, res, next) => res.render('its ok!'),
    )

    await finalRequest(incomingRequest, outgoingResponse, nextFn)
    expect(outgoingResponse.redirect).not.toHaveBeenCalled()
    expect(outgoingResponse.render).toHaveBeenCalledWith('its ok!')
  })

  it('a request with validations defined which are met but the server rasies a 400 error is redirected', async () => {
    const incomingRequest = { params: { id: 123 }, body: { name: 'Present' }, flash: jest.fn() } as unknown as Request
    const outgoingResponse = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    const nextFn = jest.fn()

    const finalRequest = validatedRequest(
      {
        validations: [body('name').notEmpty()],
        onValidationErrorRedirectTo: '/resources/:id/edit',
      },
      async (req, res, next) => {
        const error = new Error('Bad Request') as ResponseError
        error.status = 400
        // @ts-expect-error - It does exist!
        error.data = { errors: { name: 'Is already taken' } }
        throw error
        res.render('its ok!')
      },
    )

    await finalRequest(incomingRequest, outgoingResponse, nextFn)
    expect(outgoingResponse.redirect).toHaveBeenCalledWith('/resources/123/edit')
    expect(outgoingResponse.render).not.toHaveBeenCalledWith('its ok!')
    expect(incomingRequest.flash).toHaveBeenCalledWith('validationErrors', JSON.stringify({ name: 'Is already taken' }))
    expect(incomingRequest.flash).toHaveBeenCalledWith('submittedForm', JSON.stringify(incomingRequest.body))
  })

  it('a request with not validations defined but the server rasies a 400 error is redirected', async () => {
    const incomingRequest = { params: {}, body: {}, flash: jest.fn() } as unknown as Request
    const outgoingResponse = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    const nextFn = jest.fn()

    const finalRequest = validatedRequest(
      {
        validations: [],
        onValidationErrorRedirectTo: '/safety',
      },
      async (req, res, next) => {
        const error = new Error('Bad Request') as ResponseError
        error.status = 400
        // @ts-expect-error - It does exist!
        error.data = { errors: { name: 'Is already taken' } }
        throw error
        res.render('its ok!')
      },
    )

    await finalRequest(incomingRequest, outgoingResponse, nextFn)
    expect(outgoingResponse.redirect).toHaveBeenCalledWith('/safety')
    expect(outgoingResponse.render).not.toHaveBeenCalledWith('its ok!')
    expect(incomingRequest.flash).toHaveBeenCalledWith('validationErrors', JSON.stringify({ name: 'Is already taken' }))
    expect(incomingRequest.flash).toHaveBeenCalledWith('submittedForm', JSON.stringify(incomingRequest.body))
  })
})

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
