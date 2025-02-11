import { RequestHandler } from 'express'
import { hasRoleOrAdmin } from '../../utils/utils'
import AuthRole from '../../data/authRole'

export const index: RequestHandler = async (req, res, next) => {
  const viewContext = {
    shouldShowLduCard: hasRoleOrAdmin(req.user, AuthRole.PRISON),
    shouldShowProbationTeamsCard: hasRoleOrAdmin(req.user, AuthRole.PRISON),
    shouldShowOmuCard: hasRoleOrAdmin(req.user, AuthRole.PROBATION),
  }
  res.render('pages/index', viewContext)
}
