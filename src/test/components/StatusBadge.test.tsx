import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../../components/StatusBadge'

describe('StatusBadge', () => {
  it('renders "Approved" label for approved status', () => {
    render(<StatusBadge status="approved" />)
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders "Rejected" label for rejected status', () => {
    render(<StatusBadge status="rejected" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('renders "Pending" label for pending status', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('applies green classes for approved', () => {
    const { container } = render(<StatusBadge status="approved" />)
    expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-700')
  })

  it('applies red classes for rejected', () => {
    const { container } = render(<StatusBadge status="rejected" />)
    expect(container.firstChild).toHaveClass('bg-red-100', 'text-red-700')
  })

  it('applies yellow classes for pending', () => {
    const { container } = render(<StatusBadge status="pending" />)
    expect(container.firstChild).toHaveClass('bg-yellow-100', 'text-yellow-700')
  })
})
