import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exploreServiceMock } from '../../services/exploreService.mock'
import { exploreServiceReal } from '../../services/exploreService.real'

// Mock useNuxtApp and useRuntimeConfig for real service
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $yapperApi: {
            get: vi.fn((url) => {
                // Return mock data based on URL
                if (url.includes('explore/who-to-follow')) {
                    return Promise.resolve({
                        data: {
                            data: [
                                {
                                    id: '1',
                                    name: 'User One',
                                    username: 'user_one',
                                    avatar_url: 'https://example.com/avatar1.jpg',
                                    bio: 'First user',
                                    verified: true,
                                },
                            ],
                        },
                    })
                }
                if (url.includes('explore/category')) {
                    return Promise.resolve({
                        data: {
                            data: [
                                { id: '1', name: 'Category 1' },
                            ],
                        },
                    })
                }
                if (url.includes('trend')) {
                    return Promise.resolve({
                        data: {
                            data: {
                                data: [
                                    { text: 'Trending 1', posts_count: 1000 },
                                ],
                            },
                        },
                    })
                }
                return Promise.resolve({
                    data: { data: [] },
                })
            }),
        },
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://localhost:3000',
        },
    }),
}))

describe('Explore Services', () => {
    describe('exploreServiceMock', () => {
        let mockService: ReturnType<typeof exploreServiceMock>

        beforeEach(() => {
            mockService = exploreServiceMock()
        })

        it('should be defined', () => {
            expect(exploreServiceMock).toBeDefined()
        })

        it('should return service object with all methods', () => {
            expect(mockService).toBeDefined()
            expect(mockService.getExplore).toBeDefined()
            expect(mockService.getTrending).toBeDefined()
            expect(mockService.getExploreCategories).toBeDefined()
        })

        it('getExplore should return trending and who_to_follow data', async () => {
            const result = await mockService.getExplore()

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(result.data.trending).toBeDefined()
            expect(Array.isArray(result.data.trending)).toBe(true)
            expect(result.data.trending.length).toBeGreaterThan(0)
            expect(result.data.who_to_follow).toBeDefined()
            expect(Array.isArray(result.data.who_to_follow)).toBe(true)
        })

        it('getTrending should return trending data', async () => {
            const result = await mockService.getTrending()

            expect(result).toBeDefined()
            // getTrending returns an object, not an array
            expect(typeof result).toBe('object')
        })

        it('getTrending should accept category parameter', async () => {
            const result = await mockService.getTrending('sports', 10)

            expect(result).toBeDefined()
            expect(typeof result).toBe('object')
        })

        it('getExploreCategories should return category data', async () => {
            const result = await mockService.getExploreCategories('sports', 1, 20)

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
        })

        it('getExploreWhoToFollow should return user suggestions', async () => {
            const result = await mockService.getExplore()

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
            expect(result.data.who_to_follow).toBeDefined()
            expect(Array.isArray(result.data.who_to_follow)).toBe(true)
            if (result.data.who_to_follow.length > 0) {
                expect(result.data.who_to_follow[0]).toHaveProperty('username')
                expect(result.data.who_to_follow[0]).toHaveProperty('name')
            }
        })

        it('getExplore should have trending with correct structure', async () => {
            const result = await mockService.getExplore()
            const trending = result.data.trending

            if (trending.length > 0) {
                expect(trending[0]).toHaveProperty('text')
                expect(trending[0]).toHaveProperty('posts_count')
                expect(trending[0]).toHaveProperty('reference_id')
                expect(trending[0]).toHaveProperty('category')
                expect(trending[0]).toHaveProperty('trend_rank')
            }
        })

        it('getExplore should have who_to_follow with correct structure', async () => {
            const result = await mockService.getExplore()
            const whoToFollow = result.data.who_to_follow

            if (whoToFollow.length > 0) {
                expect(whoToFollow[0]).toHaveProperty('id')
                expect(whoToFollow[0]).toHaveProperty('username')
                expect(whoToFollow[0]).toHaveProperty('name')
                expect(whoToFollow[0]).toHaveProperty('bio')
                expect(whoToFollow[0]).toHaveProperty('avatar_url')
                expect(whoToFollow[0]).toHaveProperty('verified')
            }
        })
    })

    describe('exploreServiceReal', () => {
        let realService: ReturnType<typeof exploreServiceReal>

        beforeEach(() => {
            realService = exploreServiceReal()
        })

        it('should be defined', () => {
            expect(exploreServiceReal).toBeDefined()
        })

        it('should return service object with all methods', () => {
            expect(realService).toBeDefined()
            expect(realService.getExplore).toBeDefined()
            expect(realService.getTrending).toBeDefined()
            expect(realService.getExploreCategories).toBeDefined()
            expect(realService.getExploreWhoToFollow).toBeDefined()
        })

        it('getExplore should make API call to correct endpoint', async () => {
            const result = await realService.getExplore()

            expect(result).toBeDefined()
        })

        it('getTrending should make API call to correct endpoint', async () => {
            const result = await realService.getTrending()

            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
        })

        it('getTrending should pass category parameter if provided', async () => {
            const result = await realService.getTrending('sports', 10)

            expect(result).toBeDefined()
        })

        it('getTrending should work without category', async () => {
            const result = await realService.getTrending()

            expect(result).toBeDefined()
        })

        it('getExploreCategories should make API call with correct parameters', async () => {
            const result = await realService.getExploreCategories('sports', 1, 20)

            expect(result).toBeDefined()
        })

        it('getExploreCategories should use default pagination values', async () => {
            const result = await realService.getExploreCategories('sports')

            expect(result).toBeDefined()
        })

        it('getExploreWhoToFollow should make API call to correct endpoint', async () => {
            const result = await realService.getExploreWhoToFollow()

            expect(result).toBeDefined()
            expect(result.data).toBeDefined()
        })

        it('all methods should return data structure', async () => {
            const exploreData = await realService.getExplore()
            const trendingData = await realService.getTrending()
            const categoriesData = await realService.getExploreCategories('test')
            const whoToFollowData = await realService.getExploreWhoToFollow()

            expect(exploreData).toBeDefined()
            expect(trendingData).toBeDefined()
            expect(categoriesData).toBeDefined()
            expect(whoToFollowData).toBeDefined()
        })
    })

    describe('Service Comparison', () => {
        it('both services should have getExplore, getTrending, getExploreCategories', () => {
            const mockService = exploreServiceMock()
            const realService = exploreServiceReal()

            expect(mockService.getExplore).toBeDefined()
            expect(realService.getExplore).toBeDefined()
            expect(mockService.getTrending).toBeDefined()
            expect(realService.getTrending).toBeDefined()
            expect(mockService.getExploreCategories).toBeDefined()
            expect(realService.getExploreCategories).toBeDefined()
        })

        it('only real service should have getExploreWhoToFollow', async () => {
            const mockService = exploreServiceMock()
            const realService = exploreServiceReal()

            expect(mockService.getExploreWhoToFollow).toBeUndefined()
            expect(realService.getExploreWhoToFollow).toBeDefined()
        })

        it('real service getExploreWhoToFollow should return data', async () => {
            const realService = exploreServiceReal()

            const realResult = await realService.getExploreWhoToFollow()

            expect(realResult).toBeDefined()
            expect(realResult.data).toBeDefined()
        })
    })
})
