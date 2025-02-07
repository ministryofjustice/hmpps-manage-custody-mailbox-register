import { testRequestHandler } from '../testutils/requestHandler'
import { index } from './controller'
import AuthRole from '../../data/authRole'

describe('index', () => {
  it('knows which cards should be shown based on the user roles', async () => {
    const [req, res, next] = testRequestHandler({ user: { userRoles: [AuthRole.PRISON] } })
    const viewContext = {
      shouldShowLduCard: true,
      shouldShowOmuCard: false,
    }

    await index(req, res, next)
    expect(res.render).toHaveBeenCalledWith('pages/index', viewContext)
  })
})
