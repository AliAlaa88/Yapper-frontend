import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userInfoServiceMock } from '../../services/userInfoService.mock'

const mockAxios = {
    get: vi.fn(),
    request: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: vi.fn(() => ({
        $axios: mockAxios,
    })),
}))

describe('userInfoService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getUserInfoByUsername', () => {
        it('fetches user by username successfully', async () => {
            const mockUser = {
                id: '1d149899-e706-4c8f-97d7-ba2e9fc22d7c',
                name: 'Test User',
                username: 'testuser',
                bio: 'Software developer from Cairo',
                avatar_url: 'https://randomuser.me/api/portraits/men/15.jpg',
                cover_url: 'https://randomuser.me/api/portraits/men/16.jpg',
                followers_count: 2,
                following_count: 1,
                country: 'Egypt',
                created_at: '2025-09-15',
                is_follower: false,
                is_following: false,
                is_muted: true,
                is_blocked: false,
            }

            mockAxios.get.mockResolvedValue({
                data: [mockUser],
            })

            const result = await userInfoServiceMock.getUserInfoByUsername('testuser')

            expect(mockAxios.get).toHaveBeenCalledWith('/users', {
                params: { username: 'testuser' },
            })
            expect(result.username).toBe('testuser')
            expect(result.name).toBe('Test User')
        })

        it('throws error when user not found', async () => {
            mockAxios.get.mockResolvedValue({
                data: [],
            })

            await expect(userInfoServiceMock.getUserInfoByUsername('nonexistent')).rejects.toThrow(
                'User not found',
            )
        })
    })

    describe('followUser', () => {
        it('follows user and increments followers count', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: false,
                is_blocked: false,
                is_muted: false,
            }

            const updatedUser = {
                ...mockUser,
                is_following: true,
                followers_count: 101,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.followUser('123')

            expect(result.is_following).toBe(true)
            expect(result.followers_count).toBe(101)
        })
    })

    describe('unfollowUser', () => {
        it('unfollows user and decrements followers count', async () => {
            const mockUser = {
                username: 'testuser',
                followers_count: 100,
                is_following: true,
            }

            const updatedUser = {
                ...mockUser,
                is_following: false,
                followers_count: 99,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.unfollowUser('123')

            expect(result.is_following).toBe(false)
            expect(result.followers_count).toBe(99)
        })
    })

    describe('blockUser', () => {
        it('block user that i do not follow', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: false,
                is_blocked: false,
                is_muted: false,
            }

            const updatedUser = {
                ...mockUser,
                is_blocked: true,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.blockUser('123')
            expect(result.is_blocked).toBe(true)
        })

        it('block following user', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: true,
                is_follower: false,
                is_blocked: false,
                is_muted: false,
            }

            const updatedUser = {
                ...mockUser,
                is_blocked: true,
                is_following: false,
                followers_count: 99,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.blockUser('123')
            expect(result.is_blocked).toBe(true)
            expect(result.is_following).toBe(false)
            expect(result.followers_count).toBe(99)
        })
    })

    describe('unblockUser', () => {
        it('unblock user', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: false,
                is_blocked: true,
                is_muted: false,
            }

            const updatedUser = {
                ...mockUser,
                is_blocked: false,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.unblockUser('123')
            expect(result.is_blocked).toBe(false)
        })
    })

    describe('muteUser', () => {
        it('mute user', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: false,
                is_blocked: false,
                is_muted: false,
            }

            const updatedUser = {
                ...mockUser,
                is_muted: true,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.muteUser('123')
            expect(result.is_muted).toBe(true)
        })
    })

    describe('umuteUser', () => {
        it('unmute user', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: false,
                is_blocked: false,
                is_muted: true,
            }

            const updatedUser = {
                ...mockUser,
                is_muted: false,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.unmuteUser('123')
            expect(result.is_muted).toBe(false)
        })
    })

    describe('removeFollower', () => {
        it('remove this follower', async () => {
            const mockUser = {
                username: 'testuser',
                display_name: 'Test User',
                followers_count: 100,
                following_count: 50,
                is_following: false,
                is_follower: true,
                is_blocked: false,
                is_muted: true,
            }

            const updatedUser = {
                ...mockUser,
                is_follower: false,
                following_count: 49,
            }

            mockAxios.get.mockResolvedValue({ data: mockUser })
            mockAxios.request.mockResolvedValue({ data: updatedUser })

            const result = await userInfoServiceMock.removeFollower('123')
            expect(result.following_count).toBe(49)
            expect(result.is_follower).toBe(false)
        })
    })
})
