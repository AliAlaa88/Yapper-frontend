import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import {
    formatDate,
    formatConversationDate,
    formatMessageDate,
    parseTextWithTags,
    handleImageError,
    shorterName,
} from '../helpers'

describe('helpers', () => {
    describe('formatDate', () => {
        it('returns seconds for very recent dates', () => {
            const now = new Date()
            const thirtySecAgo = new Date(now.getTime() - 30 * 1000).toISOString()

            const result = formatDate(thirtySecAgo)

            expect(result).toMatch(/^\d+s$/)
        })

        it('returns minutes for dates within an hour', () => {
            const now = new Date()
            const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString()

            const result = formatDate(thirtyMinAgo)

            expect(result).toMatch(/^\d+m$/)
        })

        it('returns hours for dates within a day', () => {
            const now = new Date()
            const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString()

            const result = formatDate(fiveHoursAgo)

            expect(result).toMatch(/^\d+h$/)
        })

        it('returns days for dates within a week', () => {
            const now = new Date()
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()

            const result = formatDate(threeDaysAgo)

            expect(result).toMatch(/^\d+d$/)
        })

        it('returns formatted date for older dates', () => {
            const now = new Date()
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

            const result = formatDate(twoWeeksAgo)

            // Should be in "Mon day" format
            expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}/)
        })
    })

    describe('formatConversationDate', () => {
        it('returns empty string for empty date', () => {
            const result = formatConversationDate('')
            expect(result).toBe('')
        })

        it('returns "now" for very recent dates', () => {
            const now = dayjs().toISOString()
            const result = formatConversationDate(now)

            expect(result).toBe('now')
        })

        it('returns minutes for dates within an hour', () => {
            const thirtyMinAgo = dayjs().subtract(30, 'minute').toISOString()
            const result = formatConversationDate(thirtyMinAgo)

            expect(result).toMatch(/^\d+m$/)
        })

        it('returns hours for dates within a day', () => {
            const fiveHoursAgo = dayjs().subtract(5, 'hour').toISOString()
            const result = formatConversationDate(fiveHoursAgo)

            expect(result).toMatch(/^\d+h$/)
        })

        it('returns days for dates within a week', () => {
            const threeDaysAgo = dayjs().subtract(3, 'day').toISOString()
            const result = formatConversationDate(threeDaysAgo)

            expect(result).toMatch(/^\d+d$/)
        })

        it('returns formatted date for older dates', () => {
            const twoWeeksAgo = dayjs().subtract(14, 'day').toISOString()
            const result = formatConversationDate(twoWeeksAgo)

            // Should be in "Mon D" format
            expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}/)
        })
    })

    describe('formatMessageDate', () => {
        it('returns time for today messages', () => {
            const now = dayjs().toISOString()
            const result = formatMessageDate(now)

            // Should be in "h:mm A" format
            expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/)
        })

        it('returns day and time for recent week messages', () => {
            const threeDaysAgo = dayjs().subtract(3, 'day').toISOString()
            const result = formatMessageDate(threeDaysAgo)

            // Should include day name
            expect(result).toMatch(/[A-Za-z]+ \d{1,2}:\d{2} [AP]M/)
        })

        it('returns full date for older messages', () => {
            const twoWeeksAgo = dayjs().subtract(14, 'day').toISOString()
            const result = formatMessageDate(twoWeeksAgo)

            // Should be in "Mon D, YYYY h:mm A" format
            expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
        })
    })

    describe('parseTextWithTags', () => {
        it('returns empty string for empty input', () => {
            const result = parseTextWithTags('')
            expect(result).toBe('')
        })

        it('returns plain text unchanged when no tags', () => {
            const result = parseTextWithTags('Hello world')
            expect(result).toBe('Hello world')
        })

        it('wraps hashtags in styled spans', () => {
            const result = parseTextWithTags('Hello #world')

            expect(result).toContain('<span class="text-[#1d9bf0] font-normal">#world</span>')
        })

        it('wraps mentions in styled spans', () => {
            const result = parseTextWithTags('Hello @user')

            expect(result).toContain('<span class="text-[#1d9bf0] font-normal">@user</span>')
        })

        it('handles multiple hashtags', () => {
            const result = parseTextWithTags('#hello #world')

            expect(result).toContain('#hello</span>')
            expect(result).toContain('#world</span>')
        })

        it('handles multiple mentions', () => {
            const result = parseTextWithTags('@user1 @user2')

            expect(result).toContain('@user1</span>')
            expect(result).toContain('@user2</span>')
        })

        it('handles mixed hashtags and mentions', () => {
            const result = parseTextWithTags('@user says #hello')

            expect(result).toContain('@user</span>')
            expect(result).toContain('#hello</span>')
        })

        it('escapes HTML special characters', () => {
            const result = parseTextWithTags('<script>alert("xss")</script>')

            expect(result).not.toContain('<script>')
            expect(result).toContain('&lt;script&gt;')
        })
    })

    describe('handleImageError', () => {
        it('sets fallback avatar URL on error', () => {
            const mockEvent = {
                target: {
                    src: '',
                } as HTMLImageElement,
            } as unknown as Event

            handleImageError('TestUser', mockEvent)

            expect((mockEvent.target as HTMLImageElement).src).toBe(
                'https://ui-avatars.com/api/?name=TestUser&background=random',
            )
        })
    })

    describe('shorterName', () => {
        it('returns name unchanged if shorter than maxLength', () => {
            const result = shorterName('John', 15)
            expect(result).toBe('John')
        })

        it('truncates name and adds ellipsis if longer than maxLength', () => {
            const result = shorterName('VeryLongUsernameThatExceedsLimit', 15)
            expect(result).toBe('VeryLongUsernam...')
        })

        it('uses default maxLength of 15', () => {
            const result = shorterName('ShortName')
            expect(result).toBe('ShortName')
        })

        it('truncates to default maxLength of 15', () => {
            const result = shorterName('ThisIsAVeryLongName')
            expect(result).toBe('ThisIsAVeryLong...')
        })
    })
})
