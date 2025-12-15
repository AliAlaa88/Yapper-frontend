import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calculateAge, formatDate, formatFullDateTime } from '~/modules/settings/utils/calculations'

describe('calculations', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should calculate correct age for past birthday', () => {
        vi.setSystemTime(new Date('2025-12-15'))

        const age = calculateAge('1990-12-15')
        expect(age).toBe(35)

        const ageBeforeBirthday = calculateAge('1990-12-14')
        expect(ageBeforeBirthday).toBe(35)
    })

    it('should calculate correct age before birthday', () => {
        vi.setSystemTime(new Date('2025-12-15'))

        const age = calculateAge('1990-12-16')
        expect(age).toBe(34)

        const ageJanuary = calculateAge('1990-01-01')
        expect(ageJanuary).toBe(35)
    })

    it('should format date correctly', () => {
        const dateStr = '2025-12-15T10:30:00Z'

        const formatted = formatDate(dateStr)

        expect(formatted).toMatch(/Dec 15, 2025/)
    })

    it('should handle different date formats', () => {
        const dates = ['2020-01-01', '2023-06-15', '2025-12-31']

        dates.forEach((dateStr) => {
            const formatted = formatDate(dateStr)
            expect(formatted).toMatch(/\d{1,2}, \d{4}/)
        })
    })

    it('should format full date time with correct format', () => {
        const isoDateStr = '2025-12-15T14:30:45Z'

        const formatted = formatFullDateTime(isoDateStr)

        expect(formatted).toMatch(/Dec/)
        expect(formatted).toMatch(/\d{1,2}/)
        expect(formatted).toMatch(/(AM|PM)/)
    })

    it('should handle edge case dates', () => {
        const leapYearDate = '2024-02-29T12:00:00Z'
        const formattedLeap = formatFullDateTime(leapYearDate)
        expect(formattedLeap).toContain('Feb')
        expect(formattedLeap).toContain('29')


        const startOfYear = '2025-01-01T12:00:00Z'
        const formattedStart = formatFullDateTime(startOfYear)
        expect(formattedStart).toContain('Jan')
        expect(formattedStart).toContain('01')
    })
})
