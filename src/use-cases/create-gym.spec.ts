import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a user', async () => {
    const { gym } = await sut.execute({
      title: 'Gym Js',
      description: '',
      phone: '',
      latitude: -14.239424,
      longitude: -53.186502,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
