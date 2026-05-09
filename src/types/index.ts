import { z } from 'zod'

export const applyCardSchema = z.object({
  // Personal
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  city: z.string().min(2, 'City is required'),

  // Employment
  companyName: z.string().min(2, 'Company name is required'),
  yearsAtCurrentJob: z.string().min(1, 'Years at current job is required').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 0,
    'Must be a valid number'
  ),
  totalExperience: z.string().min(1, 'Total experience is required').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 0,
    'Must be a valid number'
  ),
  salary: z.string().min(1, 'Salary is required').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 100000,
    'Salary must be at least ₹1,00,000'
  ),

  // Identity
  aadharCard: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  panCard: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN (e.g. ABCDE1234F)'),
})

export const activateCardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN (e.g. ABCDE1234F)'),
  oldPin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d+$/, 'PIN must be numeric'),
  newPin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d+$/, 'PIN must be numeric'),
})

export type ApplyCardForm = z.infer<typeof applyCardSchema>
export type ActivateCardForm = z.infer<typeof activateCardSchema>

export interface CreditScoreResponse {
  applicationId: string
  score: number
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  factors: string[]
}

export interface ApprovalResponse {
  applicationId: string
  status: 'approved' | 'rejected' | 'pending'
  creditLimit?: number
  cardType?: string
  interestRate?: number
  rejectionReason?: string
}

export interface ActivationResponse {
  success: boolean
  message: string
  cardLastFour?: string
}
