import request from 'supertest'
import app from '../routes/index.js'

describe('catalog health', () => {
  it('responds with ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ status: 'ok' })
  })
})
