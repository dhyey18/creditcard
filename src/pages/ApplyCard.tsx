import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { applyCardSchema, type ApplyCardForm } from '../types'
import { submitApplication } from '../api/creditCard'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ApplyCard() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyCardForm>({ resolver: zodResolver(applyCardSchema) })

  const onSubmit = async (data: ApplyCardForm) => {
    setApiError('')
    try {
      const { applicationId } = await submitApplication(data)
      navigate(`/credit-score/${applicationId}`)
    } catch {
      setApiError('Submission failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credit Card Application</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in your details to apply for a NexaCard credit card.</p>
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Full Name" id="fullName" placeholder="As per PAN card" error={errors.fullName?.message} {...register('fullName')} />
            </div>
            <Input label="Email Address" id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Phone Number" id="phone" placeholder="10-digit mobile number" error={errors.phone?.message} {...register('phone')} />
            <Input label="Date of Birth" id="dob" type="date" error={errors.dob?.message} {...register('dob')} />
            <Input label="PAN Number" id="pan" placeholder="ABCDE1234F" className="uppercase" error={errors.pan?.message} {...register('pan')} />
            <div className="sm:col-span-2">
              <Input label="Residential Address" id="address" placeholder="Full address with city and pincode" error={errors.address?.message} {...register('address')} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Annual Income (₹)" id="annualIncome" type="number" placeholder="e.g. 600000" error={errors.annualIncome?.message} {...register('annualIncome')} />
            <div className="flex flex-col gap-1">
              <label htmlFor="employmentType" className="text-sm font-medium text-slate-700">Employment Type</label>
              <select
                id="employmentType"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${errors.employmentType ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'}`}
                {...register('employmentType')}
              >
                <option value="">Select type</option>
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self-Employed</option>
                <option value="business">Business Owner</option>
              </select>
              {errors.employmentType && <p className="text-xs text-red-600">{errors.employmentType.message}</p>}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto px-10">
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  )
}
