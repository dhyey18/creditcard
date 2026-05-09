import { z } from 'zod'

export const applyCardSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN (e.g. ABCDE1234F)'),
  annualIncome: z.string().min(1, 'Annual income is required').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 100000,
    'Annual income must be at least ₹1,00,000'
  ),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  employmentType: z.enum(['salaried', 'self-employed', 'business']),
})

export const activateCardSchema = z
  .object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
    currentPin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d+$/, 'PIN must be numeric'),
    newPin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d+$/, 'PIN must be numeric'),
    confirmPin: z.string().length(4, 'PIN must be 4 digits'),
  })
  .refine((d) => d.newPin === d.confirmPin, {
    message: 'PINs do not match',
    path: ['confirmPin'],
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
