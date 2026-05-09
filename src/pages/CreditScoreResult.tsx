import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCreditScore } from '../api/creditCard'
import type { CreditScoreResponse } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'

const scoreColor = (score: number) => {
  if (score >= 750) return { ring: 'stroke-green-500', text: 'text-green-600', bg: 'bg-green-50' }
  if (score >= 650) return { ring: 'stroke-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' }
  return { ring: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50' }
}

export default function CreditScoreResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<CreditScoreResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchScore = async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      setData(await getCreditScore(id))
    } catch {
      setError('Failed to fetch credit score. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchScore() }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-10 w-10 text-blue-700" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-slate-500 text-sm">Analyzing your credit profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button variant="secondary" onClick={fetchScore}>Retry</Button>
      </div>
    )
  }

  if (!data) return null

  const { ring, text, bg } = scoreColor(data.score)
  const circumference = 2 * Math.PI * 54
  const progress = ((data.score - 300) / (900 - 300)) * circumference

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credit Score Result</h1>
        <p className="text-slate-500 text-sm mt-1">Based on your application, here is your credit assessment.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 py-8">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle
            cx="70" cy="70" r="54" fill="none" className={ring} strokeWidth="12"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="text-center -mt-20">
          <p className={`text-5xl font-bold ${text}`}>{data.score}</p>
          <p className="text-slate-500 text-sm mt-1">out of 900</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${bg} ${text} mt-2`}>
          {data.grade}
        </span>
      </Card>

      <Card>
        <h2 className="font-semibold text-slate-800 mb-3">Key Factors</h2>
        <ul className="space-y-2">
          {data.factors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {factor}
            </li>
          ))}
        </ul>
      </Card>

      <Button className="w-full" onClick={() => navigate(`/approval/${id}`)}>
        Check Approval Status
      </Button>
    </div>
  )
}
