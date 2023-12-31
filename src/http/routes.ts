import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/create-user'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
}
