import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ApplyCard from '../../pages/ApplyCard'
import * as api from '../../api/creditCard'

vi.mock('../../api/creditCard')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <ApplyCard />
    </MemoryRouter>
  )

// Fill every required field in the form
const fillForm = async () => {
  await userEvent.type(screen.getByLabelText('First Name'), 'John')
  await userEvent.type(screen.getByLabelText('Last Name'), 'Doe')
  await userEvent.type(screen.getByLabelText('Phone Number'), '9876543210')
  await userEvent.type(screen.getByLabelText('PAN Number'), 'ABCDE1234F')
  await userEvent.type(screen.getByLabelText('City'), 'Mumbai')
  await userEvent.type(screen.getByLabelText('Company Name'), 'Acme Corp')
  await userEvent.type(screen.getByLabelText('Years at Current Job'), '3')
  await userEvent.type(screen.getByLabelText('Total Experience (years)'), '7')
  await userEvent.type(screen.getByLabelText('Monthly Salary (₹)'), '600000')
  await userEvent.type(screen.getByLabelText('Aadhaar Card Number'), '123456789012')
  await userEvent.type(screen.getByLabelText('PAN Card Number'), 'ABCDE1234F')
}

describe('ApplyCard page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all three section headings', () => {
    renderPage()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Employment')).toBeInTheDocument()
    expect(screen.getByText('Identity')).toBeInTheDocument()
  })

  it('renders all required fields', () => {
    renderPage()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('PAN Number')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Years at Current Job')).toBeInTheDocument()
    expect(screen.getByLabelText('Total Experience (years)')).toBeInTheDocument()
    expect(screen.getByLabelText('Monthly Salary (₹)')).toBeInTheDocument()
    expect(screen.getByLabelText('Aadhaar Card Number')).toBeInTheDocument()
    expect(screen.getByLabelText('PAN Card Number')).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /submit application/i }))
    await waitFor(() => {
      expect(screen.getByText(/first name must be at least/i)).toBeInTheDocument()
    })
  })

  it('shows phone validation error for invalid phone', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('Phone Number'), '12345')
    await userEvent.click(screen.getByRole('button', { name: /submit application/i }))
    await waitFor(() => {
      expect(screen.getByText(/phone must be 10 digits/i)).toBeInTheDocument()
    })
  })

  it('shows PAN validation error for invalid PAN', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText('PAN Number'), 'invalid')
    await userEvent.click(screen.getByRole('button', { name: /submit application/i }))
    await waitFor(() => {
      expect(screen.getAllByText(/invalid pan/i).length).toBeGreaterThan(0)
    })
  })

  it('navigates to credit-score page on successful submit', async () => {
    vi.mocked(api.submitApplication).mockResolvedValue({ applicationId: 'APP-123' })
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /submit application/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/credit-score/APP-123')
    })
  })

  it('shows API error message when submission fails', async () => {
    vi.mocked(api.submitApplication).mockRejectedValue(new Error('Network Error'))
    renderPage()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /submit application/i }))
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument()
    })
  })
})
