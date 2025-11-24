import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ProfileInfo from '../../components/ProfileHeader/SubComponents/ProfileInfo.vue'

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: { value: 'en' }
    })
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
        top_mutual_followers: []
    }

    it('renders user info correctly', () => {
        const wrapper = mount(ProfileInfo, {
            props: {
                user: mockUser,
                isMyProfile: false
            },
            global: {
                plugins: [VueQueryPlugin],
                provide: {
                    snackbar: {
                        showSnackbar: vi.fn()
                    },
                    confirmation: {
                        showConfirmation: vi.fn()
                    }
                },
                stubs: {
                    NuxtLink: {
                        template: '<a><slot /></a>'
                    }
                },
                mocks: {
                    $t: (key: string) => key
                }
            }
        })

        expect(wrapper.find('h1').text()).toBe('Mohamed Hassan')
        expect(wrapper.text()).toContain('@mhassan123')
        expect(wrapper.text()).toContain('Hello world')
        expect(wrapper.text()).toContain('Egypt')
    })
})
