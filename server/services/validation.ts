import { Request, Response, NextFunction } from 'express'
import { matchedData, Result, ValidationError, validationResult } from 'express-validator'

export const pageToRenderDefined = (req: Request) => req.get('renderPage') != null

export const handleValidationWithPageRender = (req: Request, res: Response, errors: ValidationErrors) => {
  res.locals.submittedForm = matchedData(req)
  res.locals.validationErrors = errors
  res.render(res.get('renderPage'))
}

const nicerErrorsFromValidate = (errors: Result<ValidationError>): ValidationErrors =>
  Object.entries(errors.mapped()).reduce((ne, [key, data]) => {
    return { ...ne, [key]: data.msg }
  }, {})

export const renderPageOnValidationError =
  (renderPage: string) => async (req: Request, res: Response, next: NextFunction) => {
    res.set('renderPage', renderPage)

    // Handle client side validation
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    else return handleValidationWithPageRender(req, res, nicerErrorsFromValidate(errors))
  }

type FieldName = string
type ValidationMessage = string
export type ValidationErrors = Record<FieldName, ValidationMessage>
