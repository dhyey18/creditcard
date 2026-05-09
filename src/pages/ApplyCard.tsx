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

        {/* Personal Information */}
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="firstName"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              id="lastName"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <Input
              label="Phone Number"
              id="phone"
              placeholder="10-digit mobile number"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="PAN Number"
              id="pan"
              placeholder="ABCDE1234F"
              className="uppercase"
              error={errors.pan?.message}
              {...register('pan')}
            />
            <div className="sm:col-span-2">
              <Input
                label="City"
                id="city"
                placeholder="e.g. Mumbai"
                error={errors.city?.message}
                {...register('city')}
              />
            </div>
          </div>
        </Card>

        {/* Employment */}
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Employment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Company Name"
                id="companyName"
                placeholder="e.g. Infosys Ltd."
                error={errors.companyName?.message}
                {...register('companyName')}
              />
            </div>
            <Input
              label="Years at Current Job"
              id="yearsAtCurrentJob"
              type="number"
              min="0"
              placeholder="e.g. 2"
              error={errors.yearsAtCurrentJob?.message}
              {...register('yearsAtCurrentJob')}
            />
            <Input
              label="Total Experience (years)"
              id="totalExperience"
              type="number"
              min="0"
              placeholder="e.g. 5"
              error={errors.totalExperience?.message}
              {...register('totalExperience')}
            />
            <div className="sm:col-span-2">
              <Input
                label="Monthly Salary (₹)"
                id="salary"
                type="number"
                placeholder="e.g. 50000"
                error={errors.salary?.message}
                {...register('salary')}
              />
            </div>
          </div>
        </Card>

        {/* Identity */}
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Aadhaar Card Number"
              id="aadharCard"
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              error={errors.aadharCard?.message}
              {...register('aadharCard')}
            />
            <Input
              label="PAN Card Number"
              id="panCard"
              placeholder="ABCDE1234F"
              className="uppercase"
              error={errors.panCard?.message}
              {...register('panCard')}
            />
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
