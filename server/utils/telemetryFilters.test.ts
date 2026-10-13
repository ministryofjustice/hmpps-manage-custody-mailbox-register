import { SpanKind, SpanStatusCode } from '@opentelemetry/api'
import type { SpanInfo } from '@ministryofjustice/hmpps-azure-telemetry'
import { filterExcludedPaths } from './telemetryFilters'

const makeSpan = (path: string, statusCode = SpanStatusCode.UNSET): SpanInfo => ({
  name: 'GET',
  kind: SpanKind.SERVER,
  attributes: { 'url.path': path },
  durationMs: 1,
  status: { code: statusCode },
})

describe('filterExcludedPaths', () => {
  it.each(['/health', '/ping', '/info', '/favicon.ico', '/assets/style.css'])(
    'drops successful spans for excluded path %s',
    path => {
      expect(filterExcludedPaths(makeSpan(path))).toBe(false)
    },
  )

  it('keeps failed spans for excluded paths', () => {
    expect(filterExcludedPaths(makeSpan('/health', SpanStatusCode.ERROR))).toBe(true)
  })

  it('keeps spans for other paths', () => {
    expect(filterExcludedPaths(makeSpan('/local-delivery-unit-mailboxes'))).toBe(true)
  })

  it('uses the HTTP target when the URL path is not present', () => {
    const span = {
      ...makeSpan('/not-used'),
      attributes: { 'http.target': '/assets/style.css' },
    }
    expect(filterExcludedPaths(span)).toBe(false)
  })
})
