import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCehckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'teste',
      title: 'Gym Js',
      description: '',
      phone: '',
      latitude: new Decimal(-14.239424),
      longitude: new Decimal(-53.186502),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'teste',
      userId: 'teste',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))

    await sut.execute({
      gymId: 'teste',
      userId: 'teste',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    await expect(() =>
      sut.execute({
        gymId: 'teste',
        userId: 'teste',
        userLatitude: -14.239424,
        userLongitude: -53.186502,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCehckInsError)
  })

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 2, 8, 0, 0))

    await sut.execute({
      gymId: 'teste',
      userId: 'teste',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    vi.setSystemTime(new Date(2023, 0, 3, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'teste',
      userId: 'teste',
      userLatitude: -14.239424,
      userLongitude: -53.186502,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Gym Js',
      description: '',
      phone: '',
      latitude: new Decimal(-10.1028616),
      longitude: new Decimal(-44.757307),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'teste',
        userLatitude: -14.239424,
        userLongitude: -53.186502,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
