import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Js gym',
      description: '',
      phone: '',
      latitude: -14.239424,
      longitude: -53.186502,
    })

    await gymsRepository.create({
      title: 'Ts gym',
      description: 'Typescript gym',
      phone: '',
      latitude: -14.239424,
      longitude: -53.186502,
    })

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Ts gym' })])
  })

  it('should be able to fetch pagineted gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Js gym-${i}`,
        description: '',
        phone: '',
        latitude: -14.239424,
        longitude: -53.186502,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Js gym-21' }),
      expect.objectContaining({ title: 'Js gym-22' }),
    ])
  })
})
