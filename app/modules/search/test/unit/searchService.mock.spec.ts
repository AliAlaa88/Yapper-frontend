import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchServiceMock } from '../../services/searchService.mock'

describe('searchServiceMock', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getSearchSuggestions', () => {
        it('returns search suggestions with suggested_queries', async () => {
            const result = await searchServiceMock.getSearchSuggestions('ali')
            
            expect(result).toBeDefined()
            expect(result.suggested_queries).toBeDefined()
            expect(Array.isArray(result.suggested_queries)).toBe(true)
        })

        it('returns search suggestions with suggested_users', async () => {
            const result = await searchServiceMock.getSearchSuggestions('ali')
            
            expect(result.suggested_users).toBeDefined()
            expect(Array.isArray(result.suggested_users)).toBe(true)
        })

        it('suggested queries have correct structure', async () => {
            const result = await searchServiceMock.getSearchSuggestions('ali')
            
            expect(result.suggested_queries.length).toBeGreaterThan(0)
            const query = result.suggested_queries[0]
            expect(query).toHaveProperty('query')
            expect(query).toHaveProperty('is_trending')
        })

        it('suggested users have correct structure', async () => {
            const result = await searchServiceMock.getSearchSuggestions('ali')
            
            expect(result.suggested_users.length).toBeGreaterThan(0)
            const user = result.suggested_users[0]
            expect(user).toHaveProperty('user_id')
            expect(user).toHaveProperty('name')
            expect(user).toHaveProperty('username')
            expect(user).toHaveProperty('avatar_url')
            expect(user).toHaveProperty('is_following')
            expect(user).toHaveProperty('is_follower')
        })
    })

    describe('getUsers', () => {
        it('returns empty array when query is empty', async () => {
            const result = await searchServiceMock.getUsers('')
            
            expect(result).toEqual([])
        })

        it('filters users by username', async () => {
            const result = await searchServiceMock.getUsers('alyaa')
            
            expect(Array.isArray(result)).toBe(true)
            result.forEach((user: { username: string }) => {
                expect(user.username.toLowerCase()).toContain('alyaa')
            })
        })

        it('filters users by name', async () => {
            const result = await searchServiceMock.getUsers('Ali')
            
            expect(Array.isArray(result)).toBe(true)
        })

        it('limits results to 5 users', async () => {
            const result = await searchServiceMock.getUsers('a')
            
            expect(result.length).toBeLessThanOrEqual(5)
        })

        it('returns users matching the query case-insensitively', async () => {
            const result = await searchServiceMock.getUsers('ALYAA')
            
            expect(Array.isArray(result)).toBe(true)
        })

        it('returns empty array when no users match', async () => {
            const result = await searchServiceMock.getUsers('zzzznonexistent')
            
            expect(result).toEqual([])
        })
    })
})
