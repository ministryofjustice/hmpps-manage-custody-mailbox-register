import { Request, RequestHandler } from 'express'
import { Result, ValidationChain, ValidationError, validationResult } from 'express-validator'
import { ResponseError } from 'superagent'

export const validatedRequest = (
  config: { validations: ValidationChain[]; onValidationErrorRedirectTo: string },
  action: RequestHandler,
): RequestHandler => {
  return async (req, res, next) => {
    await Promise.all(config.validations.map(validation => validation.run(req)))
    const errors = validationResult(req)

    // Redirect simple front end validation failures
    if (!errors.isEmpty()) {
      req.flash('validationErrors', JSON.stringify(formatExpressValidations(errors)))
      req.flash('submittedForm', JSON.stringify(req.body))
      return res.redirect(redirectPath(config.onValidationErrorRedirectTo, req))
    }

    // Handle potential back end validations
    try {
      return await action(req, res, next)
    } catch (error) {
      if (error.status === 400) {
        req.flash('validationErrors', JSON.stringify(error.data.errors))
        req.flash('submittedForm', JSON.stringify(req.body))
        return res.redirect(redirectPath(config.onValidationErrorRedirectTo, req))
      }
      throw error
    }
  }
}

export const retrieveValidationErrorsPostRedirect: RequestHandler = (req, res, next) => {
  if (req.method === 'GET') {
    const validationErrors = (req.flash('validationErrors') || [])[0]
    const submittedForm = (req.flash('submittedForm') || [])[0]
    if (validationErrors && submittedForm) {
      res.locals.validationErrors = JSON.parse(validationErrors)
      res.locals.submittedForm = JSON.parse(submittedForm)
    }

    // general error messages
    res.locals.flashMessages = req.flash('error').map((message: string) => ({ error: message }))
  }
  next()
}

// This can only populate params present in the current request
export const redirectPath = (pathTemplate: string, req: Request): string => {
  let redirectTo = pathTemplate
  Object.entries(req.params).forEach(([key, value]) => {
    redirectTo = redirectTo.replace(`:${key}`, value)
  })
  return redirectTo
}

const formatExpressValidations = (errors: Result<ValidationError>): Record<string, string> =>
  Object.entries(errors.mapped()).reduce((ne, [key, data]) => {
    return { ...ne, [key]: data.msg }
  }, {})

export type ResponseErrorWithData = ResponseError & { data: unknown }
