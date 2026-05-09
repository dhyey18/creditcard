import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ActivateCard from '../../pages/ActivateCard'
import * as api from '../../api/creditCard'

vi.mock('../../api/creditCard')

const renderPage = () =>
  render(
    <MemoryRouter>
      <ActivateCard />
    </MemoryRouter>
  )

const fillForm = async (overrides: Record<string, string> = {}) => {
  const values = {
    cardNumber: '1234567890123456',
    pan: 'ABCDE1234F',
    oldPin: '1234',
    newPin: '5678',
    ...overrides,
  }
  await userEvent.type(screen.getByLabelText('Card Number (16 digits)'), values.cardNumber)
  await userEvent.type(screen.getByLabelText('PAN Number'), values.pan)
  await userEvent.type(screen.getByLabelText('Old PIN'), values.oldPin)
  await userEvent.type(screen.getByLabelText('New PIN'), values.newPin)
}

describe('ActivateCard page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all form fields', () => {
    renderPage()
    expect(screen.getByLabelText('Card Number (16 digits)')).toBeInTheDocument()
    expect(screen.getByLabelText('PAN Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Old PIN')).toBeInTheDocument()
    expect(screen.getByLabelText('New PIN')).toBeInTheDocument()
    expect(screen.queryByLabelText('Confirm New PIN')).not.toBeInTheDocument()
  })

  it('shows card number validation error for non-16-digit input', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('Card Number (16 digits)'), '12345')
    await userEvent.click(screen.getByRole('button', { name: /activate/i }))
    await waitFor(() => {
      expect(screen.getByText(/card number must be 16 digits/i)).toBeInTheDocument()
    })
  })

  it('shows PAN validation error for invalid PAN', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('PAN Number'), 'invalid')
    await userEvent.click(screen.getByRole('button', { name: /activate/i }))
    await waitFor(() => {
      expect(screen.getByText(/invalid pan/i)).toBeInTheDocument()
    })
  })

  it('shows success state after successful activation', async () => {
    vi.mocked(api.activateCard).mockResolvedValue({
      success: true,
      message: 'Card activated and PIN changed successfully.',
    })
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /activate/i }))
    await waitFor(() => {
      expect(screen.getByText('Card Activated!')).toBeInTheDocument()
      expect(screen.getByText(/card activated and pin changed/i)).toBeInTheDocument()
    })
  })

  it('shows API error message on failure', async () => {
    vi.mocked(api.activateCard).mockRejectedValue(new Error('Bad request'))
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /activate/i }))
    await waitFor(() => {
      expect(screen.getByText(/activation failed/i)).toBeInTheDocument()
    })
  })

  it('can reset from success state via "Change PIN Again" button', async () => {
    vi.mocked(api.activateCard).mockResolvedValue({
      success: true,
      message: 'Done.',
    })
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /activate/i }))
    await waitFor(() => screen.getByText('Card Activated!'))
    await userEvent.click(screen.getByRole('button', { name: /change pin again/i }))
    expect(screen.getByLabelText('Card Number (16 digits)')).toBeInTheDocument()
  })
})
