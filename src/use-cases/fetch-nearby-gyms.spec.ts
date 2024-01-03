import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Neaby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: '',
      phone: '',
      latitude: -14.239424,
      longitude: -53.186502,
    })

    await gymsRepository.create({
      title: 'Far gym',
      description: '',
      phone: '',
      latitude: -4.4937816,
      longitude: -42.9584833,
    })

    const { gyms } = await sut.execute({
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
