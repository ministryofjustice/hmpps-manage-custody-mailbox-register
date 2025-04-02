import { Services } from '../../services'
import { ResponseErrorWithData } from '../../services/validation'
import { testRequestHandler } from '../testutils/requestHandler'
import { create, edit, index, newProbationTeam, update, deleteProbationTeam } from './controller'
import AuthRole from '../../data/authRole'

const mailboxRegisterService = {
  createProbationTeam: jest.fn(),
  updateProbationTeam: jest.fn(),
  deleteProbationTeam: jest.fn(),
  getProbationTeam: jest.fn(),
  listLocalDeliveryUnitMailboxes: jest.fn(),
  listProbationTeams: jest.fn(),
}
beforeEach(() => Object.values(mailboxRegisterService).map(mock => mock.mockReset()))

const services = { mailboxRegisterService } as unknown as Services

const sharedValidationRules = [
  ['emailAddress', null, 'Please enter a valid email address'],
  ['emailAddress', 'notValid', 'Please enter a valid email address'],
  ['teamCode', null, 'Please enter a team code'],
  ['localDeliveryUnitMailboxId', null, 'Please select a Local Delivery Unit'],
]

const body = {
  emailAddress: 'valid@email.com',
  teamCode: '123',
  localDeliveryUnitMailboxId: '56f6fcc6-5bd1-4a37-b0fd-9ece7bd9a8c4',
}

const localDeliveryUnitMailboxes = [
  { id: 123, name: 'ldu 1' },
  { id: 456, name: 'ldu 2' },
]

describe('new', () => {
  it('provides LDUs as a list to select from', async () => {
    mailboxRegisterService.listLocalDeliveryUnitMailboxes.mockReturnValue(localDeliveryUnitMailboxes)
    const localDeliveryUnitMailboxOptions = [
      { text: 'Please Select', value: null },
      { text: 'ldu 1', value: 123 },
      { text: 'ldu 2', value: 456 },
    ]

    const [req, res, next] = testRequestHandler({})
    await newProbationTeam(services)(req, res, next)

    expect(res.render).toHaveBeenCalledWith('pages/probationTeams/new', { localDeliveryUnitMailboxOptions })
  })
})

describe('edit', () => {
  const existingProbationTeam = {
    teamCode: 'ABC',
    emailAddress: 'probation.team@email.com',
    localDeliveryUnitMailbox: { id: 456 },
  }

  it('provides LDUs as a list to select from with the LDU auto selected', async () => {
    mailboxRegisterService.getProbationTeam.mockReturnValue(existingProbationTeam)
    mailboxRegisterService.listLocalDeliveryUnitMailboxes.mockReturnValue(localDeliveryUnitMailboxes)
    const localDeliveryUnitMailboxOptions = [
      { text: 'Please Select', value: null, selected: false },
      { text: 'ldu 1', value: 123, selected: false },
      { text: 'ldu 2', value: 456, selected: true },
    ]

    const [req, res, next] = testRequestHandler({})
    await edit(services)(req, res, next)

    expect(res.render).toHaveBeenCalledWith('pages/probationTeams/edit', {
      probationTeam: existingProbationTeam,
      localDeliveryUnitMailboxOptions,
    })
  })
})

describe('index', () => {
  it('renders a list of every probation team', async () => {
    const probationTeams = [
      { id: 123, emailAddress: 'probation.team1@email.com' },
      { id: 456, emailAddress: 'probation.team2@email.com' },
    ]
    const viewContext = { hasAdminRole: true }
    mailboxRegisterService.listProbationTeams.mockReturnValue(probationTeams)
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.MOIC_ADMIN] } })

    await index(services)(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/probationTeams/index', { probationTeams, viewContext })
  })
})

describe('create', () => {
  it.each(sharedValidationRules)('redirects without a valid value for %s', async (field, value, expectedMessage) => {
    const bodyWithInvalidField = { ...body, [field]: value }
    const [req, res, next, flash] = testRequestHandler({ requestBody: bodyWithInvalidField })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/probation-teams/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.createProbationTeam.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/probation-teams/new')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body })
    await create(services)(req, res, next)
    expect(mailboxRegisterService.createProbationTeam).toHaveBeenCalledWith('CL13NT_T0K3N', body)
    expect(res.redirect).toHaveBeenCalledWith('/probation-teams')
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

    expect(res.redirect).toHaveBeenCalledWith('/probation-teams/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ [field]: expectedMessage }))
  })

  it('redirects when the backend returns a 400', async () => {
    const error = new Error('Bad Request') as ResponseErrorWithData
    error.status = 400
    error.data = { errors: { name: 'Already Taken' } }
    mailboxRegisterService.updateProbationTeam.mockRejectedValue(error)

    const [req, res, next, flash] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/probation-teams/123/edit')
    expect(flash.validationErrors).toEqual(JSON.stringify({ name: 'Already Taken' }))
  })

  it('sends the form data to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestBody: body, requestParams: { id: 123 } })
    await update(services)(req, res, next)
    expect(mailboxRegisterService.updateProbationTeam).toHaveBeenCalledWith('CL13NT_T0K3N', 123, body)
    expect(res.redirect).toHaveBeenCalledWith('/probation-teams')
  })
})

describe('deleteProbationTeam', () => {
  it('sends this deletion to the back end', async () => {
    const [req, res, next] = testRequestHandler({ requestParams: { id: 123 } })
    await deleteProbationTeam(services)(req, res, next)
    expect(mailboxRegisterService.deleteProbationTeam).toHaveBeenCalledWith('CL13NT_T0K3N', 123)
    expect(res.redirect).toHaveBeenCalledWith('/probation-teams')
  })
})
