import { Services } from '../../services'
import { testRequestHandler } from '../testutils/requestHandler'
import { create } from './controller'

describe('create', () => {
  const mailboxRegisterService = { createLocalDeliveryUnitMailbox: jest.fn() }
  const services = { mailboxRegisterService } as unknown as Services

  it.each([
    ['emailAddress', 'notValid', 'Please enter a valid email address'],
    ['emailAddress', null, 'Please enter a valid email address'],
    ['unitCode', null, 'Please enter the unit code'],
    ['areaCode', null, 'Please enter the area code'],
  ])('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const [req, res, next, flash] = testRequestHandler({
      requestBody: {
        name: 'A Name',
        emailAddress: 'valid@email.com',
        country: 'A Country',
        unitCode: '123',
        areaCode: 'ABC',
        [field]: value,
      },
    })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('sends the form data to the back end', async () => {
    const body = {
      name: 'A Name',
      emailAddress: 'valid@email.com',
      country: 'A Country',
      unitCode: '123',
      areaCode: 'ABC',
    }

    const [req, res, next] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(mailboxRegisterService.createLocalDeliveryUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes')
  })
})
