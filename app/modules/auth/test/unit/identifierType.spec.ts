import { describe, it, expect } from 'vitest'
import { getIdentifierType } from '../../utils/identifierType'

describe('getIdentifierType', () => {
    describe('email detection', () => {
        it('should detect valid email addresses', () => {
            expect(getIdentifierType('user@example.com')).toBe('email')
            expect(getIdentifierType('john.doe@company.co.uk')).toBe('email')
            expect(getIdentifierType('test.email+tag@domain.org')).toBe('email')
        })

        it('should detect email with various domains', () => {
            expect(getIdentifierType('admin@localhost.test')).toBe('email')
            expect(getIdentifierType('user@subdomain.example.com')).toBe('email')
        })

        it('should not detect invalid emails as email', () => {
            expect(getIdentifierType('notanemail')).not.toBe('email')
            expect(getIdentifierType('user@')).not.toBe('email')
            expect(getIdentifierType('@example.com')).not.toBe('email')
        })
    })

    describe('phone detection', () => {
        it('should detect valid phone numbers', () => {
            expect(getIdentifierType('1234567890')).toBe('phone')
            expect(getIdentifierType('+1-234-567-8900')).toBe('phone')
            expect(getIdentifierType('(123) 456-7890')).toBe('phone')
        })

        it('should detect phone numbers with various formats', () => {
            expect(getIdentifierType('123 456 7890')).toBe('phone')
            expect(getIdentifierType('123-456-7890')).toBe('phone')
            expect(getIdentifierType('+1234567890')).toBe('phone')
        })

        it('should require minimum 10 digits', () => {
            expect(getIdentifierType('123456789')).not.toBe('phone') // 9 digits
        })

        it('should not exceed maximum 15 digits', () => {
            expect(getIdentifierType('1234567890123456')).not.toBe('phone') // 16 digits
        })

        it('should allow exactly 10-15 digits', () => {
            expect(getIdentifierType('1234567890')).toBe('phone') // 10 digits
            expect(getIdentifierType('12345678901234')).toBe('phone') // 14 digits
            expect(getIdentifierType('123456789012345')).toBe('phone') // 15 digits
        })
    })

    describe('username detection', () => {
        it('should default to username for non-email/phone formats', () => {
            expect(getIdentifierType('john_doe')).toBe('username')
            expect(getIdentifierType('user123')).toBe('username')
            expect(getIdentifierType('john.doe')).toBe('username')
        })

        it('should treat invalid identifiers as username', () => {
            expect(getIdentifierType('special@chars!invalid')).toBe('username')
        })
    })

    describe('edge cases', () => {
        it('should handle empty string', () => {
            expect(getIdentifierType('')).toBe('username')
        })

        it('should handle null-like values gracefully', () => {
            // @ts-ignore - testing edge case
            expect(getIdentifierType(null)).toBe('username')
            // @ts-ignore - testing edge case
            expect(getIdentifierType(undefined)).toBe('username')
        })

        it('should handle whitespace', () => {
            expect(getIdentifierType('   ')).toBe('username')
            expect(getIdentifierType('  user@example.com  ')).toBe('email')
        })

        it('should handle non-string types', () => {
            // @ts-ignore - testing edge case
            expect(getIdentifierType(123)).toBe('username')
            // @ts-ignore - testing edge case
            expect(getIdentifierType({})).toBe('username')
        })
    })

    describe('priority order', () => {
        it('should prioritize email over phone-like patterns', () => {
            expect(getIdentifierType('user@domain.com')).toBe('email')
        })

        it('should prioritize phone over username when it has digits', () => {
            expect(getIdentifierType('1234567890')).toBe('phone')
        })

        it('should return username as fallback', () => {
            expect(getIdentifierType('username')).toBe('username')
        })
    })

    describe('phone format variations', () => {
        it('should recognize international phone formats', () => {
            expect(getIdentifierType('+44-20-7946-0958')).toBe('phone')
            expect(getIdentifierType('+33 1 42 68 53 00')).toBe('phone')
        })

        it('should handle phone numbers with hyphens and parentheses', () => {
            expect(getIdentifierType('(555) 123-4567')).toBe('phone')
            expect(getIdentifierType('555-123-4567')).toBe('phone')
        })
    })
})
