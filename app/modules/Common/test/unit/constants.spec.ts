import { describe, it, expect } from 'vitest'
import { LOCALE_COOKIE_KEY } from '../../constants/localStorageConstants'
import { tooltipContentClass } from '../../constants/stylesConstants'

describe('Constants', () => {
    describe('localStorageConstants', () => {
        it('should export LOCALE_COOKIE_KEY', () => {
            expect(LOCALE_COOKIE_KEY).toBeDefined()
        })

        it('should have correct LOCALE_COOKIE_KEY value', () => {
            expect(LOCALE_COOKIE_KEY).toBe('i18n_redirected')
        })

        it('should be a string', () => {
            expect(typeof LOCALE_COOKIE_KEY).toBe('string')
        })

        it('should not be empty', () => {
            expect(LOCALE_COOKIE_KEY.length).toBeGreaterThan(0)
        })
    })

    describe('stylesConstants', () => {
        it('should export tooltipContentClass', () => {
            expect(tooltipContentClass).toBeDefined()
        })

        it('should be a string', () => {
            expect(typeof tooltipContentClass).toBe('string')
        })

        it('should contain tailwind classes', () => {
            expect(tooltipContentClass).toContain('text-white')
            expect(tooltipContentClass).toContain('bg-')
            expect(tooltipContentClass).toContain('rounded-md')
        })

        it('should have specific styling', () => {
            expect(tooltipContentClass).toBe(
                'text-white bg-[#536471] text-[12px] font-medium p-1 rounded-md',
            )
        })

        it('should not be empty', () => {
            expect(tooltipContentClass.length).toBeGreaterThan(0)
        })

        it('should include color hex value', () => {
            expect(tooltipContentClass).toContain('#536471')
        })

        it('should include padding', () => {
            expect(tooltipContentClass).toContain('p-1')
        })

        it('should include font styling', () => {
            expect(tooltipContentClass).toContain('font-medium')
        })

        it('should include text size', () => {
            expect(tooltipContentClass).toContain('text-[12px]')
        })
    })

    describe('Constants exports', () => {
        it('should not have name conflicts', () => {
            const locale = LOCALE_COOKIE_KEY
            const tooltip = tooltipContentClass
            expect(locale).not.toBe(tooltip)
        })

        it('should have distinct purposes', () => {
            expect(LOCALE_COOKIE_KEY).toMatch(/i18n|locale/i)
            expect(tooltipContentClass).toMatch(/text|bg|rounded/i)
        })
    })
})
