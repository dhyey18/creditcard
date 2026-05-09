import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CreditScoreResult from '../../pages/CreditScoreResult'
import * as api from '../../api/creditCard'

vi.mock('../../api/creditCard')

const renderWithId = (id = 'APP-001') =>
  render(
    <MemoryRouter initialEntries={[`/credit-score/${id}`]}>
      <Routes>
        <Route path="/credit-score/:id" element={<CreditScoreResult />} />
      </Routes>
    </MemoryRouter>
  )

describe('CreditScoreResult page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading spinner while fetching', () => {
    vi.mocked(api.getCreditScore).mockReturnValue(new Promise(() => {}))
    renderWithId()
    expect(screen.getByText(/analyzing your credit profile/i)).toBeInTheDocument()
  })

  it('renders score and grade on success', async () => {
    vi.mocked(api.getCreditScore).mockResolvedValue({
      applicationId: 'APP-001',
      score: 780,
      grade: 'Excellent',
      factors: ['Good payment history', 'Low utilisation'],
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText('780')).toBeInTheDocument()
      expect(screen.getByText('Excellent')).toBeInTheDocument()
    })
  })

  it('renders all factor items', async () => {
    vi.mocked(api.getCreditScore).mockResolvedValue({
      applicationId: 'APP-001',
      score: 700,
      grade: 'Good',
      factors: ['Stable income', 'No defaults', 'Short credit history'],
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText('Stable income')).toBeInTheDocument()
      expect(screen.getByText('No defaults')).toBeInTheDocument()
      expect(screen.getByText('Short credit history')).toBeInTheDocument()
    })
  })

  it('shows error state and retry button on failure', async () => {
    vi.mocked(api.getCreditScore).mockRejectedValue(new Error('Network error'))
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch credit score/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('retries fetch when Retry button is clicked', async () => {
    vi.mocked(api.getCreditScore)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ applicationId: 'APP-001', score: 750, grade: 'Excellent', factors: [] })
    renderWithId()
    await waitFor(() => screen.getByRole('button', { name: /retry/i }))
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    await waitFor(() => {
      expect(screen.getByText('750')).toBeInTheDocument()
    })
  })

  it('renders Check Approval Status button after data loads', async () => {
    vi.mocked(api.getCreditScore).mockResolvedValue({
      applicationId: 'APP-001',
      score: 680,
      grade: 'Good',
      factors: [],
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /check approval status/i })).toBeInTheDocument()
    })
  })
})
