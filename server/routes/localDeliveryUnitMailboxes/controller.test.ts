import { Services } from '../../services'
import { testRequestHandler } from '../testutils/requestHandler'
import { index, create, deleteMailbox, update } from './controller'
import { ResponseErrorWithData } from '../../services/validation'
import { LocalDeliveryUnitMailbox } from '../../@types/mailboxRegisterApiClientTypes'
import AuthRole from '../../data/authRole'

const mailboxRegisterService = {
  listLocalDeliveryUnitMailboxes: jest.fn(),
  createLocalDeliveryUnitMailbox: jest.fn(),
  updateLocalDeliveryUnitMailbox: jest.fn(),
  deleteLocalDeliveryUnitMailbox: jest.fn(),
}
const services = { mailboxRegisterService } as unknown as Services

beforeEach(() => {
  mailboxRegisterService.listLocalDeliveryUnitMailboxes.mockReset()
  mailboxRegisterService.createLocalDeliveryUnitMailbox.mockReset()
  mailboxRegisterService.updateLocalDeliveryUnitMailbox.mockReset()
  mailboxRegisterService.deleteLocalDeliveryUnitMailbox.mockReset()
})

const sharedValidationRules = [
  ['name', null, 'Please enter a name'],
  ['emailAddress', null, 'Please enter a valid email address'],
  ['emailAddress', 'notValid', 'Please enter a valid email address'],
  ['unitCode', null, 'Please enter the unit code'],
  ['unitCode', 'not-valid', 'Please enter only letters and numbers'],
  ['country', null, 'Please select the country'],
  ['country', 'notValid', 'Please select the country'],
]

const body = {
  name: 'A Name',
  emailAddress: 'valid@email.com',
  country: 'England',
  unitCode: '123',
  areaCode: 'ABC',
}

describe('index', () => {
  it('retrieves a list of mailboxes from the backend', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.MOIC_ADMIN] } })
    const mailboxes: LocalDeliveryUnitMailbox[] = []
    const viewContext = { hasAdminRole: true }

    mailboxRegisterService.listLocalDeliveryUnitMailboxes.mockReturnValue(mailboxes)
    await index(services)(req, res, next)

    expect(mailboxRegisterService.listLocalDeliveryUnitMailboxes).toHaveBeenCalledWith('CL13NT_T0K3N')
    expect(res.render).toHaveBeenCalledWith('pages/lduMailboxes/index', { mailboxes, viewContext })
  })
})

describe('create', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidField = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({ requestBody: bodyWithInvalidField })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.createLocalDeliveryUnitMailbox.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(mailboxRegisterService.createLocalDeliveryUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes')
  })
})

describe('update', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidField = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({
      requestBody: bodyWithInvalidField,
      requestParams: { id: 123 },
    })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.updateLocalDeliveryUnitMailbox.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(mailboxRegisterService.updateLocalDeliveryUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', 123, body)
    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes')
  })
})

describe('deleteMailbox', () => {
  it('sends this deletion to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestParams: { id: 123 } })
    await deleteMailbox(services)(req, res, next)
    expect(mailboxRegisterService.deleteLocalDeliveryUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', 123)
    expect(res.redirect).toHaveBeenCalledWith('/local-delivery-unit-mailboxes')
  })
})
