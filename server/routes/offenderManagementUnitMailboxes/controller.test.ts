import { Services } from '../../services'
import { create, update } from './controller'
import { testRequestHandler } from '../testutils/requestHandler'
import { ResponseErrorWithData } from '../../services/validation'

const body = {
  name: 'A Name',
  emailAddress: 'valid@email.com',
  prisonCode: 'LEI',
  role: 'CVL',
}

const mailboxRegisterService = {
  createOffenderManagementUnitMailbox: jest.fn(),
  updateOffenderManagementUnitMailbox: jest.fn(),
}
const services = { mailboxRegisterService } as unknown as Services

beforeEach(() => {
  mailboxRegisterService.createOffenderManagementUnitMailbox.mockReset()
  mailboxRegisterService.updateOffenderManagementUnitMailbox.mockReset()
})

const sharedValidationRules = [
  ['name', null, 'Please enter a name'],
  ['emailAddress', null, 'Please enter a valid email address'],
  ['emailAddress', 'notValid', 'Please enter a valid email address'],
  ['prisonCode', null, 'Please select a prison'],
  ['role', null, 'Please select a role / activity'],
]

describe('create', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidFeild = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({ requestBody: bodyWithInvalidFeild })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.createOffenderManagementUnitMailbox.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)
    expect(mailboxRegisterService.createOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})

describe('update', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidFeild = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({
      requestBody: bodyWithInvalidFeild,
      requestParams: { id: 123 },
    })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.updateOffenderManagementUnitMailbox.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)
    expect(mailboxRegisterService.updateOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', 123, body)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})
