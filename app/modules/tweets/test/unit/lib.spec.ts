import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, formatCount, formatDetailDate } from '../../utils/lib'

describe('lib utilities', () => {
  describe('formatDate', () => {
    let mockNow: Date

    beforeEach(() => {
      // Mock the current date to Oct 30, 2025, 12:00:00
      mockNow = new Date('2025-10-30T12:00:00.000Z')
      vi.useFakeTimers()
      vi.setSystemTime(mockNow)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('formats dates less than 60 seconds ago as seconds', () => {
      const date = new Date('2025-10-30T11:59:30.000Z').toISOString()
      expect(formatDate(date)).toBe('30s')
    })

    it('formats dates less than 1 minute ago as seconds', () => {
      const date = new Date('2025-10-30T11:59:45.000Z').toISOString()
      expect(formatDate(date)).toBe('15s')
    })

    it('formats dates less than 60 minutes ago as minutes', () => {
      const date = new Date('2025-10-30T11:30:00.000Z').toISOString()
      expect(formatDate(date)).toBe('30m')
    })

    it('formats dates 1 minute ago as minutes', () => {
      const date = new Date('2025-10-30T11:59:00.000Z').toISOString()
      expect(formatDate(date)).toBe('1m')
    })

    it('formats dates less than 24 hours ago as hours', () => {
      const date = new Date('2025-10-30T08:00:00.000Z').toISOString()
      expect(formatDate(date)).toBe('4h')
    })

    it('formats dates 1 hour ago as hours', () => {
      const date = new Date('2025-10-30T11:00:00.000Z').toISOString()
      expect(formatDate(date)).toBe('1h')
    })

    it('formats dates less than 7 days ago as days', () => {
      const date = new Date('2025-10-28T12:00:00.000Z').toISOString()
      expect(formatDate(date)).toBe('2d')
    })

    it('formats dates 1 day ago as days', () => {
      const date = new Date('2025-10-29T12:00:00.000Z').toISOString()
      expect(formatDate(date)).toBe('1d')
    })

    it('formats dates more than 7 days ago as month and day', () => {
      const date = new Date('2025-10-17T12:00:00.000Z').toISOString()
      const result = formatDate(date)
      expect(result).toBe('Oct 17')
    })

    it('formats dates from different months as month and day', () => {
      const date = new Date('2025-09-15T12:00:00.000Z').toISOString()
      const result = formatDate(date)
      expect(result).toBe('Sep 15')
    })
  })

  describe('formatCount', () => {
    it('returns empty string for 0', () => {
      expect(formatCount(0)).toBe('')
    })

    it('returns the number as string for counts less than 1000', () => {
      expect(formatCount(1)).toBe('1')
      expect(formatCount(999)).toBe('999')
      expect(formatCount(500)).toBe('500')
    })

    it('formats counts less than 10,000 with one decimal place and K', () => {
      expect(formatCount(1000)).toBe('1.0K')
      expect(formatCount(1500)).toBe('1.5K')
      expect(formatCount(9999)).toBe('10.0K')
      expect(formatCount(5432)).toBe('5.4K')
    })

    it('formats counts between 10K and 1M as whole K', () => {
      expect(formatCount(10000)).toBe('10K')
      expect(formatCount(50000)).toBe('50K')
      expect(formatCount(999999)).toBe('999K')
      expect(formatCount(123456)).toBe('123K')
    })

    it('formats counts >= 1M with one decimal place and M', () => {
      expect(formatCount(1000000)).toBe('1.0M')
      expect(formatCount(1500000)).toBe('1.5M')
      expect(formatCount(2345678)).toBe('2.3M')
      expect(formatCount(10000000)).toBe('10.0M')
    })

    it('handles string input by converting to number', () => {
      expect(formatCount('0')).toBe('')
      expect(formatCount('500')).toBe('500')
      expect(formatCount('1000')).toBe('1.0K')
      expect(formatCount('1000000')).toBe('1.0M')
    })
  })

  describe('formatDetailDate', () => {
    it('formats date with time in 12-hour format and full date', () => {
      const date = new Date('2025-10-17T19:54:00.000Z').toISOString()
      const result = formatDetailDate(date)
      
      // The result should match the pattern: "time · month day, year"
      // Note: Time will depend on system timezone, so we'll check the structure
      expect(result).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)\s·\s\w{3}\s\d{1,2},\s\d{4}$/)
    })

    it('includes month abbreviation, day, and year', () => {
      const date = new Date('2025-10-17T12:00:00.000Z').toISOString()
      const result = formatDetailDate(date)
      
      // Should contain month abbreviation and year
      expect(result).toContain('Oct')
      expect(result).toContain('17')
      expect(result).toContain('2025')
      expect(result).toContain('·')
    })

    it('formats PM times correctly', () => {
      const date = new Date('2025-10-17T19:54:00.000Z').toISOString()
      const result = formatDetailDate(date)
      
      // Should contain AM or PM
      expect(result).toMatch(/(AM|PM)/)
    })

    it('formats AM times correctly', () => {
      const date = new Date('2025-10-17T08:30:00.000Z').toISOString()
      const result = formatDetailDate(date)
      
      // Should contain AM or PM
      expect(result).toMatch(/(AM|PM)/)
    })

    it('formats different months correctly', () => {
      const dates = [
        { date: '2025-01-15T12:00:00.000Z', month: 'Jan' },
        { date: '2025-02-15T12:00:00.000Z', month: 'Feb' },
        { date: '2025-12-15T12:00:00.000Z', month: 'Dec' },
      ]

      dates.forEach(({ date, month }) => {
        const result = formatDetailDate(date)
        expect(result).toContain(month)
      })
    })
  })
})
