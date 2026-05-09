import { describe, it, expect } from 'vitest'
import { applyCardSchema, activateCardSchema } from '../types'

// ─── applyCardSchema ──────────────────────────────────────────────────────────

const validApply = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  city: 'Mumbai',
  companyName: 'Acme Corp',
  yearsAtCurrentJob: '2',
  totalExperience: '5',
  salary: '600000',
  aadharCard: '123456789012',
  panCard: 'ABCDE1234F',
}

describe('applyCardSchema', () => {
  it('passes for valid data', () => {
    expect(applyCardSchema.safeParse(validApply).success).toBe(true)
  })

  describe('firstName', () => {
    it('rejects empty string', () => {
      const r = applyCardSchema.safeParse({ ...validApply, firstName: '' })
      expect(r.success).toBe(false)
    })
    it('rejects single character', () => {
      const r = applyCardSchema.safeParse({ ...validApply, firstName: 'J' })
      expect(r.success).toBe(false)
    })
    it('accepts 2+ characters', () => {
      expect(applyCardSchema.safeParse({ ...validApply, firstName: 'Jo' }).success).toBe(true)
    })
  })

  describe('lastName', () => {
    it('rejects empty string', () => {
      expect(applyCardSchema.safeParse({ ...validApply, lastName: '' }).success).toBe(false)
    })
    it('accepts valid last name', () => {
      expect(applyCardSchema.safeParse({ ...validApply, lastName: 'Smith' }).success).toBe(true)
    })
  })

  describe('email', () => {
    it('rejects missing @', () => {
      expect(applyCardSchema.safeParse({ ...validApply, email: 'notanemail' }).success).toBe(false)
    })
    it('rejects empty string', () => {
      expect(applyCardSchema.safeParse({ ...validApply, email: '' }).success).toBe(false)
    })
    it('accepts valid email', () => {
      expect(applyCardSchema.safeParse({ ...validApply, email: 'user@domain.com' }).success).toBe(true)
    })
  })

  describe('phone', () => {
    it('rejects fewer than 10 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, phone: '98765' }).success).toBe(false)
    })
    it('rejects non-numeric', () => {
      expect(applyCardSchema.safeParse({ ...validApply, phone: 'abcdefghij' }).success).toBe(false)
    })
    it('rejects 11 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, phone: '98765432101' }).success).toBe(false)
    })
    it('accepts exactly 10 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, phone: '9876543210' }).success).toBe(true)
    })
  })

  describe('city', () => {
    it('rejects empty city', () => {
      expect(applyCardSchema.safeParse({ ...validApply, city: '' }).success).toBe(false)
    })
    it('accepts valid city', () => {
      expect(applyCardSchema.safeParse({ ...validApply, city: 'Delhi' }).success).toBe(true)
    })
  })

  describe('companyName', () => {
    it('rejects empty company name', () => {
      expect(applyCardSchema.safeParse({ ...validApply, companyName: '' }).success).toBe(false)
    })
    it('rejects single char', () => {
      expect(applyCardSchema.safeParse({ ...validApply, companyName: 'A' }).success).toBe(false)
    })
  })

  describe('yearsAtCurrentJob', () => {
    it('rejects empty string', () => {
      expect(applyCardSchema.safeParse({ ...validApply, yearsAtCurrentJob: '' }).success).toBe(false)
    })
    it('rejects negative value', () => {
      expect(applyCardSchema.safeParse({ ...validApply, yearsAtCurrentJob: '-1' }).success).toBe(false)
    })
    it('accepts 0', () => {
      expect(applyCardSchema.safeParse({ ...validApply, yearsAtCurrentJob: '0' }).success).toBe(true)
    })
  })

  describe('totalExperience', () => {
    it('rejects negative', () => {
      expect(applyCardSchema.safeParse({ ...validApply, totalExperience: '-5' }).success).toBe(false)
    })
    it('accepts valid years', () => {
      expect(applyCardSchema.safeParse({ ...validApply, totalExperience: '10' }).success).toBe(true)
    })
  })

  describe('salary', () => {
    it('rejects below ₹1,00,000', () => {
      expect(applyCardSchema.safeParse({ ...validApply, salary: '50000' }).success).toBe(false)
    })
    it('rejects zero', () => {
      expect(applyCardSchema.safeParse({ ...validApply, salary: '0' }).success).toBe(false)
    })
    it('accepts exactly ₹1,00,000', () => {
      expect(applyCardSchema.safeParse({ ...validApply, salary: '100000' }).success).toBe(true)
    })
    it('accepts above threshold', () => {
      expect(applyCardSchema.safeParse({ ...validApply, salary: '500000' }).success).toBe(true)
    })
  })

  describe('aadharCard', () => {
    it('rejects fewer than 12 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, aadharCard: '12345678901' }).success).toBe(false)
    })
    it('rejects more than 12 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, aadharCard: '1234567890123' }).success).toBe(false)
    })
    it('rejects non-numeric', () => {
      expect(applyCardSchema.safeParse({ ...validApply, aadharCard: 'abcdefghijkl' }).success).toBe(false)
    })
    it('accepts exactly 12 digits', () => {
      expect(applyCardSchema.safeParse({ ...validApply, aadharCard: '123456789012' }).success).toBe(true)
    })
  })

  describe('panCard (identity)', () => {
    it('rejects invalid format', () => {
      expect(applyCardSchema.safeParse({ ...validApply, panCard: '1234ABCDEF' }).success).toBe(false)
    })
    it('accepts valid PAN', () => {
      expect(applyCardSchema.safeParse({ ...validApply, panCard: 'XYZAB9876C' }).success).toBe(true)
    })
  })
})

