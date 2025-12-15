import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockTimelineService = {
    createTweet: vi.fn(),
}

vi.mock('./timelineService', () => ({
    timelineService: mockTimelineService,
}))

const { createTimelineService } = await import('./index')

describe('createTimelineService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should export createTimelineService function', () => {
        expect(typeof createTimelineService).toBe('function')
    })

    it('should return timelineService object', () => {
        const service = createTimelineService()
        expect(service).toBeDefined()
        expect(typeof service).toBe('object')
    })

    it('should have createTweet method', () => {
        const service = createTimelineService()
        expect(service).toHaveProperty('createTweet')
        expect(typeof service.createTweet).toBe('function')
    })

    it('should have createReply method', () => {
        const service = createTimelineService()
        expect(service).toHaveProperty('createReply')
        expect(typeof service.createReply).toBe('function')
    })

    it('should have createQuote method', () => {
        const service = createTimelineService()
        expect(service).toHaveProperty('createQuote')
        expect(typeof service.createQuote).toBe('function')
    })

    it('should return same service instance on multiple calls', () => {
        const service1 = createTimelineService()
        const service2 = createTimelineService()
        expect(service1).toEqual(service2)
    })
})
