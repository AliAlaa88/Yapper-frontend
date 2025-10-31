import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useUserActionsQuery } from '../../queries/useUserActionsQuery'
import { useUserInfo } from '../../composables/useUserInfo'

vi.mock('../../queries/useUserActionsQuery', () => ({
    useUserActionsQuery: vi.fn(),
}))

describe('useUserInfo', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return data when available', () => {
        const mockUser = {
            id: '12',
            username: 'hagar',
            is_follower: true,
            is_following: false,
            is_blocked: false,
            is_muted: true,
            name: 'Hagar Abdelsalam',
            bio: 'This is a test',
            avatar_url: 'https://example.com/avatar.jpg',
            followers_count: 100,
            following_count: 50,
            cover_url: 'https://example.com/cover.jpg',
        }

        const mockUserQuery = {
            data: ref(mockUser),
        }

        vi.mocked(useUserActionsQuery).mockReturnValue({
            userQuery: mockUserQuery,
        } as ReturnType<typeof useUserActionsQuery>)

        const userId = ref('12')
        const userInfo = useUserInfo(userId)

        expect(userInfo.id.value).toBe('12')
        expect(userInfo.username.value).toBe('hagar')
        expect(userInfo.isFollower.value).toBe(true)
        expect(userInfo.isFollowing.value).toBe(false)
        expect(userInfo.isBlocked.value).toBe(false)
        expect(userInfo.isMuted.value).toBe(true)
        expect(userInfo.name.value).toBe('Hagar Abdelsalam')
        expect(userInfo.bio.value).toBe('This is a test')
        expect(userInfo.avatarUrl.value).toBe('https://example.com/avatar.jpg')
        expect(userInfo.followersCount.value).toBe(100)
        expect(userInfo.followingCount.value).toBe(50)
        expect(userInfo.coverUrl.value).toBe('https://example.com/cover.jpg')
    })

    it('should be reactive to user data changes', () => {
        const mockUser = ref({
            id: '12',
            username: 'hagar',
            is_follower: true,
            is_following: false,
            is_blocked: false,
            is_muted: true,
            name: 'Hagar Abdelsalam',
            bio: 'This is a test',
            avatar_url: 'https://example.com/avatar.jpg',
            followers_count: 100,
            following_count: 50,
            cover_url: 'https://example.com/cover.jpg',
        })
        const mockUserQuery = {
            data: ref(mockUser),
        }

        vi.mocked(useUserActionsQuery).mockReturnValue({
            userQuery: mockUserQuery,
        } as ReturnType<typeof useUserActionsQuery>)

        const userId = ref('12')
        const userInfo = useUserInfo(userId)
        expect(userInfo.isMuted.value).toBe(true)
        expect(userInfo.name.value).toBe('Hagar Abdelsalam')

        mockUser.value = {
            ...mockUser.value,
            is_muted: false,
            name: 'Hagar',
        }

        expect(userInfo.isMuted.value).toBe(false)
        expect(userInfo.name.value).toBe('Hagar')
    })

    it('should handle partial data', () => {
        const mockUser = {
            id: '12',
            username: 'hagar',
        }

        const mockUserQuery = {
            data: ref(mockUser),
        }

        vi.mocked(useUserActionsQuery).mockReturnValue({
            userQuery: mockUserQuery,
        } as ReturnType<typeof useUserActionsQuery>)

        const userId = ref('12')
        const userInfo = useUserInfo(userId)
        expect(userInfo.id.value).toBe('12')
        expect(userInfo.username.value).toBe('hagar')
        expect(userInfo.isFollower.value).toBe(false)
        expect(userInfo.isFollowing.value).toBe(false)
        expect(userInfo.isBlocked.value).toBe(false)
        expect(userInfo.isMuted.value).toBe(false)
        expect(userInfo.avatarUrl.value).toBe('')
        expect(userInfo.followersCount.value).toBe('')
        expect(userInfo.followingCount.value).toBe('')
        expect(userInfo.coverUrl.value).toBe('')

    })
})
