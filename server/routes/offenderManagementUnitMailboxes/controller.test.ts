import { Services } from '../../services'
import { create, update } from './controller'
import { testRequestHandler } from '../testutils/requestHandler'

describe('create', () => {
  const mailboxRegisterService = { createOffenderManagementUnitMailbox: jest.fn() }
  const services = { mailboxRegisterService } as unknown as Services

  it.each([
    ['name', null, 'Please enter a name'],
    ['emailAddress', null, 'Please enter a valid email address'],
    ['emailAddress', 'notValid', 'Please enter a valid email address'],
    ['prisonCode', null, 'Please select a prison'],
    ['role', null, 'Please select a role / activity'],
  ])('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const body = {
      name: 'A Name',
      emailAddress: 'valid@email.com',
      prisonCode: 'LEI',
      role: 'CVL',
      [field]: value,
    }

    const [req, res, next, flash] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('sends the form data to the back end', async () => {
    const body = {
      name: 'A Name',
      emailAddress: 'valid@email.com',
      prisonCode: 'LEI',
      role: 'CVL',
    }

    const [req, res, next] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(mailboxRegisterService.createOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})

describe('update', () => {
  const mailboxRegisterService = { updateOffenderManagementUnitMailbox: jest.fn() }
  const services = { mailboxRegisterService } as unknown as Services

  it.each([
    ['name', null, 'Please enter a name'],
    ['emailAddress', null, 'Please enter a valid email address'],
    ['emailAddress', 'notValid', 'Please enter a valid email address'],
    ['prisonCode', null, 'Please select a prison'],
    ['role', null, 'Please select a role / activity'],
  ])('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const body = {
      name: 'A Name',
      emailAddress: 'valid@email.com',
      prisonCode: 'LEI',
      role: 'CVL',
      [field]: value,
    }

    const [req, res, next, flash] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('sends the form data to the back end', async () => {
    const body = {
      name: 'A Name',
      emailAddress: 'valid@email.com',
      prisonCode: 'LEI',
      role: 'CVL',
    }

    const [req, res, next] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(mailboxRegisterService.updateOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', 123, body)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})
