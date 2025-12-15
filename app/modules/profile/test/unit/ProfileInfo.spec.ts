import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { ref } from 'vue'
import ProfileInfo from '../../components/ProfileHeader/SubComponents/ProfileInfo.vue'

// Mock composables that cause import issues
vi.mock('../../composables/useUserInfo', () => ({
    useUserInfo: vi.fn(() => ({
        id: ref('123'),
        username: ref('mhassan123'),
        name: ref('Mohamed Hassan'),
        bio: ref('Hello world'),
        avatarUrl: ref(''),
        coverUrl: ref(''),
        followersCount: ref(20),
        followingCount: ref(10),
        isFollower: ref(false),
        isFollowing: ref(false),
        isMuted: ref(false),
        isBlocked: ref(false),
    })),
}))

vi.mock('../../composables/useUserInteractions', () => ({
    useUserInteractions: vi.fn(() => ({
        handleBlockWithConfirmation: vi.fn(),
        handleUnblockWithConfirmation: vi.fn(),
        handleMuteWithSnackbarWithAction: vi.fn(),
        handleUnmuteWithConfirmation: vi.fn(),
    })),
}))

describe('ProfileInfo Component', () => {
    const mockUser = {
        name: 'Mohamed Hassan',
        username: 'mhassan123',
        bio: 'Hello world',
        country: 'Egypt',
        birth_date: '1990-01-01',
        created_at: '2020-01-01',
        following_count: 10,
        followers_count: 20,
        mutual_followers_count: 0,
        top_mutual_followers: [],
    }

    it('renders user info correctly', () => {
        const wrapper = mount(ProfileInfo, {
            props: {
                user: mockUser,
                isMyProfile: false,
            },
            global: {
                plugins: [VueQueryPlugin],
                provide: {
                    snackbar: {
                        showSnackbar: vi.fn(),
                    },
                    confirmation: {
                        showConfirmation: vi.fn(),
                    },
                },
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>',
                    },
                },
                mocks: {
                    $t: (key: string) => key,
                },
            },
        })

        expect(wrapper.find('h1').text()).toBe('Mohamed Hassan')
        expect(wrapper.text()).toContain('@mhassan123')
        expect(wrapper.text()).toContain('Hello world')
        expect(wrapper.text()).toContain('Egypt')
    })
})
