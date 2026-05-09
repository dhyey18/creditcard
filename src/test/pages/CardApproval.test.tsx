import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CardApproval from '../../pages/CardApproval'
import * as api from '../../api/creditCard'

vi.mock('../../api/creditCard')

const renderWithId = (id = 'APP-001') =>
  render(
    <MemoryRouter initialEntries={[`/approval/${id}`]}>
      <Routes>
        <Route path="/approval/:id" element={<CardApproval />} />
      </Routes>
    </MemoryRouter>
  )

describe('CardApproval page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading spinner while fetching', () => {
    vi.mocked(api.getApprovalStatus).mockReturnValue(new Promise(() => {}))
    renderWithId()
    expect(screen.getByText(/fetching your approval status/i)).toBeInTheDocument()
  })

  it('shows Approved badge and card details for approved status', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-001',
      status: 'approved',
      creditLimit: 200000,
      cardType: 'Platinum',
      interestRate: 3.5,
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument()
      expect(screen.getByText('Platinum')).toBeInTheDocument()
      expect(screen.getByText('3.5% p.a.')).toBeInTheDocument()
    })
  })

  it('shows credit limit formatted in Indian locale', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-001',
      status: 'approved',
      creditLimit: 200000,
      cardType: 'Gold',
      interestRate: 2.9,
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText('₹2,00,000')).toBeInTheDocument()
    })
  })

  it('shows Activate Card button when approved', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-001',
      status: 'approved',
      creditLimit: 100000,
      cardType: 'Silver',
      interestRate: 4.0,
    })
    renderWithId()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /activate card/i })).toBeInTheDocument()
    })
  })

  it('shows Rejected badge and reason for rejected status', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-002',
      status: 'rejected',
      rejectionReason: 'Insufficient income',
    })
    renderWithId('APP-002')
    await waitFor(() => {
      expect(screen.getByText('Rejected')).toBeInTheDocument()
      expect(screen.getByText('Insufficient income')).toBeInTheDocument()
    })
  })

  it('does not show Activate Card button when rejected', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-002',
      status: 'rejected',
    })
    renderWithId('APP-002')
    await waitFor(() => screen.getByText('Rejected'))
    expect(screen.queryByRole('link', { name: /activate card/i })).not.toBeInTheDocument()
  })

  it('shows Pending badge for pending status', async () => {
    vi.mocked(api.getApprovalStatus).mockResolvedValue({
      applicationId: 'APP-003',
      status: 'pending',
    })
    renderWithId('APP-003')
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    vi.mocked(api.getApprovalStatus).mockRejectedValue(new Error('Server error'))
    renderWithId()
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch approval status/i)).toBeInTheDocument()
    })
  })
})
