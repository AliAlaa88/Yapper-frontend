import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileAvatar from '../../components/ProfileHeader/SubComponents/ProfileAvatar.vue'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('nuxt/app', () => ({
    useRoute: vi.fn(() => ({
        params: { username: 'testuser' },
    })),
}))

describe('ProfileAvatar', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('renders avatar image when avatarUrl is provided', () => {
        const wrapper = mount(ProfileAvatar, {
            props: {
                avatarUrl: 'https://example.com/avatar.jpg',
                displayName: 'Test User',
            },
            global: {
                stubs: {
                    NuxtLink: {
                        template: '<a :to="to" @click="$emit(\'click\')"><slot /></a>',
                        props: ['to'],
                    },
                },
            },
        })

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toBe('https://example.com/avatar.jpg')
        expect(wrapper.find('img').attributes('alt')).toBe('Test User')
    })

    it('renders fallback with first letter when no avatarUrl is provided', () => {
        const wrapper = mount(ProfileAvatar, {
            props: {
                displayName: 'Test User',
            },
            global: {
                stubs: {
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.find('img').exists()).toBe(true)
        expect(wrapper.find('img').attributes('src')).toContain('ui-avatars.com')
    })
})
