import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { api, cardApi, submitApplication, getCreditScore, getApprovalStatus, activateCard } from '../../api/creditCard'
import type { ApplyCardForm, ActivateCardForm } from '../../types'

const mock = new MockAdapter(api)
const cardMock = new MockAdapter(cardApi)

const validApply: ApplyCardForm = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  city: 'Mumbai',
  companyName: 'Acme Corp',
  yearsAtCurrentJob: '3',
  totalExperience: '7',
  salary: '600000',
  aadharCard: '123456789012',
  panCard: 'ABCDE1234F',
}

const validActivate: ActivateCardForm = {
  cardNumber: '1234567890123456',
  pan: 'ABCDE1234F',
  oldPin: '1234',
  newPin: '5678',
}

beforeEach(() => { mock.reset(); cardMock.reset() })
afterEach(() => { mock.reset(); cardMock.reset() })

describe('submitApplication', () => {
  it('returns applicationId on success', async () => {
    mock.onPost('/api/applications').reply(200, { applicationId: 'APP-001' })
    const result = await submitApplication(validApply)
    expect(result.applicationId).toBe('APP-001')
  })

  it('sends numeric salary to the API', async () => {
    let sentBody: Record<string, unknown> = {}
    mock.onPost('/api/applications').reply((config) => {
      sentBody = JSON.parse(config.data as string)
      return [200, { applicationId: 'APP-002' }]
    })
    await submitApplication(validApply)
    expect(typeof sentBody.salary).toBe('number')
    expect(sentBody.salary).toBe(600000)
  })

  it('sends numeric yearsAtCurrentJob and totalExperience', async () => {
    let sentBody: Record<string, unknown> = {}
    mock.onPost('/api/applications').reply((config) => {
      sentBody = JSON.parse(config.data as string)
      return [200, { applicationId: 'APP-003' }]
    })
    await submitApplication(validApply)
    expect(typeof sentBody.yearsAtCurrentJob).toBe('number')
    expect(typeof sentBody.totalExperience).toBe('number')
  })

  it('throws on 500 server error', async () => {
    mock.onPost('/api/applications').reply(500)
    await expect(submitApplication(validApply)).rejects.toThrow()
  })

  it('throws on network error', async () => {
    mock.onPost('/api/applications').networkError()
    await expect(submitApplication(validApply)).rejects.toThrow()
  })
})

describe('getCreditScore', () => {
  const mockScore = {
    applicationId: 'APP-001',
    score: 780,
    grade: 'Excellent' as const,
    factors: ['Good payment history', 'Low credit utilisation'],
  }

  it('returns credit score data', async () => {
    mock.onGet('/api/credit-score/APP-001').reply(200, mockScore)
    const result = await getCreditScore('APP-001')
    expect(result.score).toBe(780)
    expect(result.grade).toBe('Excellent')
    expect(result.factors).toHaveLength(2)
  })

  it('throws on 404', async () => {
    mock.onGet('/api/credit-score/UNKNOWN').reply(404)
    await expect(getCreditScore('UNKNOWN')).rejects.toThrow()
  })
})

describe('getApprovalStatus', () => {
  it('returns approved status with card details', async () => {
    mock.onGet('/api/applications/APP-001/status').reply(200, {
      applicationId: 'APP-001',
      status: 'approved',
      creditLimit: 150000,
      cardType: 'Platinum',
      interestRate: 3.5,
    })
    const result = await getApprovalStatus('APP-001')
    expect(result.status).toBe('approved')
    expect(result.creditLimit).toBe(150000)
    expect(result.cardType).toBe('Platinum')
  })

  it('returns rejected status with reason', async () => {
    mock.onGet('/api/applications/APP-002/status').reply(200, {
      applicationId: 'APP-002',
      status: 'rejected',
      rejectionReason: 'Low credit score',
    })
    const result = await getApprovalStatus('APP-002')
    expect(result.status).toBe('rejected')
    expect(result.rejectionReason).toBe('Low credit score')
  })

  it('returns pending status', async () => {
    mock.onGet('/api/applications/APP-003/status').reply(200, {
      applicationId: 'APP-003',
      status: 'pending',
    })
    const result = await getApprovalStatus('APP-003')
    expect(result.status).toBe('pending')
  })

  it('throws on server error', async () => {
    mock.onGet('/api/applications/APP-999/status').reply(503)
    await expect(getApprovalStatus('APP-999')).rejects.toThrow()
  })
})

describe('activateCard', () => {
  it('returns success response', async () => {
    cardMock.onPost('/activate').reply(200, {
      success: true,
      message: 'Card activated successfully.',
      cardLastFour: '3456',
    })
    const result = await activateCard(validActivate)
    expect(result.success).toBe(true)
    expect(result.cardLastFour).toBe('3456')
  })

  it('throws on 400 bad request', async () => {
    cardMock.onPost('/activate').reply(400, { message: 'Invalid PIN' })
    await expect(activateCard(validActivate)).rejects.toThrow()
  })

  it('throws on network error', async () => {
    cardMock.onPost('/activate').networkError()
    await expect(activateCard(validActivate)).rejects.toThrow()
  })
})
