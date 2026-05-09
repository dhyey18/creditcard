import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { activateCardSchema, type ActivateCardForm } from '../types'
import { activateCard } from '../api/creditCard'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ActivateCard() {
  const [success, setSuccess] = useState<string | null>(null)
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivateCardForm>({ resolver: zodResolver(activateCardSchema) })

  const onSubmit = async (data: ActivateCardForm) => {
    setApiError('')
    try {
      const res = await activateCard(data)
      setSuccess(res.message || 'Card activated and PIN changed successfully.')
      reset()
    } catch {
      setApiError('Activation failed. Please check your details and try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Card Activated!</h2>
          <p className="text-slate-500 text-sm mt-1">{success}</p>
        </div>
        <Button variant="secondary" onClick={() => setSuccess(null)}>
          Change PIN Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activate Card / Change PIN</h1>
        <p className="text-slate-500 text-sm mt-1">Enter your card details to activate or update your PIN.</p>
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Card Information</h2>
          <div className="space-y-4">
            <Input
              label="Card Number (16 digits)"
              id="cardNumber"
              placeholder="1234567890123456"
              maxLength={16}
              error={errors.cardNumber?.message}
              {...register('cardNumber')}
            />
            <Input
              label="PAN Number"
              id="pan"
              placeholder="ABCDE1234F"
              className="uppercase"
              maxLength={10}
              error={errors.pan?.message}
              {...register('pan')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">PIN Management</h2>
          <div className="space-y-4">
            <Input
              label="Old PIN"
              id="oldPin"
              type="password"
              placeholder="4-digit PIN"
              maxLength={4}
              error={errors.oldPin?.message}
              {...register('oldPin')}
            />
            <Input
              label="New PIN"
              id="newPin"
              type="password"
              placeholder="4-digit PIN"
              maxLength={4}
              error={errors.newPin?.message}
              {...register('newPin')}
            />
          </div>
        </Card>

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
          Your PIN is encrypted and never stored in plain text.
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">
          Activate & Set PIN
        </Button>
      </form>
    </div>
  )
}
