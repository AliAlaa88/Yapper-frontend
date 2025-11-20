import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ProfileBio from '../../components/ProfileHeader/SubComponents/ProfileBio.vue'
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

const mockBios = {
    mohamedHassan: 'Software developer from Cairo',
}

describe('ProfileBio Component', () => {
    it('renders Mohamed Hassan bio', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: mockBios.mohamedHassan,
            },
            global: {
                plugins: [VueQueryPlugin],
                provide: {
                    'user-id': ref('1'),
                },
            },
        })

        expect(wrapper.text()).toBe('Software developer from Cairo')
        expect(wrapper.find('p').exists()).toBe(true)
    })

    it('does not render when bio is empty', () => {
        const wrapper = mount(ProfileBio, {
            props: {
                bio: undefined,
            },
            global: {
                plugins: [VueQueryPlugin],
                provide: {
                    'user-id': ref('1'),
                },
            },
        })

        expect(wrapper.find('p').exists()).toBe(false)
    })
})
