import axios from 'axios'
import type { ApplyCardForm, ActivateCardForm, CreditScoreResponse, ApprovalResponse, ActivationResponse } from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const cardApi = axios.create({
  baseURL: import.meta.env.VITE_API_CARD_SERVICES,
  headers: { 'Content-Type': 'application/json' },
})

export const submitApplication = async (data: ApplyCardForm): Promise<{ applicationId: string }> => {
  const res = await api.post('/api/applications', {
    ...data,
    salary: Number(data.salary),
    yearsAtCurrentJob: Number(data.yearsAtCurrentJob),
    totalExperience: Number(data.totalExperience),
  })
  return res.data
}

export const getCreditScore = async (applicationId: string): Promise<CreditScoreResponse> => {
  const res = await api.get(`/api/credit-score/${applicationId}`)
  return res.data
}

export const getApprovalStatus = async (applicationId: string): Promise<ApprovalResponse> => {
  const res = await api.get(`/api/applications/${applicationId}/status`)
  return res.data
}

export const activateCard = async (data: ActivateCardForm): Promise<ActivationResponse> => {
  const res = await cardApi.post('/activate', {
    cardNumber: data.cardNumber,
    pan: data.pan,
    oldPin: data.oldPin,
    newPin: data.newPin,
  })
  return res.data
}
