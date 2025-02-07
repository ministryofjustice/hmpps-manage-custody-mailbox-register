import { RequestHandler } from 'express'
import { hasRoleOrAdmin } from '../../utils/utils'
import AuthRole from '../../data/authRole'

export const index: RequestHandler = async (req, res, next) => {
  const viewContext = {
    shouldShowLduCard: hasRoleOrAdmin(req.user, AuthRole.PRISON),
<<<<<<< HEAD
    shouldShowOmuCard: hasRoleOrAdmin(req.user, AuthRole.PROBATION),
=======
    shouldShowProbationTeamsCard: hasRoleOrAdmin(req.user, AuthRole.PRISON),
    shouldShowOmuCard: hasRoleOrAdmin(req.user, AuthRole.PRISON), // TODO: Change to PROBATION role when ready
>>>>>>> c62f59b (link through to the probations page)
  }
  res.render('pages/index', viewContext)
}
