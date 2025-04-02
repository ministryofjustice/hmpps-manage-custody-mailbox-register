import { Services } from '../../services'
import { index, create, deleteMailbox, update } from './controller'
import { testRequestHandler } from '../testutils/requestHandler'
import { ResponseErrorWithData } from '../../services/validation'
import { OffenderManagementUnitMailbox } from '../../@types/mailboxRegisterApiClientTypes'
import AuthRole from '../../data/authRole'

const body = {
  name: 'A Name',
  emailAddress: 'valid@email.com',
  prisonCode: 'LEI',
  role: 'CVL',
}

const mailboxRegisterService = {
  listPrisonCodes: jest.fn(),
  listOffenderManagementUnitMailboxes: jest.fn(),
  createOffenderManagementUnitMailbox: jest.fn(),
  updateOffenderManagementUnitMailbox: jest.fn(),
  deleteOffenderManagementUnitMailbox: jest.fn(),
}
const services = { mailboxRegisterService } as unknown as Services

beforeEach(() => {
  mailboxRegisterService.listPrisonCodes.mockReset()
  mailboxRegisterService.listOffenderManagementUnitMailboxes.mockReset()
  mailboxRegisterService.createOffenderManagementUnitMailbox.mockReset()
  mailboxRegisterService.updateOffenderManagementUnitMailbox.mockReset()
  mailboxRegisterService.deleteOffenderManagementUnitMailbox.mockReset()
})

const sharedValidationRules = [
  ['name', null, 'Please enter a name'],
  ['emailAddress', null, 'Please enter a valid email address'],
  ['emailAddress', 'notValid', 'Please enter a valid email address'],
  ['prisonCode', null, 'Please select a prison'],
  ['role', null, 'Please select a role / activity'],
]

describe('index', () => {
  it('retrieves a list of mailboxes from the backend', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.SUPPORT] } })
    const mailboxes: OffenderManagementUnitMailbox[] = []
    const prisons = [{ LEI: 'Leeds' }, { WHI: 'Woodhill' }]
    const viewContext = { hasAdminRole: true }

    mailboxRegisterService.listPrisonCodes.mockReturnValue({ prisons })
    mailboxRegisterService.listOffenderManagementUnitMailboxes.mockReturnValue(mailboxes)
    await index(services)(req, res, next)

    expect(mailboxRegisterService.listOffenderManagementUnitMailboxes).toHaveBeenCalledWith('CL13NT_T0K3N')
    expect(res.render).toHaveBeenCalledWith('pages/omuMailboxes/index', { mailboxes, prisons, viewContext })
  })
})

describe('create', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidField = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({ requestBody: bodyWithInvalidField })
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
    const bodyWithInvalidField = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({
      requestBody: bodyWithInvalidField,
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

describe('deleteMailbox', () => {
  it('sends this deletion to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestParams: { id: 123 } })
    await deleteMailbox(services)(req, res, next)
    expect(mailboxRegisterService.deleteOffenderManagementUnitMailbox).toHaveBeenCalledWith('CL13NT_T0K3N', 123)
    expect(res.redirect).toHaveBeenCalledWith('/offender-management-unit-mailboxes')
  })
})
