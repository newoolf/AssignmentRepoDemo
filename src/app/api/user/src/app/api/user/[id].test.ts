// src/app/api/user/[id].test.ts
import handler from './[id]'
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'

describe('/api/user/[id] API Route', () => {
  it('handles GET request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '123' },
    })

    handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({})
  })

  it('handles POST request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { id: '123', name: 'Test User' },
    })

    handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({})
  })

  it('handles PUT request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: '123' },
      body: { name: 'Updated User' },
    })

    handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(res._getData()).toEqual({})
  })

  it('handles DELETE request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: '123' },
    })

    handler(req, res)
    expect(res._getStatusCode()).toBe(200)
  })
})
