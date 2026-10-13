import { SpanStatusCode } from '@opentelemetry/api'
import type { SpanFilterFn } from '@ministryofjustice/hmpps-azure-telemetry'

const excludedPathPrefixes = ['/health', '/ping', '/info', '/favicon.ico', '/assets']

export const filterExcludedPaths: SpanFilterFn = span => {
  const urlPath = span.attributes['url.path']
  const httpTarget = span.attributes['http.target']
  let path = ''
  if (typeof urlPath === 'string') {
    path = urlPath
  } else if (typeof httpTarget === 'string') {
    path = httpTarget
  }
  const isExcludedPath = excludedPathPrefixes.some(prefix => path.startsWith(prefix))

  return !isExcludedPath || span.status.code === SpanStatusCode.ERROR
}
