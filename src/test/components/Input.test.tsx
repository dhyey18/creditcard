import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../../components/Input'

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Full Name" id="name" />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
  })

  it('shows error message when error prop is set', () => {
    render(<Input label="PAN" id="pan" error="Invalid PAN format" />)
    expect(screen.getByText('Invalid PAN format')).toBeInTheDocument()
  })

  it('applies red border class when error is present', () => {
    render(<Input label="PAN" id="pan" error="Required" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-red-400')
  })

  it('applies normal border when no error', () => {
    render(<Input label="PAN" id="pan" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-slate-300')
  })

  it('does not show error message when error is undefined', () => {
    render(<Input label="Name" id="name" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('accepts user input', async () => {
    render(<Input label="City" id="city" />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Mumbai')
    expect(input).toHaveValue('Mumbai')
  })

  it('passes placeholder through', () => {
    render(<Input label="Phone" id="phone" placeholder="10-digit number" />)
    expect(screen.getByPlaceholderText('10-digit number')).toBeInTheDocument()
  })

  it('passes type through (password input has no accessible role textbox)', () => {
    render(<Input label="PIN" id="pin" type="password" />)
    // password inputs aren't role=textbox; query by label instead
    expect(screen.getByLabelText('PIN')).toHaveAttribute('type', 'password')
  })
})
