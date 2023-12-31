import { describe } from 'node:test'
import { expect, it } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Create User Use Case', () => {
  it('should be able to create a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const { user } = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const { user } = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create a user with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const email = 'johndoe@example.om'

    await createUserUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      createUserUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
