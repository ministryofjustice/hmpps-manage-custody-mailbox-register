import { Request, Response } from 'express'
import { Services } from '../../services'
import { create } from './controller'

describe('create', () => {
  const mailboxRegisterService = { createOffenderManagementUnitMailbox: jest.fn() }
  const services = { mailboxRegisterService } as unknown as Services
  const flash: Record<string, string> = {}
  const flasher = (name: string, message: string) => {
    flash[name] = message
  }

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

    const req = { params: {}, body, flash: flasher } as unknown as Request
    const res = { redirect: jest.fn(), render: jest.fn() } as unknown as Response
    const next = jest.fn()
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

    const req = { body, middleware: { clientToken: 'CL13NT_T0K3N' } } as unknown as Request
    const res = { redirect: jest.fn() } as unknown as Response
    const next = jest.fn()

    await create(services)(req, res, next)

    expect(mailboxRegisterService.createOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})
