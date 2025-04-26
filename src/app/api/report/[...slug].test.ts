import handler from './[...slug]'
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'

describe('/api/report/[...slug] API Route', () => {
  it('handles GET request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'r1' },
    })

    handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({})
  })

  it('rejects non-GET methods with 405', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    })

    handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    expect(res._getData()).toBe('Method POST Not Allowed')
  })
})
