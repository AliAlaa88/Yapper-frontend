import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ProfileCreatedAt from '../../components/ProfileHeader/SubComponents/ProfileCreatedAt.vue'
import { ref } from 'vue'

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: {
            getUserByID: vi.fn(() =>
                Promise.resolve({
                    user_id: '1',
                    username: 'test',
                    name: 'Test',
                    bio: 'Test bio',
                    avatar_url: null,
                    is_follower: false,
                    is_following: false,
                    is_muted: false,
                    is_blocked: false,
                }),
            ),
        },
        $queryClient: {},
    }),
}))

const mockCreatedDates = {
    mohamedHassan: '2025-09-15',
}

describe('ProfileCreatedAt Component', () => {
    it('renders Mohamed Hassan created date from db.json', () => {
        const wrapper = mount(ProfileCreatedAt, {
            props: {
                createdAt: mockCreatedDates.mohamedHassan,
            },
            global: {
                plugins: [VueQueryPlugin],
                provide: {
                    'user-id': ref('1'),
                },
            },
        })

        expect(wrapper.text()).toContain('9/15/2025')
    })
})
