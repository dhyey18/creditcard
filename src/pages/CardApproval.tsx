import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getApprovalStatus } from '../api/creditCard'
import type { ApprovalResponse } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'

export default function CardApproval() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<ApprovalResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getApprovalStatus(id)
      .then(setData)
      .catch(() => setError('Failed to fetch approval status.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-10 w-10 text-blue-700" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-500 text-sm">Fetching your approval status...</p>
      </div>
    )
  }

  if (error) return <p className="text-center py-20 text-red-600">{error}</p>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Card Approval Status</h1>
        <p className="text-slate-500 text-sm mt-1">Application ID: {data.applicationId}</p>
      </div>

      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        {data.status === 'approved' ? (
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : data.status === 'rejected' ? (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <StatusBadge status={data.status} />
      </Card>

      {data.status === 'approved' && (
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Card Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Credit Limit', value: `₹${data.creditLimit?.toLocaleString('en-IN')}` },
              { label: 'Card Type',    value: data.cardType },
              { label: 'Interest Rate', value: `${data.interestRate}% p.a.` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-xs text-slate-500 uppercase tracking-wide">{label}</dt>
                <dd className="text-base font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {data.status === 'rejected' && data.rejectionReason && (
        <Card>
          <h2 className="font-semibold text-slate-800 mb-2">Reason</h2>
          <p className="text-sm text-slate-600">{data.rejectionReason}</p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {data.status === 'approved' && (
          <Button className="flex-1" onClick={() => navigate('/activate')}>
            Activate Card
          </Button>
        )}
        <Link to="/apply" className="flex-1">
          <Button variant="secondary" className="w-full">
            {data.status === 'rejected' ? 'Apply Again' : 'Back to Apply'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