// ─── activateCardSchema ───────────────────────────────────────────────────────

const validActivate = {
  cardNumber: '1234567890123456',
  pan: 'ABCDE1234F',
  currentPin: '1234',
  newPin: '5678',
  confirmPin: '5678',
}

describe('activateCardSchema', () => {
  it('passes for valid data', () => {
    expect(activateCardSchema.safeParse(validActivate).success).toBe(true)
  })

  describe('cardNumber', () => {
    it('rejects fewer than 16 digits', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, cardNumber: '123456789012345' }).success).toBe(false)
    })
    it('rejects non-numeric', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, cardNumber: '12345678ABCD1234' }).success).toBe(false)
    })
    it('accepts exactly 16 digits', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, cardNumber: '9876543212345678' }).success).toBe(true)
    })
  })

  describe('pan', () => {
    it('rejects invalid PAN format', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, pan: 'invalid' }).success).toBe(false)
    })
    it('rejects lowercase PAN', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, pan: 'abcde1234f' }).success).toBe(false)
    })
    it('accepts valid PAN', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, pan: 'XYZAB9876C' }).success).toBe(true)
    })
  })

  describe('currentPin', () => {
    it('rejects non-numeric PIN', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, currentPin: 'abcd' }).success).toBe(false)
    })
    it('rejects PIN shorter than 4', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, currentPin: '123' }).success).toBe(false)
    })
    it('rejects PIN longer than 4', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, currentPin: '12345' }).success).toBe(false)
    })
  })

  describe('PIN match', () => {
    it('rejects when newPin and confirmPin differ', () => {
      const r = activateCardSchema.safeParse({ ...validActivate, newPin: '1111', confirmPin: '2222' })
      expect(r.success).toBe(false)
      if (!r.success) {
        const paths = r.error.issues.map((i) => i.path.join('.'))
        expect(paths).toContain('confirmPin')
      }
    })
    it('passes when newPin and confirmPin match', () => {
      expect(activateCardSchema.safeParse({ ...validActivate, newPin: '9999', confirmPin: '9999' }).success).toBe(true)
    })
  })
})
