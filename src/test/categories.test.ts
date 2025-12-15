import request from 'supertest'
import app from '../routes/index.js'

describe('Categories API', () => {
  it('deve criar uma categoria', async () => {
    const res = await request(app)
      .post('/categories')
      .send({ name: 'Test', description: 'Test category' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
  })
})
