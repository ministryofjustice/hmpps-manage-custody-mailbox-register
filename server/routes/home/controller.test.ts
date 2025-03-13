import { testRequestHandler } from '../testutils/requestHandler'
import { index } from './controller'
import AuthRole from '../../data/authRole'

describe('index', () => {
  it('configures cards shown for a PRISON role', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.PRISON] } })
    const viewContext = {
      shouldShowLduCard: true,
      shouldShowOmuCard: false,
      shouldShowProbationTeamsCard: true,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })

  it('configures cards shown for a PROBATION role', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.PROBATION] } })
    const viewContext = {
      shouldShowLduCard: false,
      shouldShowOmuCard: true,
      shouldShowProbationTeamsCard: false,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })

  it('configures cards shown for an MOIC_ADMIN role', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.MOIC_ADMIN] } })
    const viewContext = {
      shouldShowLduCard: true,
      shouldShowOmuCard: true,
      shouldShowProbationTeamsCard: true,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })

  it('configures cards shown for a SUPPORT role', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.SUPPORT] } })
    const viewContext = {
      shouldShowLduCard: true,
      shouldShowOmuCard: true,
      shouldShowProbationTeamsCard: true,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })

  it('configures cards shown for an unrecognised role', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: ['FOOBAR'] } })
    const viewContext = {
      shouldShowLduCard: false,
      shouldShowOmuCard: false,
      shouldShowProbationTeamsCard: false,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })
})
