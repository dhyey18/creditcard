import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../components/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled and shows spinner when loading', () => {
    render(<Button loading>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Submit</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies primary styles by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button').className).toContain('bg-blue-700')
  })

  it('applies secondary styles for variant=secondary', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const cls = screen.getByRole('button').className
    expect(cls).toContain('border-blue-700')
    expect(cls).not.toContain('bg-blue-700')
  })

  it('applies danger styles for variant=danger', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button').className).toContain('bg-red-600')
  })
})
