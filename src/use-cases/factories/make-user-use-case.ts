import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '../create-user'

export function makeUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const createUserUseCase = new CreateUserUseCase(prismaUsersRepository)

  return createUserUseCase
}
