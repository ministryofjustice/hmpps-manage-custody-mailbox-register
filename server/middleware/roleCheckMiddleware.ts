import { RequestHandler } from 'express'

/*
 ** This middleware function checks that access to a set of route handlers is allowed
 ** if the current user has one of the allowed roles.
 */
export default function roleCheckMiddleware(allowedRoles: string[]): RequestHandler {
  return async (req, res, next) => {
    const { userRoles } = res.locals.user

    // authorities in the user token will always be prefixed by ROLE_.
    // Convert roles that are passed into this function without the prefix so that we match correctly.
    const roles = userRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))

    if (roles) {
      const roleIntersection = allowedRoles.filter(role => roles.includes(role))
      if (roleIntersection.length > 0) {
        return next()
      }
    }

    return res.redirect('/access-denied')
  }
}
