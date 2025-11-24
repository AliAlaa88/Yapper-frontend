import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userInfoServiceReal } from '../../services/userInfoService.real'
import axios from 'axios'

const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

describe('userInfoServiceReal', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getMe', () => {
        it('fetches current user successfully', async () => {
            const mockMe = {
                user_id: '123',
                name: 'Current User',
                username: 'currentuser',
                bio: 'My bio',
                avatar_url: 'avatar.jpg',
                cover_url: 'cover.jpg',
                country: 'USA',
                created_at: '2024-01-01',
                birth_date: '1990-01-01',
                followers_count: 100,
                following_count: 50,
            }

            mockAxios.get.mockResolvedValue({
                data: { data: mockMe },
            })

            const result = await userInfoServiceReal.getMe()

            expect(mockAxios.get).toHaveBeenCalledWith('/users/me')
            expect(result).toEqual(mockMe)
        })

        it('throws error when user not found', async () => {
            mockAxios.get.mockResolvedValue({
                data: {},
            })

            await expect(userInfoServiceReal.getMe()).rejects.toThrow()
        })

        it('throws error on 401 status', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 401 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getMe()).rejects.toThrow('Invalid or expired token')
        })

        it('throws error on 404 status', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getMe()).rejects.toThrow('User not found')
        })
    })

    describe('getUserInfoByUsername', () => {
        it('fetches user by username successfully', async () => {
            const mockUser = {
                user_id: '123',
                name: 'Test User',
                username: 'testuser',
                bio: 'Test bio',
                avatar_url: 'avatar.jpg',
                is_follower: false,
                is_following: false,
                is_muted: false,
                is_blocked: false,
                top_mutual_followers: [],
                mutual_followers_count: '0',
            }

            mockAxios.get.mockResolvedValue({
                data: { data: mockUser },
            })

            const result = await userInfoServiceReal.getUserInfoByUsername('testuser')

            expect(mockAxios.get).toHaveBeenCalledWith('/users/by/username/testuser')
            expect(result).toEqual(mockUser)
        })

        it('throws error when user not found', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getUserInfoByUsername('nonexistent')).rejects.toThrow(
                'User not found',
            )
        })
    })

    describe('getUserByID', () => {
        it('fetches user by ID successfully', async () => {
            const mockUser = {
                user_id: '123',
                name: 'Test User',
                username: 'testuser',
                bio: 'Test bio',
                avatar_url: 'avatar.jpg',
                is_follower: false,
                is_following: false,
                is_muted: false,
                is_blocked: false,
                top_mutual_followers: [],
                mutual_followers_count: '0',
            }

            mockAxios.get.mockResolvedValue({
                data: { data: mockUser },
            })

            const result = await userInfoServiceReal.getUserByID('123')

            expect(mockAxios.get).toHaveBeenCalledWith('/users/123')
            expect(result).toEqual(mockUser)
        })

        it('throws error when userId is not provided', async () => {
            await expect(userInfoServiceReal.getUserByID('')).rejects.toThrow(
                'User ID is required',
            )
        })

        it('throws error on 404 status', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getUserByID('999')).rejects.toThrow('User not found')
        })
    })

    describe('followUser', () => {
        it('follows user successfully', async () => {
            mockAxios.post.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.followUser('123')

            expect(mockAxios.post).toHaveBeenCalledWith('/users/123/follow')
        })

        it('throws error when user not found', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.followUser('999')).rejects.toThrow('User not found')
        })

        it('throws error when user blocked you', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 403 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.followUser('123')).rejects.toThrow(
                'cannot follow user, user blocked you',
            )
        })

        it('throws error when trying to follow yourself', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.followUser('123')).rejects.toThrow(
                'You cannot follow yourself',
            )
        })

        it('throws error when already following', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 409 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.followUser('123')).rejects.toThrow(
                'Already following this user',
            )
        })
    })

    describe('unfollowUser', () => {
        it('unfollows user successfully', async () => {
            mockAxios.delete.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.unfollowUser('123')

            expect(mockAxios.delete).toHaveBeenCalledWith('/users/123/unfollow')
        })

        it('throws error when user not found', async () => {
            mockAxios.delete.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.unfollowUser('999')).rejects.toThrow('User not found')
        })
    })

    describe('blockUser', () => {
        it('blocks user successfully', async () => {
            mockAxios.post.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.blockUser('123')

            expect(mockAxios.post).toHaveBeenCalledWith('/users/123/block')
        })

        it('throws error when trying to block yourself', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.blockUser('123')).rejects.toThrow(
                'You cannot block yourself',
            )
        })

        it('throws error when already blocked', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 409 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.blockUser('123')).rejects.toThrow(
                'Already blocked this user',
            )
        })
    })

    describe('unblockUser', () => {
        it('unblocks user successfully', async () => {
            mockAxios.delete.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.unblockUser('123')

            expect(mockAxios.delete).toHaveBeenCalledWith('/users/123/unblock')
        })

        it('throws error when user not found', async () => {
            mockAxios.delete.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.unblockUser('999')).rejects.toThrow('User not found')
        })
    })

    describe('muteUser', () => {
        it('mutes user successfully', async () => {
            mockAxios.post.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.muteUser('123')

            expect(mockAxios.post).toHaveBeenCalledWith('/users/123/mute')
        })

        it('throws error when trying to mute yourself', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.muteUser('123')).rejects.toThrow(
                'You cannot mute yourself',
            )
        })

        it('throws error when already muted', async () => {
            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 409 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.muteUser('123')).rejects.toThrow(
                'Already muted this user',
            )
        })
    })

    describe('unmuteUser', () => {
        it('unmutes user successfully', async () => {
            mockAxios.delete.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.unmuteUser('123')

            expect(mockAxios.delete).toHaveBeenCalledWith('/users/123/unmute')
        })

        it('throws error when user not found', async () => {
            mockAxios.delete.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.unmuteUser('999')).rejects.toThrow('User not found')
        })
    })

    describe('removeFollower', () => {
        it('removes follower successfully', async () => {
            mockAxios.delete.mockResolvedValue({
                data: { message: 'Success' },
            })

            await userInfoServiceReal.removeFollower('123')

            expect(mockAxios.delete).toHaveBeenCalledWith('/users/123/remove-follower')
        })

        it('throws error when user not found', async () => {
            mockAxios.delete.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.removeFollower('999')).rejects.toThrow(
                'User not found',
            )
        })
    })

    describe('updateUserProfile', () => {
        it('updates user profile successfully', async () => {
            const updates = { name: 'Updated Name', bio: 'Updated bio' }
            const updatedUser = {
                user_id: '123',
                name: 'Updated Name',
                username: 'testuser',
                bio: 'Updated bio',
                avatar_url: 'avatar.jpg',
                cover_url: 'cover.jpg',
                country: 'USA',
                created_at: '2024-01-01',
                birth_date: '1990-01-01',
                followers_count: 100,
                following_count: 50,
            }

            mockAxios.patch.mockResolvedValue({
                data: { data: updatedUser },
            })

            const result = await userInfoServiceReal.updateUserProfile('123', updates)

            expect(mockAxios.patch).toHaveBeenCalledWith('/users/me', updates)
            expect(result).toEqual(updatedUser)
        })

        it('throws error when update fails', async () => {
            mockAxios.patch.mockResolvedValue({
                data: {},
            })

            await expect(
                userInfoServiceReal.updateUserProfile('123', { name: 'Test' }),
            ).rejects.toThrow()
        })

        it('throws error when username already taken', async () => {
            mockAxios.patch.mockRejectedValue({
                isAxiosError: true,
                response: { status: 409 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(
                userInfoServiceReal.updateUserProfile('123', { username: 'taken' }),
            ).rejects.toThrow('Username already taken')
        })

        it('throws error with invalid update data', async () => {
            mockAxios.patch.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(
                userInfoServiceReal.updateUserProfile('123', { name: '' }),
            ).rejects.toThrow('Invalid update data')
        })
    })

    describe('uploadAvatar', () => {
        it('uploads avatar successfully', async () => {
            const mockFile = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' })
            const imageUrl = 'https://example.com/avatar.jpg'

            mockAxios.post.mockResolvedValue({
                data: { data: { image_url: imageUrl } },
            })

            const result = await userInfoServiceReal.uploadAvatar('123', mockFile)

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/users/me/upload-avatar',
                expect.any(FormData),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            expect(result).toBe(imageUrl)
        })

        it('throws error when upload fails', async () => {
            const mockFile = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' })

            mockAxios.post.mockResolvedValue({
                data: {},
            })

            await expect(userInfoServiceReal.uploadAvatar('123', mockFile)).rejects.toThrow()
        })

        it('throws error with invalid file', async () => {
            const mockFile = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' })

            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.uploadAvatar('123', mockFile)).rejects.toThrow(
                'Invalid file upload',
            )
        })
    })

    describe('uploadCoverPhoto', () => {
        it('uploads cover photo successfully', async () => {
            const mockFile = new File(['content'], 'cover.jpg', { type: 'image/jpeg' })
            const imageUrl = 'https://example.com/cover.jpg'

            mockAxios.post.mockResolvedValue({
                data: { data: { image_url: imageUrl } },
            })

            const result = await userInfoServiceReal.uploadCoverPhoto('123', mockFile)

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/users/me/upload-cover',
                expect.any(FormData),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            expect(result).toBe(imageUrl)
        })

        it('throws error when upload fails', async () => {
            const mockFile = new File(['content'], 'cover.jpg', { type: 'image/jpeg' })

            mockAxios.post.mockResolvedValue({
                data: {},
            })

            await expect(userInfoServiceReal.uploadCoverPhoto('123', mockFile)).rejects.toThrow()
        })

        it('throws error with invalid file', async () => {
            const mockFile = new File(['content'], 'cover.jpg', { type: 'image/jpeg' })

            mockAxios.post.mockRejectedValue({
                isAxiosError: true,
                response: { status: 400 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.uploadCoverPhoto('123', mockFile)).rejects.toThrow(
                'Invalid file upload',
            )
        })
    })

    describe('getFollowers', () => {
        it('fetches followers successfully', async () => {
            const mockFollowers = [
                {
                    user_id: '1',
                    name: 'Follower 1',
                    username: 'follower1',
                    bio: 'Bio 1',
                    avatar_url: 'avatar1.jpg',
                    is_following: false,
                    is_follower: true,
                    is_muted: false,
                    is_blocked: false,
                },
            ]

            mockAxios.get.mockResolvedValue({
                data: { data: { data: mockFollowers } },
            })

            const result = await userInfoServiceReal.getFollowers('123')

            expect(mockAxios.get).toHaveBeenCalledWith('/users/123/followers')
            expect(result).toEqual(mockFollowers)
        })

        it('throws error when fetch fails', async () => {
            mockAxios.get.mockResolvedValue({
                data: {},
            })

            await expect(userInfoServiceReal.getFollowers('123')).rejects.toThrow()
        })

        it('throws error when user not found', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getFollowers('999')).rejects.toThrow('User not found')
        })
    })

    describe('getFollowing', () => {
        it('fetches following list successfully', async () => {
            const mockFollowing = [
                {
                    user_id: '1',
                    name: 'Following 1',
                    username: 'following1',
                    bio: 'Bio 1',
                    avatar_url: 'avatar1.jpg',
                    is_following: true,
                    is_follower: false,
                    is_muted: false,
                    is_blocked: false,
                },
            ]

            mockAxios.get.mockResolvedValue({
                data: { data: { data: mockFollowing } },
            })

            const result = await userInfoServiceReal.getFollowing('123')

            expect(mockAxios.get).toHaveBeenCalledWith('/users/123/following')
            expect(result).toEqual(mockFollowing)
        })

        it('throws error when fetch fails', async () => {
            mockAxios.get.mockResolvedValue({
                data: {},
            })

            await expect(userInfoServiceReal.getFollowing('123')).rejects.toThrow()
        })

        it('throws error when user not found', async () => {
            mockAxios.get.mockRejectedValue({
                isAxiosError: true,
                response: { status: 404 },
            })

            vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

            await expect(userInfoServiceReal.getFollowing('999')).rejects.toThrow('User not found')
        })
    })
})
